import React, {HTMLAttributes} from "react";

interface TableRowProps extends HTMLAttributes<HTMLTableRowElement>{}
interface TableCellProps extends HTMLAttributes<HTMLTableCellElement>{}
interface TableBodyProps extends HTMLAttributes<HTMLTableSectionElement>{}

export const TableBody = ({children, ...props}:TableBodyProps)=>(
    <tbody {...props}>
        {children}
    </tbody>
);

export const TableRow = ({children, ...props}: TableRowProps)=>(
    <tr {...props}>
        {children}
    </tr>
);

export const TableCell = ({children,className, ...props}:TableCellProps)=>(
    <td {...props} className={`py-2 px-4 whitespace-nowrap text-gray-800 ${className}`}>
        {children}
    </td>
)
