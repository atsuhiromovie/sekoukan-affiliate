'use client';

import { useState } from 'react';
import { FAQItem } from '../lib/types';

interface Props {
  faqs: FAQItem[];
  prefName: string;
  jobTypeName: string;
}

export default function FAQSection({ faqs, prefName, jobTypeName }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="my-10" id="faq">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-l-4 border-blue-600 pl-4">
        {prefName}の{jobTypeName}転職 よくある質問
      </h2>
      <div className="space-y-2">
        {faqs.map((faq, i) => (
          <div
            key={i}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-start justify-between p-4 text-left bg-white hover:bg-blue-50 transition-colors"
              aria-expanded={openIndex === i}
            >
              <span className="flex items-start gap-2 font-medium text-gray-800">
                <span className="shrink-0 font-bold text-blue-600">Q.</span>
                {faq.question}
              </span>
              <span
                className={`shrink-0 ml-3 text-gray-400 transition-transform ${
                  openIndex === i ? 'rotate-180' : ''
                }`}
              >
                ▼
              </span>
            </button>
            {openIndex === i && (
              <div className="bg-blue-50 border-t border-gray-200 p-4">
                <div className="flex gap-2 text-gray-700 text-sm leading-relaxed">
                  <span className="shrink-0 font-bold text-amber-600">A.</span>
                  <p>{faq.answer}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
