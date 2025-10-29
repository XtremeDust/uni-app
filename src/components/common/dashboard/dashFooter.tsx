import { HTMLAttributes } from 'react';
type FooterProps = HTMLAttributes<HTMLDivElement>;

export default function Footer({...props}:FooterProps){
    return(
        <div {...props}>
            © Copyright 2025 Walas de Margarita, Rif: J-50760740-0. Isla de Margarita - Venezuela.
        </div>
    );
}