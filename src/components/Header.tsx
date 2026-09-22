import React from 'react';

export const Header: React.FC = () => {
  return (
    <header id="header-section" className="border-b border-neutral-200 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-neutral-900 text-white font-semibold text-sm">
                SC
              </span>
              <h1 id="brand-title" className="text-xl sm:text-2xl font-semibold text-neutral-900 tracking-tight">
                Sneaker Clean & Restoration Estimator
              </h1>
            </div>
            <p id="brand-instruction" className="text-sm text-neutral-600 mt-1.5">
              Calculate your cleaning package and submit your order directly to WhatsApp.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-neutral-100 text-neutral-800 border border-neutral-200">
              Instant Quotation
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
