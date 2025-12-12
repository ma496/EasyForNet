import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Error 404',
}

const NotFound = () => {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <div className="px-6 py-16 text-center font-semibold before:absolute before:left-1/2 before:container before:aspect-square before:-translate-x-1/2 before:rounded-full before:bg-[linear-gradient(180deg,#4361EE_0%,rgba(67,97,238,0)_50.73%)] before:opacity-10 md:py-20">
        <div className="relative">
          <Image
            width={500} height={500}
            src="/assets/images/error/404-dark.svg"
            alt="404"
            className="dark-img mx-auto -mt-10 w-full max-w-xs object-cover md:-mt-14 md:max-w-xl"
            loading="eager"
          />
          <Image
            width={500} height={500}
            src="/assets/images/error/404-light.svg"
            alt="404"
            className="light-img mx-auto -mt-10 w-full max-w-xs object-cover md:-mt-14 md:max-w-xl"
            loading="eager"
          />
          <p className="mt-5 text-base dark:text-white">The page you requested was not found!</p>
          <Link href="/" className="btn mx-auto mt-7! w-max border-0 btn-gradient uppercase shadow-none">
            Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFound
