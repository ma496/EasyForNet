'use client'
import { toggleSidebar } from '@/store/slices/themeConfigSlice'
import { useAppDispatch, useAppSelector } from '@/store/hooks'

const Overlay = () => {
  const themeConfig = useAppSelector((state) => state.theme)
  const dispatch = useAppDispatch()
  return (
    <>
      {/* sidebar menu overlay */}
      <div className={`${(!themeConfig.sidebar && 'hidden') || ''} fixed inset-0 z-50 bg-[black]/60 lg:hidden`} onClick={() => dispatch(toggleSidebar())}></div>
    </>
  )
}

export default Overlay
