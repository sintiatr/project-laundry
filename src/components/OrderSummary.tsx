import React from 'react';
import { ServicePackage, AddonOption } from '../types';
import { formatRupiah } from '../lib/formatters';

interface OrderSummaryProps {
  selectedPackage: ServicePackage;
  isExpressSelected: boolean;
  expressAddon: AddonOption;
  totalPrice: number;
  onSendToWhatsApp: () => void;
  isSubmitting: boolean;
  submitSuccessUrl: string | null;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  selectedPackage,
  isExpressSelected,
  expressAddon,
  totalPrice,
  onSendToWhatsApp,
  isSubmitting,
  submitSuccessUrl,
}) => {
  return (
    <div id="sticky-order-summary-container" className="sticky top-6">
      <div className="bg-white border border-neutral-200 rounded-lg p-6 shadow-xs">
        <h2 id="order-summary-heading" className="text-base font-semibold text-neutral-900 pb-4 border-b border-neutral-200">
          Estimated Order Summary
        </h2>

        {/* Itemized Line Items */}
        <div id="itemized-summary-list" className="py-4 space-y-3">
          <div className="flex items-start justify-between text-sm">
            <div>
              <span className="font-medium text-neutral-900 block">{selectedPackage.name}</span>
              <span className="text-xs text-neutral-500">Base service package</span>
            </div>
            <span className="font-medium text-neutral-900 shrink-0">
              {formatRupiah(selectedPackage.price)}
            </span>
          </div>

          {isExpressSelected && (
            <div className="flex items-start justify-between text-sm">
              <div>
                <span className="font-medium text-neutral-900 block">{expressAddon.name}</span>
                <span className="text-xs text-neutral-500">24-hour turnaround</span>
              </div>
              <span className="font-medium text-neutral-900 shrink-0">
                +{formatRupiah(expressAddon.price)}
              </span>
            </div>
          )}

          <div className="pt-3 border-t border-neutral-200 flex items-baseline justify-between">
            <div>
              <span className="text-sm font-semibold text-neutral-900 block">Total Estimation</span>
              <span className="text-xs text-neutral-500">Transparent pricing</span>
            </div>
            <div className="text-right">
              <span id="summary-total-price" className="text-2xl font-bold text-neutral-900 tracking-tight">
                {formatRupiah(totalPrice)}
              </span>
            </div>
          </div>
        </div>

        {/* Pricing boundary note */}
        <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-3 text-xs text-neutral-600 mb-5">
          <p className="font-medium text-neutral-800">Fixed Transparent Rates</p>
          <p className="mt-0.5">Estimates range between Rp50.000 and Rp115.000 based on selected options.</p>
        </div>

        {/* Primary CTA Button */}
        <button
          id="btn-send-whatsapp-order"
          type="button"
          disabled={isSubmitting}
          onClick={onSendToWhatsApp}
          className="w-full h-11 min-h-[44px] px-4 rounded-lg font-medium text-sm text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
        >
          {isSubmitting ? (
            <span>Processing Order...</span>
          ) : (
            <>
              {/* WhatsApp Icon */}
              <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.299.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.353.101.173.448.74 0.961 1.197.66.587 1.217.768 1.39.855.173.086.275.072.376-.044.101-.116.433-.506.549-.679.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.044.073.044.419-.1.824z" />
              </svg>
              <span>Send Order to WhatsApp</span>
            </>
          )}
        </button>

        {/* Fallback Direct Link in case popup blocked by browser/iframe */}
        {submitSuccessUrl && (
          <div id="whatsapp-fallback-banner" className="mt-4 p-3 bg-neutral-50 border border-neutral-200 rounded-lg text-xs text-neutral-700">
            <p className="font-semibold text-neutral-900 mb-1">Order Saved to Database</p>
            <p className="text-neutral-600 mb-2">If WhatsApp did not open automatically, click the link below:</p>
            <a
              id="link-direct-whatsapp-chat"
              href={submitSuccessUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-medium text-emerald-700 hover:text-emerald-800 underline"
            >
              Open WhatsApp Chat Directly &rarr;
            </a>
          </div>
        )}

        <p className="text-xs text-neutral-500 mt-4 text-center leading-relaxed">
          Submitting creates a reference record in our database and opens WhatsApp with your pre-filled inquiry.
        </p>
      </div>
    </div>
  );
};
