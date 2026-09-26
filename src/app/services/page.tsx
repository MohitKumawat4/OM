import React from 'react';
import { Metadata } from 'next';
import ServicesClient from './ServicesClient';

export const metadata: Metadata = {
  title: 'All Signage, Printing & Cladding Services',
  description:
    'Complete catalog of physical branding services by OM Advertising Chomu: Acrylic 3D Letters, LED Glow Boards, ACP Facade Cladding, PVC Louver Panels, Eco-Solvent Flex Printing, and Promotional Collateral.',
};

export default function ServicesPage() {
  return <ServicesClient />;
}
