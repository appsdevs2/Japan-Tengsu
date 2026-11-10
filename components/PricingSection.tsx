import React from 'react';
import { Lock, CreditCard, Banknote } from 'lucide-react';
import { PACKAGES } from '../constants';
import { PricingPackage } from '../types';
import PackageCard from './PackageCard';

interface PricingSectionProps {
  onBuyNow: (pkg: PricingPackage) => void;
}

const PricingSection: React.FC<PricingSectionProps> = ({ onBuyNow }) => {
  return (
    <section id="pricing" className="py-24 bg-slate-50 relative overflow-hidden">
        {/* Background decorative blob */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-white/50 skew-y-6 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-base text-brand-600 font-semibold tracking-wide uppercase">Exclusive Offers</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Select Your Package
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Choose the package that suits your needs. Bulk orders come with significant discounts and free priority shipping.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-start">
          {PACKAGES.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} onBuyNow={onBuyNow} />
          ))}
        </div>
        
        <div className="mt-12 text-center">
            <div className="inline-flex flex-wrap items-center justify-center gap-4 bg-white px-6 py-3 rounded-full shadow-sm border border-gray-100">
                <span className="inline-flex items-center gap-2 text-xs font-medium text-slate-600">
                  <CreditCard className="w-4 h-4 text-brand-600" />
                  Card & PayPal Link
                </span>
                <span className="text-slate-300" aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-2 text-xs font-medium text-slate-600">
                  <Banknote className="w-4 h-4 text-brand-600" />
                  Cash on Delivery
                </span>
                <span className="text-slate-300 hidden sm:inline" aria-hidden="true">|</span>
                <span className="inline-flex items-center gap-1.5 text-sm text-gray-500 sm:border-l sm:pl-4 border-gray-200">
                  <Lock className="w-4 h-4 text-emerald-600" />
                  100% Secure & Encrypted Checkout
                </span>
            </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;