import { useDispatch } from 'react-redux'
import { toggleTheme } from '@/store/slices/themeConfigSlice'
import { Sun, Moon, Laptop } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ThemeChangerProps {
  theme: string
  size?: number
  className?: string
}

const ThemeChanger = ({ theme, size = 18, className }: ThemeChangerProps) => {
  const dispatch = useDispatch()

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun size={size} />
      case 'dark':
        return <Moon size={size} />
      case 'system':
        return <Laptop size={size} />
      default:
        return <Sun size={size} />
    }
  }

  const getNextTheme = () => {
    switch (theme) {
      case 'light':
        return 'dark'
      case 'dark':
        return 'system'
      case 'system':
        return 'light'
      default:
        return 'light'
    }
  }

  return (
    <button
      className={cn('flex cursor-pointer items-center rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:hover:bg-dark/60', className)}
      onClick={() => dispatch(toggleTheme(getNextTheme()))}
    >
      {getThemeIcon()}
    </button>
  )
}

export default ThemeChanger
