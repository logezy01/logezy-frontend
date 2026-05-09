import { Link } from 'react-router-dom';

export default function Logo({ size = 'md', showText = true, white = false }) {
  const sizes = {
    sm: { img: 28, text: 'text-lg' },
    md: { img: 36, text: 'text-xl' },
    lg: { img: 48, text: 'text-3xl' },
    xl: { img: 64, text: 'text-4xl' },
  };

  const s = sizes[size] || sizes.md;

  return (
    <Link to="/" className="flex items-center gap-2 shrink-0">
      <img
        src="/logo.png"
        alt="Logezy"
        width={s.img}
        height={s.img}
        className="object-contain"
      />
      {showText && (
        <span className={`font-display font-black ${s.text} ${
          white ? 'text-white' : 'text-[#2D3A8C]'
        }`}>
          Logezy
        </span>
      )}
    </Link>
  );
}