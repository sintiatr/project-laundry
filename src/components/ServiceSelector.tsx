import React from 'react';
import { PackageId, ServicePackage, AddonOption } from '../types';
import { formatRupiah } from '../lib/formatters';

interface ServiceSelectorProps {
  packages: ServicePackage[];
  selectedPackageId: PackageId;
  onSelectPackage: (id: PackageId) => void;
  expressAddon: AddonOption;
  isExpressSelected: boolean;
  onToggleExpress: () => void;
}

export const ServiceSelector: React.FC<ServiceSelectorProps> = ({
  packages,
  selectedPackageId,
  onSelectPackage,
  expressAddon,
  isExpressSelected,
  onToggleExpress,
}) => {
  return (
    <div id="service-configuration-section" className="space-y-6">
      {/* Base Package Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-neutral-900 uppercase tracking-wide">
            1. Select Base Cleaning Package
          </label>
          <span className="text-xs text-neutral-500 font-medium">1 Required</span>
        </div>

        <div className="space-y-3" role="radiogroup" aria-label="Base cleaning package options">
          {packages.map((pkg) => {
            const isSelected = selectedPackageId === pkg.id;
            return (
              <button
                key={pkg.id}
                id={`package-option-${pkg.id}`}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => onSelectPackage(pkg.id)}
                className={`w-full text-left p-4 rounded-lg transition-all min-h-[44px] bg-white cursor-pointer ${
                  isSelected
                    ? 'border-2 border-neutral-900 shadow-xs'
                    : 'border border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'border-neutral-900 bg-neutral-900'
                          : 'border-neutral-300 bg-white'
                      }`}
                    >
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <div>
                      <div className="font-semibold text-neutral-900 text-base">
                        {pkg.name}
                      </div>
                      <p className="text-sm text-neutral-600 mt-1">
                        {pkg.description}
                      </p>
                      <div className="mt-2.5 flex flex-wrap gap-1.5">
                        {pkg.scope.map((item, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center text-xs font-medium px-2 py-0.5 bg-neutral-100 text-neutral-700 rounded-lg"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-base font-bold text-neutral-900">
                      {formatRupiah(pkg.price)}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Add-on Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-neutral-900 uppercase tracking-wide">
            2. Optional Turnaround Add-on
          </label>
          <span className="text-xs text-neutral-500 font-medium">Optional</span>
        </div>

        <button
          id="addon-toggle-express"
          type="button"
          role="checkbox"
          aria-checked={isExpressSelected}
          onClick={onToggleExpress}
          className={`w-full text-left p-4 rounded-lg transition-all min-h-[44px] bg-white cursor-pointer ${
            isExpressSelected
              ? 'border-2 border-neutral-900 shadow-xs'
              : 'border border-neutral-200 hover:border-neutral-300'
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div
                className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                  isExpressSelected
                    ? 'border-neutral-900 bg-neutral-900 text-white'
                    : 'border-neutral-300 bg-white'
                }`}
              >
                {isExpressSelected && (
                  <svg
                    className="w-3.5 h-3.5 stroke-current stroke-2 fill-none"
                    viewBox="0 0 24 24"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
              <div>
                <div className="font-semibold text-neutral-900 text-base">
                  {expressAddon.name}
                </div>
                <p className="text-sm text-neutral-600 mt-1">
                  {expressAddon.description}
                </p>
                <div className="mt-2">
                  <span className="inline-flex items-center text-xs font-medium px-2 py-0.5 bg-neutral-100 text-neutral-700 rounded-lg">
                    Fast Track (24h)
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="text-base font-bold text-neutral-900">
                +{formatRupiah(expressAddon.price)}
              </span>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};
