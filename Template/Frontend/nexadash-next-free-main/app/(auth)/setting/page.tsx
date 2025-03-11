'use client'

import PageHeading from '@/components/layout/page-heading'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LockKeyhole, LockKeyholeOpen, Mail, Phone, User } from 'lucide-react'
import Image from 'next/image'
import 'react-quill/dist/quill.snow.css'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

export default function Setting() {
    return (
        <div className="space-y-4">
            <PageHeading heading={'Settings'} />

            <div className="min-h-[calc(100vh_-_160px)] w-full rounded-lg">
                <Tabs defaultValue="my-profile">
                    <TabsList className="mb-5 overflow-x-auto rounded-lg bg-white shadow-sm">
                        <div className="inline-flex gap-2.5 px-5 py-[11px] text-sm/[18px] font-semibold">
                            <TabsTrigger
                                value="my-profile"
                                className="leading-3 data-[state=active]:bg-black data-[state=active]:text-white"
                            >
                                My Profile
                            </TabsTrigger>
                            <TabsTrigger
                                value="password"
                                className="leading-3 data-[state=active]:bg-black data-[state=active]:text-white"
                            >
                                Password
                            </TabsTrigger>
                        </div>
                    </TabsList>
                    <TabsContent
                        value="my-profile"
                        className="font-medium text-black"
                    >
                        <div className="grid gap-4 md:grid-cols-2">
                            <Card>
                                <CardHeader className="space-y-1.5 rounded-t-lg border-b border-gray-300 bg-gray-100 px-5 py-4 text-base/5 font-semibold text-black">
                                    <h3>Personal info</h3>
                                    <p className="text-sm/tight font-medium text-gray-700">
                                        Update your photo and personal details.
                                    </p>
                                </CardHeader>
                                <CardContent>
                                    <form className="space-y-5 p-4">
                                        <div className="flex flex-wrap items-center gap-2.5">
                                            <div className="size-[50px] shrink-0 overflow-hidden rounded-full">
                                                <Image
                                                    src="/images/upload.svg"
                                                    alt="upload"
                                                    width={50}
                                                    height={50}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="font-semibold leading-tight">
                                                    Update profile image
                                                </p>
                                                <p className="text-xs/tight text-gray">
                                                    Min 400*400px, PNG or JPEG
                                                </p>
                                            </div>
                                            <div className="relative ml-3 cursor-pointer">
                                                <Input
                                                    type="file"
                                                    className="absolute inset-0 h-full w-full cursor-pointer p-0 text-[0] leading-none opacity-0"
                                                />
                                                <Button
                                                    type="button"
                                                    variant={'outline-general'}
                                                    size={'large'}
                                                >
                                                    Upload
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="space-y-2.5">
                                            <label className="font-semibold leading-tight">
                                                First name
                                            </label>
                                            <div className="relative">
                                                <Input
                                                    type="text"
                                                    placeholder="Carla"
                                                    className="pl-9"
                                                />
                                                <User className="absolute left-3 top-3 size-4" />
                                            </div>
                                        </div>
                                        <div className="space-y-2.5">
                                            <label className="font-semibold leading-tight">
                                                Last name
                                            </label>
                                            <div className="relative">
                                                <Input
                                                    type="text"
                                                    placeholder="Williams"
                                                    className="pl-9"
                                                />
                                                <User className="absolute left-3 top-3 size-4" />
                                            </div>
                                        </div>
                                        <div className="space-y-2.5">
                                            <label className="font-semibold leading-tight">
                                                Email address
                                            </label>
                                            <div className="relative">
                                                <Input
                                                    type="text"
                                                    placeholder="CarlaVWilliams@gmail.com"
                                                    className="pl-9"
                                                />
                                                <Mail className="absolute left-3 top-3 size-4" />
                                                <button
                                                    type="button"
                                                    className="absolute right-1 top-0 rounded-lg bg-white p-2 font-semibold text-primary transition hover:text-black"
                                                >
                                                    Change
                                                </button>
                                            </div>
                                        </div>
                                        <div className="space-y-2.5">
                                            <label className="font-semibold leading-tight">
                                                Phone number
                                            </label>
                                            <div className="relative">
                                                <Input
                                                    type="tel"
                                                    placeholder="+1 660-794-6621"
                                                    className="pl-9"
                                                />
                                                <Phone className="absolute left-3 top-3 size-4" />
                                                <button
                                                    type="button"
                                                    className="absolute right-1 top-0 rounded-lg bg-white p-2 font-semibold text-primary transition hover:text-black"
                                                >
                                                    Change
                                                </button>
                                            </div>
                                        </div>
                                        <div className="!mt-7 flex items-center justify-end gap-4">
                                            <Button
                                                variant={'outline-general'}
                                                size={'large'}
                                                className="text-danger"
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                type="submit"
                                                variant={'black'}
                                                size={'large'}
                                            >
                                                Save changes
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="space-y-1.5 rounded-t-lg border-b border-gray-300 bg-gray-100 px-5 py-4 text-base/5 font-semibold text-black">
                                    <h3>Profile details</h3>
                                    <p className="text-sm/tight font-medium text-gray-700">
                                        This will be displayed on your profile.
                                    </p>
                                </CardHeader>
                                <CardContent>
                                    <form className="space-y-5 p-4">
                                        <div className="space-y-2.5">
                                            <label className="font-semibold leading-tight">
                                                Areas of interest
                                            </label>
                                            <Select>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Singing, learning" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Dancing">
                                                        Dancing
                                                    </SelectItem>
                                                    <SelectItem value="Riding">
                                                        Riding
                                                    </SelectItem>
                                                    <SelectItem value="Travelling">
                                                        Travelling
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2.5">
                                            <label className="font-semibold leading-tight">
                                                Professions
                                            </label>
                                            <Select>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Ex. software engineer, ect.." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Web Developer">
                                                        Web Developer
                                                    </SelectItem>
                                                    <SelectItem value="Marketing Manager">
                                                        Marketing Manager
                                                    </SelectItem>
                                                    <SelectItem value="Graphics Designer">
                                                        Graphics Designer
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2.5">
                                            <label className="font-semibold leading-tight">
                                                Skills
                                            </label>
                                            <Select>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Ex. developing, designing ect.." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Creativity">
                                                        Creativity
                                                    </SelectItem>
                                                    <SelectItem value="Data Analytics">
                                                        Data Analytics
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2.5">
                                            <label className="font-semibold leading-tight">
                                                Bio
                                            </label>
                                            <Textarea
                                                rows={5}
                                                placeholder="Aliquam pulvinar vestibulum blandit. Donec sed nisl libero. Fusce dignissim luctus sem eu dapibus. P"
                                            />
                                        </div>
                                        <div className="flex items-center justify-end gap-4">
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
                                                Update
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent
                        value="password"
                        className="mx-auto w-full max-w-[566px] font-medium text-black"
                    >
                        <Card>
                            <CardHeader className="space-y-1.5 rounded-t-lg border-b border-gray-300 bg-gray-100 px-5 py-4 text-base/5 font-semibold text-black">
                                <h3>Update Password</h3>
                                <p className="text-sm/tight font-medium text-gray-700">
                                    Enter your current password to make update
                                </p>
                            </CardHeader>
                            <CardContent>
                                <form className="space-y-5 p-4">
                                    <div className="space-y-2.5">
                                        <label className="font-semibold leading-tight">
                                            Current password
                                        </label>
                                        <Input
                                            type="password"
                                            placeholder="sdds45554"
                                            iconLeft={
                                                <LockKeyhole className="size-4" />
                                            }
                                        />
                                    </div>
                                    <div className="space-y-2.5">
                                        <label className="font-semibold leading-tight">
                                            New password
                                        </label>
                                        <Input
                                            type="password"
                                            placeholder="54841******"
                                            iconLeft={
                                                <LockKeyholeOpen className="size-4" />
                                            }
                                        />
                                    </div>
                                    <div className="space-y-2.5">
                                        <label className="font-semibold leading-tight">
                                            Confirm new password
                                        </label>
                                        <Input
                                            type="password"
                                            placeholder="54841******"
                                            iconLeft={
                                                <LockKeyholeOpen className="size-4" />
                                            }
                                        />
                                    </div>
                                    <div className="flex items-center justify-end gap-4">
                                        <Button
                                            variant={'outline-general'}
                                            size={'large'}
                                            className="text-danger"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            variant={'black'}
                                            size={'large'}
                                        >
                                            Update password
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
