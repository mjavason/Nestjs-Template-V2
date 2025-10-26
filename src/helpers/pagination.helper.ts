import { PaginationType } from '@common/types/responses/pagination.type';
import { FilterQuery, Model, SortOrder } from 'mongoose';

export async function paginate<T>(
  model: Model<T>,
  filter: FilterQuery<T>,
  sort: Record<string, SortOrder>,
  page: number,
  limit: number,
  select?: string[],
  populate?: string[],
  estimateCount = false,
) {
  const skip = (page - 1) * limit;

  let query = model.find(filter).sort(sort).skip(skip).limit(limit).lean();

  if (select?.length) {
    query = query.select(select.join(' ')) as typeof query;
  }

  if (populate?.length) {
    populate.forEach((path) => (query = query.populate(path)));
  }

  const countQuery =
    estimateCount && Object.keys(filter).length === 0
      ? model.estimatedDocumentCount()
      : model.countDocuments(filter);

  const [docs, totalCount] = await Promise.all([query.exec(), countQuery]);

  const totalPages = Math.ceil(totalCount / limit) || 1;
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;

  const pagination: PaginationType = {
    currentPage: page,
    totalPages,
    totalCount,
    hasNextPage,
    hasPreviousPage,
    nextPage: hasNextPage ? page + 1 : null,
    previousPage: hasPreviousPage ? page - 1 : null,
  };

  return {
    data: docs,
    pagination,
  };
}
