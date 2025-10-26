import { Model } from 'mongoose';

/**
 * Calculates the sum of a specific field in a MongoDB collection
 * over a given time window, compares it with the sum from the previous
 * equivalent window, and computes the percentage change.
 *
 * @param model - The Mongoose model to query
 * @param field - The field to sum over
 * @param difference - The number of days in the comparison window (default: 30)
 * @param filter - Additional query filters to apply
 * @param dateField - The date field to use for filtering (default: 'createdAt')
 * @returns An object containing:
 *  - current: the sum of the field in the current window
 *  - changePercentage: the percentage change compared to the previous window
 */
export async function getFieldSumChangeOverPeriod<T>(data: {
  model: Model<T>;
  field: string;
  difference: number;
  filter: Record<string, unknown>;
  dateField: string;
}) {
  const { model, field, difference, filter, dateField } = data;

  const currentDate = new Date();
  const pastDate = new Date();
  pastDate.setDate(currentDate.getDate() - difference);

  const [currentAgg] = await model.aggregate([
    {
      $match: { ...filter, [dateField]: { $gte: pastDate, $lte: currentDate } },
    },
    { $group: { _id: null, total: { $sum: `$${field}` } } },
  ]);
  const current = currentAgg?.total || 0;

  const [pastAgg] = await model.aggregate([
    {
      $match: {
        ...filter,
        [dateField]: {
          $gte: new Date(pastDate.getTime() - difference * 24 * 60 * 60 * 1000),
          $lt: pastDate,
        },
      },
    },
    { $group: { _id: null, total: { $sum: `$${field}` } } },
  ]);
  const past = pastAgg?.total || 0;

  if (past === current) {
    return { past, current, changePercentage: 0 };
  }

  const changePercentage =
    past === 0 ? 100 : Math.round(((current - past) / past) * 100 * 100) / 100;

  return { past, current, changePercentage };
}
