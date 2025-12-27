import { useMemo } from "react";

type PaginationOptions<T> ={
    data: T[];          // Any type of data object 
    page: number;
    pageSize: number;   // How many items per page.
}

// page = 1  // first page
// page = 2  // second page

export function usePagination<T>({
    data,
    page,
    pageSize
}: PaginationOptions<T>){
    return useMemo(()=>{
        const totalPages = Math.ceil(data.length / pageSize);
        
        const PaginationData = data.slice(
            (page -  1) * pageSize,
            page*pageSize
        );

        return {
            totalPages,
            PaginationData,
        };
    } , [data,page,pageSize])
}