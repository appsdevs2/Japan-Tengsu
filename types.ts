import type { ComponentType } from 'react';

export interface PricingPackage {
  id: string;
  count: number;
  title: string;
  price: number;
  originalPrice: number;
  savings: number;
  isPopular?: boolean;
  features: string[];
}

export interface Feature {
  title: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
}

export interface Testimonial {
  name: string;
  role: string;
  content: string;
  rating: number;
}

export type PaymentMethod = 'cod' | 'invoice';

export interface OrderFormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  paymentMethod: PaymentMethod;
  notes: string;
}

export interface SubmittedOrder {
  orderNumber: string;
  createdAt: string;
  pkg: PricingPackage;
  quantity: number;
  totalPrice: number;
  totalSavings: number;
  shippingLabel: string;
  customer: OrderFormData;
}