import { SCHEMA_KEYS } from '@configs/constants/constants';
import {
  Connection,
  Document,
  FilterQuery,
  Model,
  UpdateQuery,
} from 'mongoose';

type DefaultOption = unknown | (() => unknown);

/**
 * Apply schema defaults to existing documents for the provided model.
 * Returns the number of documents that were updated.
 *
 * Notes:
 * - Default functions are evaluated per-document at the time of update.
 * - Only fields that are strictly undefined on the document are set.
 * - Updates use $set to avoid replacing entire documents.
 */
export async function applyDefaultsToModel<T extends Document>(
  model: Model<T>,
): Promise<number> {
  let updateCount = 0;
  const schema = model.schema;

  // Collect schema paths that declare a default (store the raw default value/function)
  const defaults: Array<[string, DefaultOption]> = Object.entries(schema.paths)
    .filter(([, path]) => (path as any).options?.default !== undefined)
    .map(([key, path]) => [key, (path as any).options.default]);

  // console.log('Defaults to apply for model', model.modelName, defaults);

  if (defaults.length === 0) return 0;

  for (const [key, defaultValue] of defaults) {
    const result = await model.updateMany(
      { [key]: { $exists: false } } as FilterQuery<T>,
      {
        $set: {
          [key]:
            typeof defaultValue === 'function' ? defaultValue() : defaultValue,
        },
      } as UpdateQuery<T>,
    );
    updateCount += result.modifiedCount;
  }

  return updateCount;
}

export async function applyDefaultsToAllModels(
  connection: Connection,
): Promise<void> {
  for (const modelName of Object.values(SCHEMA_KEYS)) {
    const model = connection.models[modelName];

    if (!model) {
      console.warn(`[Defaults] Model "${modelName}" is not registered`);

      continue;
    }

    const updated = await applyDefaultsToModel(model);

    console.log(`[Defaults] ${modelName}: ${updated} documents updated`);
  }
  console.log('[Defaults] All models processed');
}
