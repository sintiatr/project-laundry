import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { PackageId, OrderRecord, FormValidationErrors } from './types';
import { SERVICE_PACKAGES, EXPRESS_ADDON } from './data/services';
import { sanitizePhoneNumber, buildWhatsAppUrl } from './lib/formatters';
import { fetchOrders, insertOrder, updateOrderStatus } from './lib/supabase';
import { Header } from './components/Header';
import { ServiceSelector } from './components/ServiceSelector';
import { CustomerForm } from './components/CustomerForm';
import { OrderSummary } from './components/OrderSummary';
import { OrderHistory } from './components/OrderHistory';

export default function App() {
  // 1. Service Selection State
  const [selectedPackageId, setSelectedPackageId] = useState<PackageId>('basic');
  const [isExpressSelected, setIsExpressSelected] = useState<boolean>(false);

  // 2. Customer Form State
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [errors, setErrors] = useState<FormValidationErrors>({});

  // 3. Order History State
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState<boolean>(true);
  const [hasOrderHistoryError, setHasOrderHistoryError] = useState<boolean>(false);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  // 4. Submission State
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccessUrl, setSubmitSuccessUrl] = useState<string | null>(null);

  // Business info from env or defaults
  const businessPhone = import.meta.env.VITE_BUSINESS_PHONE || '6281234567890';
  const businessName = import.meta.env.VITE_BUSINESS_NAME || 'SneakerCare Studio';

  // Math Calculation: Total Price = P_base + (A_express * P_addon)
  const selectedPackage = useMemo(() => {
    return SERVICE_PACKAGES.find((pkg) => pkg.id === selectedPackageId) || SERVICE_PACKAGES[0];
  }, [selectedPackageId]);

  const totalPrice = useMemo(() => {
    const basePrice = selectedPackage.price;
    const addonPrice = isExpressSelected ? EXPRESS_ADDON.price : 0;
    return basePrice + addonPrice;
  }, [selectedPackage, isExpressSelected]);

  // Load orders on initial mount
  const loadOrderHistory = useCallback(async () => {
    setIsLoadingOrders(true);
    setHasOrderHistoryError(false);
    try {
      const records = await fetchOrders();
      setOrders(records);
    } catch {
      setHasOrderHistoryError(true);
    } finally {
      setIsLoadingOrders(false);
    }
  }, []);

  useEffect(() => {
    loadOrderHistory();
  }, [loadOrderHistory]);

  // Validation Rules
  const validateForm = (): boolean => {
    const newErrors: FormValidationErrors = {};
    const trimmedName = customerName.trim();
    const sanitizedPhone = sanitizePhoneNumber(customerPhone);

    if (trimmedName.length < 2) {
      newErrors.name = 'Please enter a valid customer name (minimum 2 characters).';
    }

    if (sanitizedPhone.length < 9) {
      newErrors.phone = 'Please enter a valid WhatsApp phone number (minimum 9 digits).';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form input change handlers
  const handleNameChange = (val: string) => {
    setCustomerName(val);
    if (errors.name && val.trim().length >= 2) {
      setErrors((prev) => ({ ...prev, name: undefined }));
    }
  };

  const handlePhoneChange = (val: string) => {
    setCustomerPhone(val);
    if (errors.phone && sanitizePhoneNumber(val).length >= 9) {
      setErrors((prev) => ({ ...prev, phone: undefined }));
    }
  };

  // WhatsApp Order Submission Handler
  const handleSendOrderToWhatsApp = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitSuccessUrl(null);

    const sanitizedPhone = sanitizePhoneNumber(customerPhone);
    const trimmedName = customerName.trim();

    // Prepare human-readable summary of selected items
    const selectedItemsSummary = isExpressSelected
      ? `${selectedPackage.name} + Express Delivery`
      : selectedPackage.name;

    try {
      // Step A: Insert record into orders table in database
      const savedOrder = await insertOrder({
        customer_name: trimmedName,
        customer_phone: sanitizedPhone,
        selected_items: selectedItemsSummary,
        total_price: totalPrice,
      });

      // Update local state table immediately
      setOrders((prev) => [savedOrder, ...prev.filter((o) => o.id !== savedOrder.id)]);

      // Step B: Construct WhatsApp URL
      const waUrl = buildWhatsAppUrl({
        businessName,
        businessPhone,
        orderId: savedOrder.id,
        customerName: trimmedName,
        customerPhone: sanitizedPhone,
        selectedItems: selectedItemsSummary,
        totalPrice,
      });

      setSubmitSuccessUrl(waUrl);

      // Step C: Redirect to WhatsApp
      // Handle iframe environment safely: try window.open, fallback to window.location.href
      try {
        const opened = window.open(waUrl, '_blank', 'noopener,noreferrer');
        if (!opened || opened.closed || typeof opened.closed === 'undefined') {
          window.location.href = waUrl;
        }
      } catch {
        window.location.href = waUrl;
      }
    } catch (err) {
      console.error('Failed to submit order:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Status update handler: updates status from 'pending' to 'processed'
  const handleUpdateStatus = async (orderId: string) => {
    setUpdatingOrderId(orderId);
    try {
      await updateOrderStatus(orderId, 'processed');
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: 'processed' } : o))
      );
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  return (
    <div id="app-root" className="min-h-screen bg-neutral-50 text-neutral-900 flex flex-col font-sans antialiased">
      <Header />

      <main id="main-content" className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
        {/* Two-Column Estimator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (Configuration): 7 columns on desktop */}
          <div className="lg:col-span-7 space-y-6">
            <ServiceSelector
              packages={SERVICE_PACKAGES}
              selectedPackageId={selectedPackageId}
              onSelectPackage={(id) => setSelectedPackageId(id)}
              expressAddon={EXPRESS_ADDON}
              isExpressSelected={isExpressSelected}
              onToggleExpress={() => setIsExpressSelected((prev) => !prev)}
            />

            <CustomerForm
              name={customerName}
              phone={customerPhone}
              onChangeName={handleNameChange}
              onChangePhone={handlePhoneChange}
              errors={errors}
            />
          </div>

          {/* Right Column (Sticky Summary): 5 columns on desktop */}
          <div className="lg:col-span-5">
            <OrderSummary
              selectedPackage={selectedPackage}
              isExpressSelected={isExpressSelected}
              expressAddon={EXPRESS_ADDON}
              totalPrice={totalPrice}
              onSendToWhatsApp={handleSendOrderToWhatsApp}
              isSubmitting={isSubmitting}
              submitSuccessUrl={submitSuccessUrl}
            />
          </div>
        </div>

        {/* Bottom Section (Order History) */}
        <OrderHistory
          orders={orders}
          isLoading={isLoadingOrders}
          hasError={hasOrderHistoryError}
          onRefresh={loadOrderHistory}
          onUpdateStatus={handleUpdateStatus}
          updatingOrderId={updatingOrderId}
        />
      </main>

      <footer id="footer-section" className="border-t border-neutral-200 bg-white py-6 mt-12 text-center text-xs text-neutral-500">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <p>
            Sneaker Clean & Restoration Estimator &bull; Standardized pricing model for sneaker care services.
          </p>
        </div>
      </footer>
    </div>
  );
}
