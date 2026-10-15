import { CURRENCIES } from '../../data/currencies';

export default function CurrencySelect({
  value,
  onChange,
  className = 'input-field',
  allowAll = false,
  required = false,
}) {
  return (
    <select
      value={value || ''}
      onChange={(event) => onChange(event.target.value)}
      className={className}
      required={required}
    >
      <option value="">
        {allowAll ? 'Toutes les devises' : 'Choisissez une devise'}
      </option>
      {CURRENCIES.map((currency) => (
        <option key={currency.code} value={currency.code}>
          {currency.name} ({currency.code})
        </option>
      ))}
    </select>
  );
}
