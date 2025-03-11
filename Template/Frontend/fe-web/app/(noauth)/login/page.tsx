import IconFacebook from '@/components/icons/icon-facebook'
import IconGoogle from '@/components/icons/icon-google'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { AtSign, TriangleAlert, User } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function Login() {
    return (
        <div className="grid h-screen w-full gap-5 p-4 md:grid-cols-2">
            <div className="relative hidden overflow-hidden rounded-[20px] bg-[#3B06D2] p-4 md:block md:h-full">
                <Image
                    src="/images/logo-white.svg"
                    width={145}
                    height={34}
                    alt="Logo"
                    className="absolute left-4 top-4 z-10 h-auto w-auto"
                />
                <Image
                    src="/images/login-cover-step.svg"
                    width={240}
                    height={240}
                    alt="Logo Cover Step"
                    className="absolute left-0 top-0.5 size-40 md:h-auto md:w-auto"
                />
                <Image
                    src="/images/login-cover-cartoon.svg"
                    width={145}
                    height={34}
                    alt="Logo Cover Cartoon"
                    className="absolute bottom-0 left-0 right-0 h-52 w-full md:h-96"
                />
                <div className="absolute left-1/2 top-1/4 w-full max-w-md -translate-x-1/2 space-y-3 px-3 text-center text-white">
                    <h2 className="text-lg font-bold sm:text-2xl lg:text-[30px]/9">
                        Turn your ideas into reality.
                    </h2>
                    <p className="text-sm lg:text-xl/[30px]">
                        Encourages making dreams tangible through effort and
                        creativity.
                    </p>
                </div>
            </div>
            <div className="flex overflow-y-auto py-2">
                <Card className="m-auto w-full max-w-[400px] space-y-[30px] p-5 shadow-sm md:w-[400px]">
                    <CardHeader className="space-y-2">
                        <h2 className="text-lg font-semibold text-black lg:text-xl/tight">
                            Sign In to your account
                        </h2>
                        <p className="font-medium leading-tight">
                            Enter your details to proceed future
                        </p>
                    </CardHeader>
                    <CardContent className="space-y-[30px]">
                        <div className="grid grid-cols-2 gap-4">
                            <Link href="#">
                                <Button
                                    variant={'outline-general'}
                                    size={'large'}
                                    className="w-full"
                                >
                                    <IconGoogle className="!size-[18px]" />
                                    Google
                                </Button>
                            </Link>
                            <Link href="#">
                                <Button
                                    variant={'outline-general'}
                                    size={'large'}
                                    className="w-full"
                                >
                                    <IconFacebook className="!size-[18px] text-[#0866FF]" />
                                    Facebook
                                </Button>
                            </Link>
                        </div>
                        <div className="flex items-center gap-2.5">
                            <span className="h-px w-full bg-[#E2E4E9]"></span>
                            <p className="shrink-0 font-medium leading-tight">
                                or login with email
                            </p>
                            <span className="h-px w-full bg-[#E2E4E9]"></span>
                        </div>
                        <form className="space-y-[30px]">
                            <div className="relative space-y-3">
                                <label className="block font-semibold leading-none text-black">
                                    Username
                                </label>
                                <Input
                                    type="text"
                                    variant={'input-form'}
                                    placeholder="Victoria Gillham"
                                    iconRight={<User className="size-[18px]" />}
                                />
                            </div>
                            <div className="relative space-y-3">
                                <label className="block font-semibold leading-none text-black">
                                    Email address
                                </label>
                                <Input
                                    type="email"
                                    variant={'input-form'}
                                    placeholder="username@domain.com"
                                    iconRight={
                                        <AtSign className="size-[18px]" />
                                    }
                                />
                            </div>
                            <div className="!mt-2.5 flex items-center gap-2">
                                <TriangleAlert className="size-[18px] shrink-0 text-danger" />
                                <p className="text-xs/tight font-medium text-danger">
                                    Please enter an email address in the format{' '}
                                    <span className="font-bold">
                                        username@gmail.com
                                    </span>
                                </p>
                            </div>
                            <div className="relative space-y-3">
                                <label className="block font-semibold leading-none text-black">
                                    Password
                                </label>
                                <Input
                                    type="password"
                                    variant={'input-form'}
                                    placeholder="Abc*********"
                                />
                            </div>
                            <Link
                                href="/forgot"
                                className="!mt-4 block text-right text-xs/4 font-semibold text-black underline underline-offset-[3px] hover:text-[#3C3C3D]"
                            >
                                Forgot password?
                            </Link>
                            <Button
                                type="submit"
                                variant={'black'}
                                size={'large'}
                                className="w-full"
                            >
                                Login
                            </Button>
                            <div className="text-center text-xs/4 font-semibold text-black">
                                Don’t have an account?
                                <Link
                                    href="/register"
                                    className="pl-1.5 text-sm/tight underline underline-offset-4 hover:text-[#3C3C3D]"
                                >
                                    Register
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
