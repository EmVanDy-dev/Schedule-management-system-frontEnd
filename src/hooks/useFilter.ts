import { useMemo } from "react";

type FilterOptions<T> = {
  data: T[];
  search: string;
  searchFields: (keyof T)[]; // Type-safe because of keyof T
  roleField?: keyof T;
  roleValue?: string;
};

export function useFilter<T>({
  data,
  search,
  searchFields,
  roleField,
  roleValue,
}: FilterOptions<T>) {
  return useMemo(() => {
    return data.filter((item) => {
      // SEARCH FILTER (string + number)
      const matchSearch =
        search === "" ||
        searchFields.some((field) => {
          const value = item[field];

          if (value === null || value === undefined) return false;

          return value.toString().toLowerCase().includes(search.toLowerCase());
        });

      //  ROLE / TYPE FILTER (optional)
      const matchRole =
        !roleField ||
        !roleValue ||
        roleValue === "ALL" ||
        item[roleField] === roleValue;


      return matchSearch && matchRole;
    });
  }, [data, search, searchFields, roleField, roleValue]);
}
