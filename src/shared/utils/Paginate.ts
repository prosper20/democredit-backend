export const paginate = async (
  totalItems: number,
  page = 1,
  limit = 10
) => {
  const hasNextPage = limit * page < totalItems;
  const hasPreviousPage = page > 1;

  return {
    page,
    hasNextPage,
    hasPreviousPage,
    nextPage: hasNextPage ? page + 1 : null,
    previousPage: hasPreviousPage ? page - 1 : null,
    lastPage: Math.ceil(totalItems / limit),
  };
};
