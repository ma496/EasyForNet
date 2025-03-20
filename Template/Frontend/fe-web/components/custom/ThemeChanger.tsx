import { useDispatch } from 'react-redux';
import { toggleTheme } from '@/store/slices/themeConfigSlice';
import IconSun from '@/components/icon/icon-sun';
import IconMoon from '@/components/icon/icon-moon';
import IconLaptop from '@/components/icon/icon-laptop';

interface ThemeChangerProps {
  theme: string;
}

const ThemeChanger = ({ theme }: ThemeChangerProps) => {
  const dispatch = useDispatch();

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <IconSun />;
      case 'dark':
        return <IconMoon />;
      case 'system':
        return <IconLaptop />;
      default:
        return <IconSun />;
    }
  };

  const getNextTheme = () => {
    switch (theme) {
      case 'light':
        return 'dark';
      case 'dark':
        return 'system';
      case 'system':
        return 'light';
      default:
        return 'light';
    }
  };

  return (
    <button
      className="flex items-center rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:hover:bg-dark/60"
      onClick={() => dispatch(toggleTheme(getNextTheme()))}
    >
      {getThemeIcon()}
    </button>
  );
};

export default ThemeChanger;
