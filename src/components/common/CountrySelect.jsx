import { useState } from 'react';
import { COUNTRY_OPTIONS } from '../../data/countries';

export function CountrySelect({ value, onChange, className = 'input-field', required = false }) {
  return (
    <select
      value={value || ''}
      onChange={(event) => onChange(event.target.value)}
      className={className}
      required={required}
    >
      <option value="">Choisissez un pays</option>
      {COUNTRY_OPTIONS.map((country) => (
        <option key={country.code} value={country.code}>{country.name}</option>
      ))}
    </select>
  );
}

export function CountryMultiSelect({ value = [], onChange }) {
  const [search, setSearch] = useState('');
  const selected = Array.isArray(value) ? value : [];
  const searchTerm = search.trim().toLocaleLowerCase('fr');
  const filteredCountries = COUNTRY_OPTIONS.filter((country) =>
    country.name.toLocaleLowerCase('fr').includes(searchTerm)
  );

  const toggleCountry = (code) => {
    onChange(
      selected.includes(code)
        ? selected.filter((selectedCode) => selectedCode !== code)
        : [...selected, code]
    );
  };

  return (
    <div>
      <input
        type="search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        className="input-field mb-3"
        placeholder="Rechercher un pays..."
        aria-label="Rechercher un pays"
      />
      <div className="grid max-h-56 grid-cols-1 gap-2 overflow-y-auto rounded-xl border border-[#E2E8F0] p-3 sm:grid-cols-2">
        {filteredCountries.map((country) => (
          <label key={country.code} className="flex cursor-pointer items-center gap-2 text-sm text-[#334155]">
            <input
              type="checkbox"
              checked={selected.includes(country.code)}
              onChange={() => toggleCountry(country.code)}
              className="accent-[#3A7D44]"
            />
            {country.name}
          </label>
        ))}
        {filteredCountries.length === 0 && (
          <p className="col-span-full text-sm text-[#64748B]">Aucun pays trouvé.</p>
        )}
      </div>
    </div>
  );
}
