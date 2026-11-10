import React, { useState } from 'react';
import { Menu, X, ShoppingCart } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0,0)}>
            <div className="w-8 h-8 bg-brand-800 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">J</span>
            </div>
            <span className="font-bold text-xl tracking-tight text-brand-900">Japan Tengsu</span>
          </div>
          
          <div className="hidden md:flex space-x-8 items-center">
            <a href="#benefits" className="text-gray-600 hover:text-brand-600 font-medium transition-colors">Benefits</a>
            <a href="#reviews" className="text-gray-600 hover:text-brand-600 font-medium transition-colors">Reviews</a>
            <a href="#faq" className="text-gray-600 hover:text-brand-600 font-medium transition-colors">FAQ</a>
            <a href="#pricing" className="bg-brand-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-brand-700 transition-all shadow-lg hover:shadow-brand-500/30 flex items-center gap-2">
              <ShoppingCart size={18} />
              Order Now
            </a>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 hover:text-gray-900 focus:outline-none">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="#benefits" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-brand-600 hover:bg-gray-50">Benefits</a>
            <a href="#reviews" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-brand-600 hover:bg-gray-50">Reviews</a>
            <a href="#faq" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-brand-600 hover:bg-gray-50">FAQ</a>
            <a href="#pricing" onClick={() => setIsOpen(false)} className="block w-full text-center mt-4 bg-brand-600 text-white px-5 py-3 rounded-lg font-bold">
              Order Now
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;