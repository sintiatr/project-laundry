/**
 * Format a number to Indonesian Rupiah currency string.
 * Example: 50000 -> "Rp50.000"
 */
export function formatRupiah(amount: number): string {
  const formatted = new Intl.NumberFormat('id-ID', {
    style: 'decimal',
    maximumFractionDigits: 0,
  }).format(amount);
  return `Rp${formatted}`;
}

/**
 * Format raw number string for template string if needed.
 * Example: 50000 -> "50.000"
 */
export function formatNumberId(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Sanitize customer phone number: removes spaces, dashes, parentheses, non-digits.
 */
export function sanitizePhoneNumber(phone: string): string {
  return phone.replace(/\D/g, '');
}

/**
 * Normalize phone number for business WhatsApp target:
 * Ensures standard international format (e.g., 6281234567890, no leading zero, no +, no hyphens).
 */
export function normalizeTargetBusinessPhone(phone: string): string {
  let cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.slice(1);
  }
  return cleaned;
}

export interface WhatsAppMessageParams {
  businessName: string;
  businessPhone: string;
  orderId: string;
  customerName: string;
  customerPhone: string;
  selectedItems: string;
  totalPrice: number;
}

/**
 * Constructs the WhatsApp direct order URL according to Section 6.1 specifications.
 */
export function buildWhatsAppUrl(params: WhatsAppMessageParams): string {
  const shortUuid = params.orderId.slice(0, 8);
  const targetPhone = normalizeTargetBusinessPhone(params.businessPhone);
  const formattedPrice = formatNumberId(params.totalPrice);

  const message = [
    `Halo ${params.businessName}, saya ingin memesan layanan cleaning:`,
    '',
    'Detail Pesanan:',
    `- Ref ID: #${shortUuid}`,
    `- Nama: ${params.customerName}`,
    `- No. WhatsApp: ${params.customerPhone}`,
    `- Layanan: ${params.selectedItems}`,
    `- Total Estimasi: Rp${formattedPrice}`,
    '',
    'Mohon info ketersediaan jadwal pengerjaan. Terima kasih!',
  ].join('\n');

  return `https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`;
}
