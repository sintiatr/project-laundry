import { ServicePackage, AddonOption } from '../types';

export const SERVICE_PACKAGES: ServicePackage[] = [
  {
    id: 'basic',
    name: 'Package A (Basic Clean)',
    codeName: 'Package A',
    price: 50000,
    description: 'Standard exterior cleaning for daily wear shoes.',
    scope: ['Upper', 'Midsole', 'Laces'],
  },
  {
    id: 'deep',
    name: 'Package B (Deep Clean)',
    codeName: 'Package B',
    price: 90000,
    description: 'Comprehensive interior and exterior restoration with deep stain extraction.',
    scope: ['Upper', 'Midsole', 'Insole', 'Outsole', 'Deep stain removal'],
  },
];

export const EXPRESS_ADDON: AddonOption = {
  id: 'express',
  name: 'Express Delivery',
  price: 25000,
  description: '24-hour turnaround service.',
};
