import queryString from "query-string";

type QueryParams = Record<
  string,
  string | number | boolean | null | undefined
>;

export const queryStrings = (params: QueryParams): string => {
  return queryString.stringify(params, {
    skipNull: true,
  });
};