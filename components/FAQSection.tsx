'use client';

import { useState, useCallback } from 'react';
import { FAQItem } from '../lib/types';

interface Props {
  faqs: FAQItem[];
  prefName: string;
  jobTypeName: string;
}

export default function FAQSection({ faqs, prefName, jobTypeName }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleToggle = useCallback((index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  }, []);

  return (
    <section className="my-10" id="faq">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-l-4 border-blue-600 pl-4">
        {prefName}の{jobTypeName}転職 よくある質問
      </h2>
      <div className="space-y-2">
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={i}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => handleToggle(i)}
                className="w-full flex items-start justify-between p-4 text-left bg-white hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-400"
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${i}`}
              >
                <span className="flex items-start gap-2 font-medium text-gray-800 min-w-0 flex-1">
                  <span className="shrink-0 font-bold text-blue-600 leading-snug">Q.</span>
                  <span className="break-words">{faq.question}</span>
                </span>
                <span
                  className={`shrink-0 ml-3 text-gray-400 transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                  aria-hidden="true"
                >
                  ▼
                </span>
              </button>
              {/* max-height アニメーションで CLS を防ぐ */}
              <div
                id={`faq-answer-${i}`}
                className="overflow-hidden transition-all duration-200 ease-in-out"
                style={{ maxHeight: isOpen ? '600px' : '0px' }}
              >
                <div className="bg-blue-50 border-t border-gray-200 p-4">
                  <div className="flex gap-2 text-gray-700 text-sm leading-relaxed">
                    <span className="shrink-0 font-bold text-amber-600">A.</span>
                    <p>{faq.answer}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
