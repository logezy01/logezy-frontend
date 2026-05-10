import { Link } from 'react-router-dom';
import useThemeStore from '../../store/themeStore';

export default function Logo({ size = 'md', white = false }) {
  const { theme } = useThemeStore();

  const sizes = {
    sm: 32,
    md: 40,
    lg: 56,
    xl: 72,
  };

  const imgSize = sizes[size] || sizes.md;

  // Choisir le bon logo selon le thème
  const logoSrc = white || theme === 'dark' ? '/logo-dark.png' : '/logo-light.png';

  return (
    <Link to="/" className="flex items-center shrink-0">
      <img
        src={logoSrc}
        alt="Logezy"
        height={imgSize}
        style={{ height: imgSize, width: 'auto', maxWidth: imgSize * 4 }}
        className="object-contain"
      />
    </Link>
  );
}