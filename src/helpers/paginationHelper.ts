import { SortOrder } from "mongoose";

type IOptions = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: SortOrder; // SortOrder from mongoose for sorting.
};

type IOptionsResult = {
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: SortOrder;
};

const calculatePagination = (options: IOptions): IOptionsResult => {
  const page = Number(options.page || 1);
  const limit = Number(options.limit || 10);
  const skip = (page - 1) * limit; // pagination and limit calculation formula.

  const sortBy = options.sortBy || "createdAt"; // default latest created time
  const sortOrder = options.sortOrder || "desc"; // default descending sort.

  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
  };
};

export const paginationHelpers = {
  calculatePagination,
};
