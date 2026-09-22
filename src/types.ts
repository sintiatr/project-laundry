export type PackageId = 'basic' | 'deep';

export interface ServicePackage {
  id: PackageId;
  name: string;
  codeName: string;
  price: number;
  description: string;
  scope: string[];
}

export interface AddonOption {
  id: 'express';
  name: string;
  price: number;
  description: string;
}

export interface OrderRecord {
  id: string;
  customer_name: string;
  customer_phone: string;
  selected_items: string;
  total_price: number;
  status: 'pending' | 'processed';
  created_at: string;
}

export interface CustomerDetails {
  name: string;
  phone: string;
}

export interface FormValidationErrors {
  name?: string;
  phone?: string;
}
