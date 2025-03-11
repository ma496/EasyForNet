import CountryField from '@/components/custom/country-field'
import PageHeading from '@/components/layout/page-heading'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export default function Form() {
    return (
        <div className="space-y-4">
            <PageHeading heading={'Form'} />

            <div className="flex min-h-[calc(100vh_-_160px)] w-full items-center justify-center">
                <Card className="w-full max-w-[780px] rounded-lg p-4">
                    <CardContent>
                        <form className="space-y-5">
                            <div className="space-y-2.5">
                                <label className="block font-semibold leading-tight text-black">
                                    Username
                                </label>
                                <Input
                                    type="text"
                                    placeholder="Enter name here"
                                />
                            </div>
                            <div className="grid gap-5 sm:grid-cols-2 sm:gap-3">
                                <div className="space-y-2.5">
                                    <label className="block font-semibold leading-tight text-black">
                                        Phone number
                                    </label>
                                    <CountryField />
                                </div>
                                <div className="space-y-2.5">
                                    <label className="block font-semibold leading-tight text-black">
                                        Email
                                    </label>
                                    <Input
                                        type="email"
                                        placeholder="john.example@gmail.com"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2.5">
                                <label className="block font-semibold leading-tight text-black">
                                    Address
                                </label>
                                <Textarea
                                    rows={6}
                                    placeholder="Enter address here"
                                />
                            </div>
                            <div className="grid gap-5 sm:grid-cols-3 sm:gap-3">
                                <div className="space-y-2.5">
                                    <label className="block font-semibold leading-tight text-black">
                                        City
                                    </label>
                                    <Select>
                                        <SelectTrigger
                                            className="w-full"
                                            icons="shorting"
                                        >
                                            <SelectValue placeholder="Chicago" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Newyork">
                                                Newyork
                                            </SelectItem>
                                            <SelectItem value="London">
                                                London
                                            </SelectItem>
                                            <SelectItem value="Calgary">
                                                Calgary
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2.5">
                                    <label className="block font-semibold leading-tight text-black">
                                        State
                                    </label>
                                    <Select>
                                        <SelectTrigger icons="shorting">
                                            <SelectValue placeholder="Illinois" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="California">
                                                California
                                            </SelectItem>
                                            <SelectItem value="Texas">
                                                Texas
                                            </SelectItem>
                                            <SelectItem value="Florida">
                                                Florida
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2.5">
                                    <label className="block font-semibold leading-tight text-black">
                                        Zip Code
                                    </label>
                                    <Input placeholder="60131" />
                                </div>
                            </div>
                            <Button
                                type="button"
                                variant={'black'}
                                className="bg-light-theme text-black hover:text-white"
                            >
                                <Plus className="size-4" />
                                Add Shopping Address
                            </Button>
                            <DropdownMenuSeparator className="mx-0" />
                            <div className="text-xs/4 font-medium">
                                By proceeding, you agree to our{' '}
                                <Link
                                    href="#"
                                    className="font-semibold text-black underline underline-offset-[3px] hover:text-[#3C3C3D]"
                                >
                                    Terms of Use
                                </Link>{' '}
                                and confirm you have read our{' '}
                                <Link
                                    href="#"
                                    className="font-semibold text-black underline underline-offset-[3px] hover:text-[#3C3C3D]"
                                >
                                    Privacy
                                </Link>{' '}
                                and{' '}
                                <Link
                                    href="#"
                                    className="font-semibold text-black underline underline-offset-[3px] hover:text-[#3C3C3D]"
                                >
                                    Cookie
                                </Link>{' '}
                                Statement.
                            </div>
                            <div className="flex items-center justify-between gap-4">
                                <Button
                                    variant={'outline-general'}
                                    size={'large'}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant={'black'}
                                    size={'large'}
                                >
                                    Save
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
