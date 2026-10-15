import countries from 'i18n-iso-countries';
import frenchLocale from 'i18n-iso-countries/langs/fr.json';

countries.registerLocale(frenchLocale);

export const COUNTRY_OPTIONS = Object.entries(countries.getNames('fr'))
  .map(([code, name]) => ({ code, name }))
  .sort((a, b) => a.name.localeCompare(b.name, 'fr'));

export const getCountryName = (code) =>
  COUNTRY_OPTIONS.find((country) => country.code === code)?.name || code || '';
