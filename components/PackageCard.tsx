import React from 'react';
import { PricingPackage } from '../types';
import { Check } from 'lucide-react';

interface PackageCardProps {
  pkg: PricingPackage;
  onBuyNow: (pkg: PricingPackage) => void;
}

const PackageCard: React.FC<PackageCardProps> = ({ pkg, onBuyNow }) => {
  return (
    <div className={`relative flex flex-col p-6 rounded-2xl transition-all duration-300 ${
      pkg.isPopular 
        ? 'bg-white border-2 border-brand-500 shadow-2xl scale-105 z-10' 
        : 'bg-white border border-gray-200 shadow-lg hover:shadow-xl hover:border-brand-300'
    }`}>
      
      {pkg.isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-accent-500 to-amber-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-md tracking-wide uppercase">
          Best Value
        </div>
      )}

      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-900">{pkg.title}</h3>
        <p className="text-sm text-gray-500 mt-1">
            {pkg.count} {pkg.count === 1 ? 'Box' : 'Boxes'}
        </p>
      </div>

      <div className="mb-6 flex items-end gap-2">
        <span className="text-4xl font-extrabold text-slate-900 tabular-nums">${pkg.price}</span>
        <span className="text-lg text-gray-400 line-through decoration-red-400 decoration-2 mb-1 tabular-nums">${pkg.originalPrice}</span>
      </div>
      
      {pkg.savings > 0 && (
         <div className="mb-6 bg-green-50 text-green-700 px-3 py-1 rounded-md text-sm font-semibold inline-block self-start border border-green-100">
           Save {pkg.savings}%
         </div>
      )}

      <ul className="space-y-4 mb-8 flex-1">
        {pkg.features.map((feature, idx) => (
          <li key={idx} className="flex items-start">
            <Check className="h-5 w-5 text-brand-500 shrink-0 mr-3" />
            <span className="text-gray-600 text-sm">{feature}</span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => onBuyNow(pkg)}
        className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all transform hover:-translate-y-1 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 ${
          pkg.isPopular
            ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-lg shadow-brand-500/30 hover:shadow-brand-500/50'
            : 'bg-slate-900 text-white hover:bg-slate-800 shadow-md'
        }`}
      >
        Buy Now
      </button>
      
      <p className="text-xs text-center text-gray-400 mt-4">
        Free Shipping & Secure Checkout
      </p>
    </div>
  );
};

export default PackageCard;