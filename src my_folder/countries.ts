export interface Country {
  code: string;
  name: string;
  currency: string;
  currencySymbol: string;
}

export const COUNTRIES: Country[] = [
  { code: 'IN', name: 'India', currency: 'INR', currencySymbol: '₹' },
  { code: 'US', name: 'United States', currency: 'USD', currencySymbol: '$' },
  { code: 'GB', name: 'United Kingdom', currency: 'GBP', currencySymbol: '£' },
  { code: 'DE', name: 'Germany', currency: 'EUR', currencySymbol: '€' },
  { code: 'FR', name: 'France', currency: 'EUR', currencySymbol: '€' },
  { code: 'IT', name: 'Italy', currency: 'EUR', currencySymbol: '€' },
  { code: 'ES', name: 'Spain', currency: 'EUR', currencySymbol: '€' },
  { code: 'NL', name: 'Netherlands', currency: 'EUR', currencySymbol: '€' },
  { code: 'CA', name: 'Canada', currency: 'CAD', currencySymbol: 'C$' },
  { code: 'AU', name: 'Australia', currency: 'AUD', currencySymbol: 'A$' },
  { code: 'JP', name: 'Japan', currency: 'JPY', currencySymbol: '¥' },
  { code: 'CN', name: 'China', currency: 'CNY', currencySymbol: '¥' },
  { code: 'KR', name: 'South Korea', currency: 'KRW', currencySymbol: '₩' },
  { code: 'SG', name: 'Singapore', currency: 'SGD', currencySymbol: 'S$' },
  { code: 'HK', name: 'Hong Kong', currency: 'HKD', currencySymbol: 'HK$' },
  { code: 'CH', name: 'Switzerland', currency: 'CHF', currencySymbol: 'CHF' },
  { code: 'SE', name: 'Sweden', currency: 'SEK', currencySymbol: 'kr' },
  { code: 'NO', name: 'Norway', currency: 'NOK', currencySymbol: 'kr' },
  { code: 'DK', name: 'Denmark', currency: 'DKK', currencySymbol: 'kr' },
  { code: 'FI', name: 'Finland', currency: 'EUR', currencySymbol: '€' },
  { code: 'AT', name: 'Austria', currency: 'EUR', currencySymbol: '€' },
  { code: 'BE', name: 'Belgium', currency: 'EUR', currencySymbol: '€' },
  { code: 'IE', name: 'Ireland', currency: 'EUR', currencySymbol: '€' },
  { code: 'PT', name: 'Portugal', currency: 'EUR', currencySymbol: '€' },
  { code: 'GR', name: 'Greece', currency: 'EUR', currencySymbol: '€' },
  { code: 'BR', name: 'Brazil', currency: 'BRL', currencySymbol: 'R$' },
  { code: 'MX', name: 'Mexico', currency: 'MXN', currencySymbol: '$' },
  { code: 'AR', name: 'Argentina', currency: 'ARS', currencySymbol: '$' },
  { code: 'ZA', name: 'South Africa', currency: 'ZAR', currencySymbol: 'R' },
  { code: 'RU', name: 'Russia', currency: 'RUB', currencySymbol: '₽' },
  { code: 'TR', name: 'Turkey', currency: 'TRY', currencySymbol: '₺' },
  { code: 'SA', name: 'Saudi Arabia', currency: 'SAR', currencySymbol: '﷼' },
  { code: 'AE', name: 'United Arab Emirates', currency: 'AED', currencySymbol: 'د.إ' },
  { code: 'IL', name: 'Israel', currency: 'ILS', currencySymbol: '₪' },
  { code: 'TH', name: 'Thailand', currency: 'THB', currencySymbol: '฿' },
  { code: 'MY', name: 'Malaysia', currency: 'MYR', currencySymbol: 'RM' },
  { code: 'ID', name: 'Indonesia', currency: 'IDR', currencySymbol: 'Rp' },
  { code: 'PH', name: 'Philippines', currency: 'PHP', currencySymbol: '₱' },
  { code: 'VN', name: 'Vietnam', currency: 'VND', currencySymbol: '₫' },
  { code: 'NZ', name: 'New Zealand', currency: 'NZD', currencySymbol: 'NZ$' },
];

export const getCountryByCode = (code: string): Country | undefined => {
  return COUNTRIES.find(country => country.code === code);
};

export const getCurrencyByCountry = (countryCode: string): string => {
  const country = getCountryByCode(countryCode);
  return country ? country.currency : 'USD';
};

export const getCurrencySymbolByCountry = (countryCode: string): string => {
  const country = getCountryByCode(countryCode);
  return country ? country.currencySymbol : '$';
};
