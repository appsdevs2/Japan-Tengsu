import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  CheckCircle2,
  ShieldCheck,
  Truck,
  Lock,
  AlertCircle,
  Minus,
  Plus,
  Copy,
  Check,
  Banknote,
  CreditCard,
  Package,
  Loader2,
} from 'lucide-react';
import { OrderFormData, PaymentMethod, PricingPackage, SubmittedOrder } from '../types';
import { PACKAGES } from '../constants';

interface OrderModalProps {
  selectedPackage: PricingPackage | null;
  onClose: () => void;
  onSelectPackage: (pkg: PricingPackage) => void;
}

type FormErrors = Partial<Record<keyof OrderFormData, string>>;

const INITIAL_FORM_DATA: OrderFormData = {
  fullName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'United States',
  paymentMethod: 'cod',
  notes: '',
};

const COUNTRIES = [
  'United States',
  'Canada',
  'United Kingdom',
  'Australia',
  'Singapore',
  'Japan',
  'Malaysia',
  'Germany',
  'France',
  'Other',
];

const getShippingDetails = (count: number): { label: string; eta: string } => {
  if (count >= 10) {
    return { label: 'Free Priority Shipping', eta: '1–2 business days' };
  }
  if (count >= 3) {
    return { label: 'Free Express Shipping', eta: '2–3 business days' };
  }
  return { label: 'Free Standard Shipping', eta: '5–7 business days' };
};

