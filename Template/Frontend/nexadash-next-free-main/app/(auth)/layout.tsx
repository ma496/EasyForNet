import Header from '@/components/layout/header'
import Sidebar from '@/components/layout/sidebar'

export default async function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <>
            <Header />
            <Sidebar />
            <div id="main-content" className="p-4 transition-all lg:ml-[260px] mt-[60px]">
                {children}
            </div>
        </>
    )
}
