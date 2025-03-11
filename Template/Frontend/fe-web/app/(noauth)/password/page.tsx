import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function Password() {
    return (
        <div className="grid h-screen w-full gap-5 p-4 md:grid-cols-2">
            <div className="relative hidden overflow-hidden rounded-[20px] bg-[#3B06D2] p-4 md:block md:h-[calc(100vh_-_32px)]">
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
                        <h2 className="text-xl/tight font-semibold text-black">
                            Set new password
                        </h2>
                        <p className="font-medium leading-tight">
                            Must be at least 8 characters
                        </p>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-[30px]">
                            <div className="relative space-y-3">
                                <label className="block font-semibold leading-none text-black">
                                    password
                                </label>
                                <Input
                                    type="password"
                                    variant={'input-form'}
                                    placeholder="Abc*********"
                                />
                                <div className="!mt-4 grid grid-cols-3 gap-[18px]">
                                    <span className="h-1 rounded-full bg-danger" />
                                    <span className="h-1 rounded-full bg-warning" />
                                    <span className="h-1 rounded-full bg-gray-300" />
                                </div>
                            </div>
                            <div className="relative space-y-3">
                                <label className="block font-semibold leading-none text-black">
                                    Confirm password
                                </label>
                                <Input
                                    type="password"
                                    variant={'input-form'}
                                    placeholder="Abc*********"
                                />
                            </div>

                            <Button
                                type="submit"
                                variant={'black'}
                                size={'large'}
                                className="w-full"
                            >
                                Reset password
                            </Button>
                            <Link
                                href="/login"
                                className="flex items-center justify-center gap-2 pl-1.5 text-sm/tight font-semibold text-black hover:text-[#3C3C3D]"
                            >
                                <ArrowLeft className="size-[18px]" />
                                Back to Login
                            </Link>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
