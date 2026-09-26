import React from 'react';
import { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
  title: 'Contact Workshop & Get Quotation | Chomu, Jaipur',
  description:
    'Contact OM Advertising in Chomu, Jaipur. Call +91 97998 52206 / +91 98295 37889 or chat on WhatsApp for fast signage, ACP cladding, and printing estimates.',
};

export default function ContactPage() {
  return <ContactClient />;
}
