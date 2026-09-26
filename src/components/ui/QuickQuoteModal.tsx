'use client';
import { experienceCopy } from '@/config/site';
import Modal from './Modal';
import QuoteForm from './QuoteForm';
export default function QuickQuoteModal({isOpen,onClose,initialService=''}:{isOpen:boolean;onClose:()=>void;initialService?:string}){return <Modal open={isOpen} onClose={onClose} title={experienceCopy.form.title}><p className="eyebrow">{experienceCopy.pages.contact.eyebrow}</p><h2>{experienceCopy.form.title}</h2><p className="modal-description">{experienceCopy.form.description}</p>{isOpen&&<QuoteForm key={initialService} initialService={initialService}/>}</Modal>}
