import { Model, Schema } from 'mongoose';

export function addIdField(schema: Schema) {
  schema.add({
    id: { type: String },
  });

  schema.pre('save', function (next) {
    if (this._id && !this.id) {
      this.id = this._id.toString();
    }
    next();
  });
}

/**
 * Ensures all documents in a model have a string `id` field
 * equal to their `_id`. Use to bring all other fields to the same level
 * @param model Mongoose model to backfill
 */
export async function backfillIdField(model: Model<any>) {
  await model.updateMany({ id: { $exists: false } }, [
    { $set: { id: { $toString: '$_id' } } },
  ]);
}
