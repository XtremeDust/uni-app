import React,{ HTMLAttributes } from "react";

interface TableHeadProps extends HTMLAttributes<HTMLTableSectionElement>{}
interface TableHeaderCellProps extends HTMLAttributes<HTMLTableHeaderCellElement>{}

export const TableHead=({children,...props}:TableHeadProps)=>(
    <thead {...props}>
        <tr>
            {children}
        </tr>
    </thead>
);

export const TableHeaderCell = ({ children, ...props }: TableHeaderCellProps) => (
    <th {...props}>
        {children}
    </th>
);



