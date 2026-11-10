import { PricingPackage, Feature, Testimonial } from './types';
import { ShieldCheck, Zap, Leaf, Award } from 'lucide-react';

export const PACKAGES: PricingPackage[] = [
  {
    id: 'pkg-1',
    count: 1,
    title: 'Trial Pack',
    price: 49,
    originalPrice: 69,
    savings: 29,
    features: [
      '1 Bottle (16 Tablets)',
      'Standard Shipping',
      '30-Day Money Back Guarantee'
    ]
  },
  {
    id: 'pkg-3',
    count: 3,
    title: 'Starter Bundle',
    price: 129,
    originalPrice: 207,
    savings: 38,
    features: [
      '3 Bottles (48 Tablets)',
      'Free Express Shipping',
      'Priority Support',
      '60-Day Money Back Guarantee'
    ]
  },
  {
    id: 'pkg-5',
    count: 5,
    title: 'Most Popular',
    price: 199,
    originalPrice: 345,
    savings: 42,
    isPopular: true,
    features: [
      '5 Bottles (80 Tablets)',
      'Free Express Shipping',
      'Gift Included',
      'Lifetime Support',
      '90-Day Money Back Guarantee'
    ]
  },
  {
    id: 'pkg-10',
    count: 10,
    title: 'Wholesale Deal',
    price: 349,
    originalPrice: 690,
    savings: 50,
    features: [
      '10 Bottles (160 Tablets)',
      'Free Priority Shipping',
      '2 Mystery Gifts',
      'Dedicated Account Manager',
      '120-Day Money Back Guarantee'
    ]
  }
];

export const FEATURES: Feature[] = [
  {
    title: '100% Natural Herbal',
    description: 'Formulated with premium natural ingredients traditionally used for vitality.',
    icon: Leaf
  },
  {
    title: 'Fast Acting Formula',
    description: 'Designed for quick absorption to get you ready when it matters most.',
    icon: Zap
  },
  {
    title: 'Clinically Tested',
    description: 'Rigorously tested for safety and quality assurance standards.',
    icon: ShieldCheck
  },
  {
    title: 'Premium Quality',
    description: 'Manufactured in GMP certified facilities ensuring top-tier excellence.',
    icon: Award
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "James T.",
    role: "Verified Buyer",
    content: "I was skeptical at first, but the 3-pack bundle was a game changer. The energy boost is real and sustained.",
    rating: 5
  },
  {
    name: "Michael R.",
    role: "Long-term Customer",
    content: "I buy the 10-pack for the incredible savings. Japan Tengsu has consistently delivered quality for over a year now.",
    rating: 5
  },
  {
    name: "David K.",
    role: "Verified Buyer",
    content: "Shipping was incredibly fast. The 5-bottle package is definitely the sweet spot for value. Highly recommended.",
    rating: 4
  }
];