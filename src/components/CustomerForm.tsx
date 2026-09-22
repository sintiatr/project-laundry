import React from 'react';
import { FormValidationErrors } from '../types';

interface CustomerFormProps {
  name: string;
  phone: string;
  onChangeName: (val: string) => void;
  onChangePhone: (val: string) => void;
  errors: FormValidationErrors;
}

export const CustomerForm: React.FC<CustomerFormProps> = ({
  name,
  phone,
  onChangeName,
  onChangePhone,
  errors,
}) => {
  return (
    <div id="customer-form-section" className="space-y-4 pt-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-neutral-900 uppercase tracking-wide">
          3. Customer Information
        </label>
        <span className="text-xs text-neutral-500 font-medium">Required for Order</span>
      </div>

      <div className="space-y-4 bg-white p-5 rounded-lg border border-neutral-200">
        <div>
          <label htmlFor="customer-name-input" className="block text-sm font-medium text-neutral-900 mb-1.5">
            Full Name
          </label>
          <input
            id="customer-name-input"
            type="text"
            value={name}
            onChange={(e) => onChangeName(e.target.value)}
            placeholder="e.g. Budi Santoso"
            className={`w-full min-h-[44px] h-11 px-3.5 bg-white text-neutral-900 placeholder:text-neutral-400 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-1 ${
              errors.name
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                : 'border-neutral-200 focus:border-neutral-900 focus:ring-neutral-900'
            }`}
          />
          {errors.name ? (
            <p id="error-customer-name" className="text-xs text-red-600 mt-1.5">
              {errors.name}
            </p>
          ) : (
            <p className="text-xs text-neutral-500 mt-1.5">
              Minimum 2 characters required.
            </p>
          )}
        </div>

        <div>
          <label htmlFor="customer-phone-input" className="block text-sm font-medium text-neutral-900 mb-1.5">
            WhatsApp Phone Number
          </label>
          <input
            id="customer-phone-input"
            type="tel"
            value={phone}
            onChange={(e) => onChangePhone(e.target.value)}
            placeholder="e.g. 081234567890"
            className={`w-full min-h-[44px] h-11 px-3.5 bg-white text-neutral-900 placeholder:text-neutral-400 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-1 ${
              errors.phone
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                : 'border-neutral-200 focus:border-neutral-900 focus:ring-neutral-900'
            }`}
          />
          {errors.phone ? (
            <p id="error-customer-phone" className="text-xs text-red-600 mt-1.5">
              {errors.phone}
            </p>
          ) : (
            <p className="text-xs text-neutral-500 mt-1.5">
              Minimum 9 digits. Digits only will be used for WhatsApp communication.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
