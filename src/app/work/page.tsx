import React from 'react';
import { Metadata } from 'next';
import WorkClient from './WorkClient';

export const metadata: Metadata = {
  title: 'Our Work & Portfolio | Digital Showroom',
  description:
    'Explore supplied signage, facade and design references, with concepts and reference imagery clearly identified.',
};

export default function WorkPage() {
  return <WorkClient />;
}
