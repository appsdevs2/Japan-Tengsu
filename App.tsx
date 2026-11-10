import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import PricingSection from './components/PricingSection';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import OrderModal from './components/OrderModal';
import { PricingPackage } from './types';

function App() {
  const [selectedPackage, setSelectedPackage] = useState<PricingPackage | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <PricingSection onBuyNow={(pkg) => setSelectedPackage(pkg)} />
        <Testimonials />
        <FAQ />
      </main>
      <Footer />
      <OrderModal
        selectedPackage={selectedPackage}
        onClose={() => setSelectedPackage(null)}
        onSelectPackage={(pkg) => setSelectedPackage(pkg)}
      />
    </div>
  );
}

export default App;