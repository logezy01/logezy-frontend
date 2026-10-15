import countries from 'world-countries';

const currencyNames = new Intl.DisplayNames(['fr'], { type: 'currency' });

const CURRENCIES = [...new Set(
  countries.flatMap((country) => Object.keys(country.currencies || {}))
)]
  .map((code) => ({
    code,
    name: currencyNames.of(code) || code,
  }))
  .sort((a, b) => a.name.localeCompare(b.name, 'fr'));

const COUNTRY_CURRENCIES = new Map(
  countries.map((country) => [
    country.cca2,
    Object.keys(country.currencies || {})[0] || 'XOF',
  ])
);

export const getCurrencyForCountry = (countryCode) =>
  COUNTRY_CURRENCIES.get(countryCode) || 'XOF';

export const getCurrencyName = (currencyCode) =>
  CURRENCIES.find((currency) => currency.code === currencyCode)?.name || currencyCode || '';

export const formatCurrency = (amount, currencyCode = 'XOF') => {
  const value = Number(amount);
  if (!Number.isFinite(value)) return '';

  try {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currencyCode || 'XOF',
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${new Intl.NumberFormat('fr-FR').format(value)} ${currencyCode || 'XOF'}`;
  }
};

export const formatListingPrice = (amount, currencyCode, period) =>
  `${formatCurrency(amount, currencyCode)}${period ? `/${period}` : ''}`;

export { CURRENCIES };