const OrderModal: React.FC<OrderModalProps> = ({
  selectedPackage,
  onClose,
  onSelectPackage,
}) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [formData, setFormData] = useState<OrderFormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedOrder, setSubmittedOrder] = useState<SubmittedOrder | null>(null);
  const [copiedReceipt, setCopiedReceipt] = useState<boolean>(false);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const backdropMouseDownTarget = useRef<EventTarget | null>(null);
  const wasOpenRef = useRef<boolean>(false);

  const isOpen = Boolean(selectedPackage);

  // Reset modal transient state only when opening from a closed state
  useEffect(() => {
    if (isOpen && !wasOpenRef.current) {
      setQuantity(1);
      setErrors({});
      setSubmittedOrder(null);
      setCopiedReceipt(false);
      setIsSubmitting(false);

      // Focus the first field after mount for immediate keyboard accessibility
      const focusTimer = setTimeout(() => {
        nameInputRef.current?.focus();
      }, 50);

      wasOpenRef.current = true;
      return () => clearTimeout(focusTimer);
    }

    if (!isOpen) {
      wasOpenRef.current = false;
    }
  }, [isOpen]);

  // Lock background scroll & handle Escape key while modal is open
  useEffect(() => {
    if (!selectedPackage) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedPackage, onClose]);

  if (!selectedPackage) return null;

  const totalPrice = selectedPackage.price * quantity;
  const totalOriginalPrice = selectedPackage.originalPrice * quantity;
  const totalSavings = totalOriginalPrice - totalPrice;
  const totalBoxes = selectedPackage.count * quantity;
  const totalTablets = totalBoxes * 16;
  const shipping = getShippingDetails(selectedPackage.count);

  const updateField = <K extends keyof OrderFormData>(field: K, value: OrderFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Please enter your full name.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address for your receipt.';
    }

    const digitsOnly = formData.phone.replace(/\D/g, '');
    if (!formData.phone.trim() || digitsOnly.length < 7) {
      newErrors.phone = 'Please enter a valid phone number for delivery updates.';
    }

    if (!formData.address.trim() || formData.address.trim().length < 5) {
      newErrors.address = 'Please enter your full street address.';
    }

    if (!formData.city.trim() || formData.city.trim().length < 2) {
      newErrors.city = 'Please enter your city.';
    }

    if (!formData.state.trim() || formData.state.trim().length < 2) {
      newErrors.state = 'Please enter your state or province.';
    }

    if (!formData.postalCode.trim() || formData.postalCode.trim().length < 3) {
      newErrors.postalCode = 'Please enter your postal or ZIP code.';
    }

    if (!formData.country.trim()) {
      newErrors.country = 'Please select your country.';
    }

    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const firstErrorField = Object.keys(validationErrors)[0];
      const element = document.getElementById(`order-${firstErrorField}`);
      element?.focus();
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const orderNumber = `JT-${Math.floor(100000 + Math.random() * 900000)}`;
      const newOrder: SubmittedOrder = {
        orderNumber,
        createdAt: new Date().toISOString(),
        pkg: selectedPackage,
        quantity,
        totalPrice,
        totalSavings,
        shippingLabel: `${shipping.label} (${shipping.eta})`,
        customer: {
          ...formData,
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          address: formData.address.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          postalCode: formData.postalCode.trim(),
          notes: formData.notes.trim(),
        },
      };

      try {
        const existingRaw = localStorage.getItem('japan_tengsu_orders');
        const existing: SubmittedOrder[] = existingRaw ? JSON.parse(existingRaw) : [];
        localStorage.setItem(
          'japan_tengsu_orders',
          JSON.stringify([newOrder, ...existing].slice(0, 10))
        );
      } catch {
        // Ignore storage quota or private-browsing errors
      }

      setIsSubmitting(false);
      setSubmittedOrder(newOrder);
    }, 350);
  };

  const handleCopyReceipt = async () => {
    if (!submittedOrder) return;
    const { customer, pkg } = submittedOrder;
    const paymentLabel =
      customer.paymentMethod === 'cod'
        ? 'Cash on Delivery (Pay Upon Arrival)'
        : 'Secure Payment Link (Sent via Email)';

    const summaryText = [
      `Order Confirmation: #${submittedOrder.orderNumber}`,
      `Product: Japan Tengsu — ${pkg.title} (${pkg.count * submittedOrder.quantity} Boxes / ${
        pkg.count * submittedOrder.quantity * 16
      } Tablets)`,
      `Total: $${submittedOrder.totalPrice.toFixed(2)} (Saved $${submittedOrder.totalSavings.toFixed(2)})`,
      `Shipping: ${submittedOrder.shippingLabel} — Discreet Unmarked Box`,
      `Payment Method: ${paymentLabel}`,
      `Recipient: ${customer.fullName}`,
      `Phone: ${customer.phone}`,
      `Email: ${customer.email}`,
      `Delivery Address: ${customer.address}, ${customer.city}, ${customer.state} ${customer.postalCode}, ${customer.country}`,
      customer.notes ? `Notes: ${customer.notes}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    try {
      await navigator.clipboard.writeText(summaryText);
      setCopiedReceipt(true);
      setTimeout(() => setCopiedReceipt(false), 2500);
    } catch {
      // Clipboard API unavailable in restricted contexts
    }
  };

  const handlePlaceAnother = () => {
    setSubmittedOrder(null);
    setQuantity(1);
    setErrors({});
  };

  const inputBaseClass = (hasError: boolean) =>
    `w-full min-h-[44px] px-3.5 py-2.5 text-base sm:text-sm rounded-lg border bg-white text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none focus-visible:ring-2 ${
      hasError
        ? 'border-red-500 focus-visible:ring-red-200'
        : 'border-slate-300 hover:border-slate-400 focus:border-brand-600 focus-visible:ring-brand-200'
    }`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-0 sm:p-4 md:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-modal-title"
      onMouseDown={(e) => {
        backdropMouseDownTarget.current = e.target;
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && backdropMouseDownTarget.current === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="relative w-full max-w-4xl bg-white sm:rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-screen sm:max-h-[92vh] overflow-hidden">
        {/* Top Modal Header */}
        <div className="flex items-center justify-between gap-4 px-5 py-4 sm:px-8 sm:py-5 border-b border-slate-200 bg-white shrink-0">
          <div>
            <h2 id="order-modal-title" className="text-lg sm:text-xl font-bold text-slate-900">
              {submittedOrder ? 'Order Confirmation' : 'Complete Your Order'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {submittedOrder
                ? 'Your discreet shipment request has been recorded.'
                : 'Enter your delivery details below. All packages ship in plain, unmarked boxes.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close order form"
            className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto flex-1">
          {submittedOrder ? (
            /* Confirmation & Receipt View */
            <div className="p-5 sm:p-8 max-w-2xl mx-auto space-y-6">
              <div className="flex items-start gap-4 p-5 rounded-xl bg-emerald-50 border border-emerald-200">
                <CheckCircle2 className="w-7 h-7 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
                    Order Confirmed
                  </p>
                  <h3 className="text-xl font-bold text-slate-900 mt-1 tabular-nums">
                    Order #{submittedOrder.orderNumber} — Preparing Shipment
                  </h3>
                  <p className="text-sm text-slate-700 mt-1.5 leading-relaxed">
                    Thank you, <span className="font-semibold">{submittedOrder.customer.fullName}</span>. A confirmation receipt has been prepared for{' '}
                    <span className="font-medium">{submittedOrder.customer.email}</span>.
                  </p>
                </div>
              </div>

              {/* Order Summary Receipt Card */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 divide-y divide-slate-200">
                <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                      Selected Package
                    </p>
                    <p className="text-base font-bold text-slate-900 mt-0.5">
                      Japan Tengsu — {submittedOrder.pkg.title}
                      {submittedOrder.quantity > 1 ? ` × ${submittedOrder.quantity}` : ''}
                    </p>
                    <p className="text-sm text-slate-600 tabular-nums">
                      {submittedOrder.pkg.count * submittedOrder.quantity} Boxes (
                      {submittedOrder.pkg.count * submittedOrder.quantity * 16} Tablets)
                    </p>
                  </div>
                  <div className="sm:text-right">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                      {submittedOrder.customer.paymentMethod === 'cod'
                        ? 'Due on Delivery'
                        : 'Order Total'}
                    </p>
                    <p className="text-2xl font-extrabold text-slate-900 tabular-nums">
                      ${submittedOrder.totalPrice.toFixed(2)}
                    </p>
                    <p className="text-xs font-semibold text-emerald-700 tabular-nums">
                      Saved ${submittedOrder.totalSavings.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">
                      Shipping To
                    </p>
                    <p className="font-semibold text-slate-900">{submittedOrder.customer.fullName}</p>
                    <p className="text-slate-600 mt-0.5">{submittedOrder.customer.address}</p>
                    <p className="text-slate-600">
                      {submittedOrder.customer.city}, {submittedOrder.customer.state}{' '}
                      {submittedOrder.customer.postalCode}
                    </p>
                    <p className="text-slate-600">{submittedOrder.customer.country}</p>
                    <p className="text-slate-600 mt-1 tabular-nums">{submittedOrder.customer.phone}</p>
                    {submittedOrder.customer.notes && (
                      <p className="text-xs text-slate-500 mt-2">
                        Note: {submittedOrder.customer.notes}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                        Shipping Method
                      </p>
                      <p className="font-medium text-slate-900">{submittedOrder.shippingLabel}</p>
                      <p className="text-xs text-slate-500">Plain, unmarked discreet packaging</p>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                        Payment Method
                      </p>
                      <p className="font-medium text-slate-900">
                        {submittedOrder.customer.paymentMethod === 'cod'
                          ? 'Cash on Delivery (COD)'
                          : 'Secure Payment Invoice (Email Link)'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={handleCopyReceipt}
                    className="min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 font-medium text-sm transition-colors whitespace-nowrap"
                  >
                    {copiedReceipt ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Receipt Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy Order Details</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handlePlaceAnother}
                    className="min-h-[44px] inline-flex items-center justify-center px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 font-medium text-sm transition-colors whitespace-nowrap"
                  >
                    Place Another Order
                  </button>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="min-h-[44px] inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-sm transition-colors whitespace-nowrap"
                >
                  Done & Return to Store
                </button>
              </div>
            </div>
          ) : (
            /* Order Form View (2-Column Desktop Layout) */
            <form onSubmit={handleSubmit} noValidate className="grid grid-cols-1 lg:grid-cols-12">
              {/* Left Column: Customer Details Form */}
              <div className="lg:col-span-7 p-5 sm:p-8 space-y-7">
                {/* 1. Contact Information */}
                <section aria-labelledby="section-contact">
                  <h3 id="section-contact" className="text-base font-bold text-slate-900 mb-4">
                    1. Contact Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="order-fullName"
                        className="block text-sm font-medium text-slate-700 mb-1.5"
                      >
                        Full Name <span className="text-red-600">*</span>
                      </label>
                      <input
                        ref={nameInputRef}
                        id="order-fullName"
                        name="fullName"
                        type="text"
                        autoComplete="name"
                        placeholder="e.g. Michael Roberts"
                        value={formData.fullName}
                        onChange={(e) => updateField('fullName', e.target.value)}
                        aria-invalid={Boolean(errors.fullName)}
                        aria-describedby={errors.fullName ? 'error-fullName' : undefined}
                        className={inputBaseClass(Boolean(errors.fullName))}
                      />
                      {errors.fullName && (
                        <p
                          id="error-fullName"
                          className="mt-1.5 flex items-center gap-1.5 text-xs text-red-600 font-medium"
                        >
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{errors.fullName}</span>
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="order-email"
                          className="block text-sm font-medium text-slate-700 mb-1.5"
                        >
                          Email Address <span className="text-red-600">*</span>
                        </label>
                        <input
                          id="order-email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          placeholder="you@example.com"
                          value={formData.email}
                          onChange={(e) => updateField('email', e.target.value)}
                          aria-invalid={Boolean(errors.email)}
                          aria-describedby={errors.email ? 'error-email' : undefined}
                          className={inputBaseClass(Boolean(errors.email))}
                        />
                        {errors.email && (
                          <p
                            id="error-email"
                            className="mt-1.5 flex items-center gap-1.5 text-xs text-red-600 font-medium"
                          >
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{errors.email}</span>
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="order-phone"
                          className="block text-sm font-medium text-slate-700 mb-1.5"
                        >
                          Phone Number <span className="text-red-600">*</span>
                        </label>
                        <input
                          id="order-phone"
                          name="phone"
                          type="tel"
                          autoComplete="tel"
                          placeholder="+1 (555) 234-5678"
                          value={formData.phone}
                          onChange={(e) => updateField('phone', e.target.value)}
                          aria-invalid={Boolean(errors.phone)}
                          aria-describedby={errors.phone ? 'error-phone' : undefined}
                          className={inputBaseClass(Boolean(errors.phone))}
                        />
                        {errors.phone && (
                          <p
                            id="error-phone"
                            className="mt-1.5 flex items-center gap-1.5 text-xs text-red-600 font-medium"
                          >
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{errors.phone}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </section>

                {/* 2. Delivery Address */}
                <section
                  aria-labelledby="section-shipping"
                  className="pt-6 border-t border-slate-200"
                >
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <h3 id="section-shipping" className="text-base font-bold text-slate-900">
                      2. Shipping Address
                    </h3>
                    <span className="text-xs text-slate-500">Discreet unmarked box</span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="order-address"
                        className="block text-sm font-medium text-slate-700 mb-1.5"
                      >
                        Street Address & Apt / Suite <span className="text-red-600">*</span>
                      </label>
                      <input
                        id="order-address"
                        name="address"
                        type="text"
                        autoComplete="street-address"
                        placeholder="1234 Maple Avenue, Apt 5B"
                        value={formData.address}
                        onChange={(e) => updateField('address', e.target.value)}
                        aria-invalid={Boolean(errors.address)}
                        aria-describedby={errors.address ? 'error-address' : undefined}
                        className={inputBaseClass(Boolean(errors.address))}
                      />
                      {errors.address && (
                        <p
                          id="error-address"
                          className="mt-1.5 flex items-center gap-1.5 text-xs text-red-600 font-medium"
                        >
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{errors.address}</span>
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="order-city"
                          className="block text-sm font-medium text-slate-700 mb-1.5"
                        >
                          City <span className="text-red-600">*</span>
                        </label>
                        <input
                          id="order-city"
                          name="city"
                          type="text"
                          autoComplete="address-level2"
                          placeholder="Austin"
                          value={formData.city}
                          onChange={(e) => updateField('city', e.target.value)}
                          aria-invalid={Boolean(errors.city)}
                          aria-describedby={errors.city ? 'error-city' : undefined}
                          className={inputBaseClass(Boolean(errors.city))}
                        />
                        {errors.city && (
                          <p
                            id="error-city"
                            className="mt-1.5 flex items-center gap-1.5 text-xs text-red-600 font-medium"
                          >
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{errors.city}</span>
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="order-state"
                          className="block text-sm font-medium text-slate-700 mb-1.5"
                        >
                          State / Province <span className="text-red-600">*</span>
                        </label>
                        <input
                          id="order-state"
                          name="state"
                          type="text"
                          autoComplete="address-level1"
                          placeholder="TX"
                          value={formData.state}
                          onChange={(e) => updateField('state', e.target.value)}
                          aria-invalid={Boolean(errors.state)}
                          aria-describedby={errors.state ? 'error-state' : undefined}
                          className={inputBaseClass(Boolean(errors.state))}
                        />
                        {errors.state && (
                          <p
                            id="error-state"
                            className="mt-1.5 flex items-center gap-1.5 text-xs text-red-600 font-medium"
                          >
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{errors.state}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="order-postalCode"
                          className="block text-sm font-medium text-slate-700 mb-1.5"
                        >
                          Postal / ZIP Code <span className="text-red-600">*</span>
                        </label>
                        <input
                          id="order-postalCode"
                          name="postalCode"
                          type="text"
                          autoComplete="postal-code"
                          placeholder="78701"
                          value={formData.postalCode}
                          onChange={(e) => updateField('postalCode', e.target.value)}
                          aria-invalid={Boolean(errors.postalCode)}
                          aria-describedby={errors.postalCode ? 'error-postalCode' : undefined}
                          className={inputBaseClass(Boolean(errors.postalCode))}
                        />
                        {errors.postalCode && (
                          <p
                            id="error-postalCode"
                            className="mt-1.5 flex items-center gap-1.5 text-xs text-red-600 font-medium"
                          >
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{errors.postalCode}</span>
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="order-country"
                          className="block text-sm font-medium text-slate-700 mb-1.5"
                        >
                          Country <span className="text-red-600">*</span>
                        </label>
                        <select
                          id="order-country"
                          name="country"
                          autoComplete="country-name"
                          value={formData.country}
                          onChange={(e) => updateField('country', e.target.value)}
                          aria-invalid={Boolean(errors.country)}
                          className={inputBaseClass(Boolean(errors.country))}
                        >
                          {COUNTRIES.map((country) => (
                            <option key={country} value={country}>
                              {country}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="order-notes"
                        className="block text-sm font-medium text-slate-700 mb-1.5"
                      >
                        Delivery Instructions <span className="text-slate-400 font-normal">(Optional)</span>
                      </label>
                      <textarea
                        id="order-notes"
                        name="notes"
                        rows={2}
                        placeholder="Gate code, drop-off location, or preferred delivery time..."
                        value={formData.notes}
                        onChange={(e) => updateField('notes', e.target.value)}
                        className="w-full px-3.5 py-2.5 text-base sm:text-sm rounded-lg border border-slate-300 hover:border-slate-400 bg-white text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none focus:border-brand-600 focus-visible:ring-2 focus-visible:ring-brand-200"
                      />
                    </div>
                  </div>
                </section>

                {/* 3. Payment Method */}
                <section
                  aria-labelledby="section-payment"
                  className="pt-6 border-t border-slate-200"
                >
                  <h3 id="section-payment" className="text-base font-bold text-slate-900 mb-4">
                    3. Payment Preference
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(
                      [
                        {
                          id: 'cod' as PaymentMethod,
                          title: 'Cash on Delivery',
                          description: 'Pay courier when your discreet box arrives.',
                          icon: Banknote,
                        },
                        {
                          id: 'invoice' as PaymentMethod,
                          title: 'Secure Payment Link',
                          description: 'Receive a Card or PayPal link via email.',
                          icon: CreditCard,
                        },
                      ] as const
                    ).map((option) => {
                      const Icon = option.icon;
                      const isSelected = formData.paymentMethod === option.id;
                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => updateField('paymentMethod', option.id)}
                          aria-pressed={isSelected}
                          className={`text-left p-4 rounded-xl border transition-all flex items-start gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                            isSelected
                              ? 'border-brand-600 bg-brand-50/70 ring-1 ring-brand-600'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <Icon
                            className={`w-5 h-5 shrink-0 mt-0.5 ${
                              isSelected ? 'text-brand-700' : 'text-slate-400'
                            }`}
                          />
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{option.title}</p>
                            <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                              {option.description}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </section>
              </div>

              {/* Right Column: Order Summary & Submit */}
              <div className="lg:col-span-5 bg-slate-50 border-t lg:border-t-0 lg:border-l border-slate-200 p-5 sm:p-8 flex flex-col justify-between">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Order Summary</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Review or adjust your package before confirming.
                    </p>
                  </div>

                  {/* Package Switcher */}
                  <div>
                    <label
                      htmlFor="order-package-select"
                      className="block text-xs font-semibold uppercase tracking-wide text-slate-600 mb-1.5"
                    >
                      Selected Package
                    </label>
                    <select
                      id="order-package-select"
                      value={selectedPackage.id}
                      onChange={(e) => {
                        const found = PACKAGES.find((p) => p.id === e.target.value);
                        if (found) onSelectPackage(found);
                      }}
                      className="w-full min-h-[44px] px-3 py-2 text-sm font-medium rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:border-brand-600 focus-visible:ring-2 focus-visible:ring-brand-200"
                    >
                      {PACKAGES.map((pkg) => (
                        <option key={pkg.id} value={pkg.id}>
                          {pkg.title} — {pkg.count} {pkg.count === 1 ? 'Box' : 'Boxes'} (${pkg.price})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Item Details & Quantity Stepper */}
                  <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-brand-50 border border-brand-100 flex items-center justify-center shrink-0">
                          <Package className="w-5 h-5 text-brand-700" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">
                            Japan Tengsu ({selectedPackage.title})
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5 tabular-nums">
                            {totalBoxes} {totalBoxes === 1 ? 'Box' : 'Boxes'} · {totalTablets} Tablets
                          </p>
                        </div>
                      </div>
                      <p className="text-sm font-bold text-slate-900 tabular-nums shrink-0">
                        ${selectedPackage.price}/pack
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <span className="text-xs font-medium text-slate-600">Quantity</span>
                      <div className="inline-flex items-center rounded-lg border border-slate-300 bg-white">
                        <button
                          type="button"
                          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                          disabled={quantity <= 1}
                          aria-label="Decrease quantity"
                          className="min-h-[40px] min-w-[40px] inline-flex items-center justify-center text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed rounded-l-lg transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 text-sm font-bold text-slate-900 tabular-nums">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                          disabled={quantity >= 10}
                          aria-label="Increase quantity"
                          className="min-h-[40px] min-w-[40px] inline-flex items-center justify-center text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed rounded-r-lg transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  <dl className="space-y-2.5 text-sm border-t border-slate-200 pt-4">
                    <div className="flex justify-between text-slate-600">
                      <dt>Retail Value</dt>
                      <dd className="line-through text-slate-400 tabular-nums">
                        ${totalOriginalPrice.toFixed(2)}
                      </dd>
                    </div>
                    <div className="flex justify-between text-emerald-700 font-medium">
                      <dt>Bundle Savings ({selectedPackage.savings}% off)</dt>
                      <dd className="tabular-nums">-${totalSavings.toFixed(2)}</dd>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <dt>{shipping.label}</dt>
                      <dd className="font-semibold text-emerald-700 tabular-nums">$0.00</dd>
                    </div>
                    <div className="flex justify-between items-baseline pt-3 border-t border-slate-200 text-slate-900">
                      <dt className="text-base font-bold">Total</dt>
                      <dd className="text-2xl font-extrabold tabular-nums">
                        ${totalPrice.toFixed(2)}
                      </dd>
                    </div>
                  </dl>

                  {/* Discreet Shipping & Guarantee Notes */}
                  <ul className="space-y-2 text-xs text-slate-600 pt-2">
                    <li className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-brand-600 shrink-0" />
                      <span>
                        Estimated arrival: <strong className="text-slate-800">{shipping.eta}</strong> in plain unmarked packaging
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-brand-600 shrink-0" />
                      <span>Backed by our full Money-Back Guarantee</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-brand-600 shrink-0" />
                      <span>Private, encrypted order handling</span>
                    </li>
                  </ul>
                </div>

                {/* Submit Action */}
                <div className="pt-6 mt-6 border-t border-slate-200 space-y-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full min-h-[48px] py-3.5 px-6 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:bg-brand-400 text-white font-bold text-base shadow-lg shadow-brand-600/20 transition-all flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Confirming Order...</span>
                      </>
                    ) : (
                      <span>
                        Place Order · ${totalPrice.toFixed(2)}
                      </span>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full min-h-[40px] py-2 px-4 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-colors"
                  >
                    Cancel & Keep Browsing
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderModal;
