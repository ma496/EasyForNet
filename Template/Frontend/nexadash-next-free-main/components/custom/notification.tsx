import { Settings, Settings2, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Notification() {
    return (
        <div className="w-full max-w-[395px] divide-y divide-gray-300 overflow-hidden rounded-lg bg-white shadow-3xl">
            <div className="flex items-center justify-between gap-2.5 rounded-t-lg bg-gray-100 p-3 text-black">
                <h2 className="font-semibold leading-5">Notifications</h2>
                <button type="button" className="hover:opacity-80">
                    <X className="size-[18px]" />
                </button>
            </div>
            <div className="overflow-x-auto">
                <div className="flex items-center text-black sm:gap-2.5">
                    <div className="flex items-center gap-2 px-2 py-3 sm:gap-3 sm:px-3">
                        <button
                            type="button"
                            className="flex items-center gap-1.5 transition hover:opacity-80"
                        >
                            <span className="text-xs/4 font-semibold">
                                Inbox
                            </span>
                            <Badge size={'number'} variant={'outline'}>
                                10
                            </Badge>
                        </button>
                        <button
                            type="button"
                            className="flex items-center gap-1.5 transition hover:opacity-80"
                        >
                            <span className="text-xs/4 font-semibold">
                                Following
                            </span>
                            <Badge size={'number'} variant={'outline'}>
                                45
                            </Badge>
                        </button>
                        <button
                            type="button"
                            className="flex items-center gap-1.5 transition hover:opacity-80"
                        >
                            <span className="text-xs/4 font-semibold">All</span>
                            <Badge size={'number'} variant={'primary'}>
                                55
                            </Badge>
                        </button>
                    </div>
                    <span className="h-3 w-0.5 shrink-0 rounded-full bg-gray-300"></span>
                    <div className="flex grow items-center justify-between gap-2 px-2 py-3 sm:gap-3 sm:px-3">
                        <button
                            type="button"
                            className="text-xs/4 font-semibold transition hover:opacity-80"
                        >
                            Archive
                        </button>
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                className="transition hover:opacity-80"
                            >
                                <Settings2 className="size-4" />
                            </button>
                            <button
                                type="button"
                                className="transition hover:opacity-80"
                            >
                                <Settings className="size-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="max-h-[466px] divide-y divide-gray-300 overflow-y-auto">
                <div className="flex gap-3 px-3 py-5 hover:bg-gray-100">
                    <Link
                        href="#"
                        className="size-9 shrink-0 overflow-hidden rounded-lg"
                    >
                        <Image
                            src="/images/avatar-forty.svg"
                            alt="Profile"
                            width={36}
                            height={36}
                            className="h-full w-full object-cover"
                        />
                    </Link>
                    <div className="space-y-2.5">
                        <p className="text-xs/5 font-medium text-gray">
                            <span className="font-bold text-black">
                                Brooklyn Simmons
                            </span>
                            &nbsp; recommended this online shop to byu
                            electronics,&nbsp;
                            <span className="font-bold text-black">
                                Advantage Electric
                            </span>
                        </p>
                        <div className="flex items-center gap-2.5 text-xs/4 font-medium text-gray">
                            <span>5 minutes ago</span>
                            <span className="size-1 shrink-0 rounded-full bg-primary"></span>
                            <span>Advantage Electric</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-3 px-3 py-5 hover:bg-gray-100">
                    <Link
                        href="#"
                        className="size-9 shrink-0 overflow-hidden rounded-lg"
                    >
                        <Image
                            src="/images/avatar.svg"
                            alt="Profile"
                            width={36}
                            height={36}
                            className="h-full w-full object-cover"
                        />
                    </Link>
                    <div className="space-y-2.5">
                        <p className="text-xs/5 font-medium text-gray">
                            <span className="font-bold text-black">
                                Sophia Williams
                            </span>
                            &nbsp; invites you ABC.fig file with you,&nbsp;
                            <span className="font-bold text-black">
                                check item now
                            </span>
                        </p>
                        <div className="flex items-center gap-2.5 text-xs/4 font-medium text-gray">
                            <span>5 minutes ago</span>
                            <span className="size-1 shrink-0 rounded-full bg-primary"></span>
                            <span>New item</span>
                        </div>
                        <div className="flex gap-4">
                            <Button type="button" variant={'outline-general'}>
                                Deny
                            </Button>
                            <Button type="button" variant={'black'}>
                                Approve
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="flex gap-3 px-3 py-5 hover:bg-gray-100">
                    <Link
                        href="#"
                        className="size-9 shrink-0 overflow-hidden rounded-lg"
                    >
                        <Image
                            src="/images/avatar-three.svg"
                            alt="Profile"
                            width={36}
                            height={36}
                            className="h-full w-full object-cover"
                        />
                    </Link>
                    <div className="space-y-2.5">
                        <p className="text-xs/5 font-medium text-gray">
                            <span className="font-bold text-black">
                                Ava Davis
                            </span>
                            &nbsp; changed&nbsp;
                            <span className="font-bold text-black">
                                the cosmetic payment
                            </span>
                            &nbsp; due date to Sunday 05 March 2023
                        </p>
                        <div className="flex items-center gap-2.5 text-xs/4 font-medium text-gray">
                            <span>5 minutes ago</span>
                            <span className="size-1 shrink-0 rounded-full bg-primary"></span>
                            <span>New item</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-3 px-3 py-5 hover:bg-gray-100">
                    <Link
                        href="#"
                        className="size-9 shrink-0 overflow-hidden rounded-lg"
                    >
                        <Image
                            src="/images/avatar-two.svg"
                            alt="Profile"
                            width={36}
                            height={36}
                            className="h-full w-full object-cover"
                        />
                    </Link>
                    <div className="space-y-2.5">
                        <p className="text-xs/5 font-medium text-gray">
                            <span className="font-bold text-black">
                                Katherine Johnson
                            </span>
                            &nbsp; edit description of 🏖️ &nbsp;
                            <span className="font-bold text-black">
                                Paris Travel Planning
                            </span>
                        </p>
                        <div className="flex items-center gap-2.5 text-xs/4 font-medium text-gray">
                            <span>5 minutes ago</span>
                            <span className="size-1 shrink-0 rounded-full bg-primary"></span>
                            <span>Travelling</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="p-3 text-right">
                <Button type="button" variant={'black'} size={'large'}>
                    View all notifications
                </Button>
            </div>
        </div>
    )
}
