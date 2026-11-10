import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQS = [
  {
    question: "How long does shipping take?",
    answer: "Standard shipping typically takes 5-7 business days. Our express options (included in 3+ packs) usually arrive within 2-3 business days."
  },
  {
    question: "Is the packaging discreet?",
    answer: "Absolutely. We understand the need for privacy. All orders are shipped in plain, unmarked boxes with no indication of contents on the label."
  },
  {
    question: "What is the recommended dosage?",
    answer: "We recommend taking one tablet approximately 20-30 minutes before activity. Do not exceed more than one tablet in a 24-hour period."
  },
  {
    question: "Is there a money-back guarantee?",
    answer: "Yes! We offer a no-questions-asked money-back guarantee. The duration depends on the package you choose, ranging from 30 to 120 days."
  }
];

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <button 
                className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              >
                <span className="font-semibold text-gray-800">{faq.question}</span>
                {openIndex === idx ? <ChevronUp className="text-brand-500" size={20} /> : <ChevronDown className="text-gray-400" size={20} />}
              </button>
              <div className={`px-6 text-gray-600 transition-all duration-300 ease-in-out overflow-hidden ${openIndex === idx ? 'max-h-48 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                {faq.answer}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;