'use client';
import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { experienceCopy } from '@/config/site';
export default function Modal({open,onClose,title,children,wide=false}:{open:boolean;onClose:()=>void;title:string;children:React.ReactNode;wide?:boolean}){
 const ref=useRef<HTMLDialogElement>(null);
 useEffect(()=>{const dialog=ref.current;if(!dialog)return;if(open){const previous=document.body.style.overflow;dialog.showModal();document.body.style.overflow='hidden';return()=>{dialog.close();document.body.style.overflow=previous;};}},[open]);
 return <dialog ref={ref} className={`site-modal ${wide?'wide-modal':''}`} aria-label={title} onCancel={onClose} onClick={e=>{if(e.target===e.currentTarget)onClose();}}><div className="modal-inner"><button type="button" className="modal-close" aria-label={experienceCopy.close} onClick={onClose}><X size={23}/></button>{children}</div></dialog>
}
