
const CURRENCY_MAP: { [country: string]: { currency: string; locale: string } } = {
  "اليمن": { currency: 'YER', locale: 'ar-YE' },
  "السعودية": { currency: 'SAR', locale: 'ar-SA' },
  "مصر": { currency: 'EGP', locale: 'ar-EG' },
  "الإمارات": { currency: 'AED', locale: 'ar-AE' },
  "قطر": { currency: 'QAR', locale: 'ar-QA' },
  "الكويت": { currency: 'KWD', locale: 'ar-KW' },
  "البحرين": { currency: 'BHD', locale: 'ar-BH' },
  "عمان": { currency: 'OMR', locale: 'ar-OM' },
};

export function formatPrice(price: number, country: string): string {
  if (price <= 0 || !price) {
      return 'السعر عند الطلب';
  }
  
  const countryConfig = CURRENCY_MAP[country];
  
  if (!countryConfig) {
      // Fallback for unlisted countries
      return `${price.toLocaleString()} (عملة محلية)`;
  }

  try {
    return new Intl.NumberFormat(countryConfig.locale, {
      style: 'currency',
      currency: countryConfig.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price);
  } catch (error) {
    console.error(`Could not format currency for ${country}:`, error);
    // Fallback for unsupported locales/currencies
    return `${price.toLocaleString()} ${countryConfig.currency}`;
  }
}
