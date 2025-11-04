import React, { ReactElement } from "react";
import {Button} from "@/types/ui_components";

export interface PropsModal{
    BTmain:string;
    className?:string;
    //onSumit:()=>void;
    BTSecond:string;
    onClose:()=>void;
    onSumit?:()=>void;
    disabled?: boolean;
}

 export function FooterModal({BTmain, BTSecond, className ,onClose, onSumit, disabled,...props}:PropsModal){
    return(
        <div className={`ooter-modal flex justify-between ${className}`} {...props}>

            <Button variant={"btn-secondary"} onClick={onClose}>
                {BTSecond}
            </Button>

            <Button variant={''}  onClick={onSumit} disabled={disabled} className={disabled ? 'cursor-not-allowed btn-secondary invert-20' : 'btn-primary'}>
                {BTmain}
            </Button>
        </div>
    );
 }