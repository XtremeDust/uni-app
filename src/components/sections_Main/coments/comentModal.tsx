// CommentModal.tsx (Esqueleto)

import { Modal, ContainModal, HeaderModal } from "@/types/ui_components";
import { Coment } from "@/types/comentarios";

interface CommentModalProps {
    coment: Coment | null;
    onClose: () => void;
}

export default function CommentModal({ coment, onClose }: CommentModalProps) {
    if (!coment) return null;

    return (
        <Modal state={!!coment}>
            <ContainModal className="w-full bg-white max-w-lg">
                <HeaderModal onClose={onClose}>
                    <h2 className="text-4xl font-bold">Comentario Completo</h2>
                </HeaderModal>
                <div className="p-3">
                    <p className="text-[18px] font-bold text-slate-800">{coment.name || coment.email} ({coment.date})</p>
                    <hr className="my-3"/>
                    <p className="text-gray-700 text-[16px] whitespace-pre-wrap">{coment.content.contenido}</p>
                </div>
            </ContainModal>
        </Modal>
    );
}