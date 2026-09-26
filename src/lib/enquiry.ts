import { experienceCopy, siteConfig } from '@/config/site';
export type Enquiry = {name:string;phone:string;service:string;dimensions:string;message:string};
export function resolveService(input:string){const service=siteConfig.coreServices.find(s=>s.id===input||s.title===input);return service?.title||experienceCopy.fullService;}
export function buildEnquiryUrl(data:Enquiry,channel:'whatsapp'|'email'){
 const text=[experienceCopy.form.subject,`${experienceCopy.form.name}: ${data.name.trim()}`,`${experienceCopy.form.phone}: ${data.phone.trim()}`,`${experienceCopy.form.service}: ${resolveService(data.service)}`,`${experienceCopy.form.dimensions}: ${data.dimensions.trim()}`,`${experienceCopy.form.message}: ${data.message.trim()}`].join('\n');
 return channel==='email'?`mailto:${siteConfig.contact.email}?subject=${encodeURIComponent(experienceCopy.form.subject)}&body=${encodeURIComponent(text)}`:`https://wa.me/91${siteConfig.contact.whatsappNumber}?text=${encodeURIComponent(text)}`;
}
