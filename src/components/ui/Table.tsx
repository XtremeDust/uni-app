import React,{ HTMLAttributes } from 'react';
import { TableBody } from './TableBody';
import { TableCell } from './TableBody';
import { TableRow } from './TableBody';
import { TableHead } from './TableHead';

type TableProps = HTMLAttributes<HTMLTableElement>

export function Table({children,...props}:TableProps){
    return(
        <div className='overflow-x-auto'>
            <table {...props}>                                        
                {children}        
            </table>         
        </div>
    );
}export default Table

Table.Head=TableHead;
Table.Row = TableRow;
Table.Cell = TableCell;
Table.Body = TableBody; 