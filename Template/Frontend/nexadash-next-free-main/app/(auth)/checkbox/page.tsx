import PageHeading from '@/components/layout/page-heading'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'

export default function CheckBox() {
    return (
        <div className="space-y-4">
            <PageHeading heading={'Check Box & Radio Buttons'} />

            <div className="min-h-[calc(100vh_-_160px)]">
                <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    <div className="rounded-lg bg-white">
                        <div className="border-b border-gray-300 bg-gray-200 px-4 py-3 font-semibold leading-[18px] text-black">
                            Check Box
                        </div>
                        <div className="space-y-2.5 px-4 py-3">
                            <div className="flex items-center space-x-2">
                                <Checkbox id="terms" />
                                <label
                                    htmlFor="terms"
                                    className="text-xs font-semibold leading-none text-black peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Default checkbox
                                </label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="terms1" />
                                <label
                                    htmlFor="terms1"
                                    className="text-xs font-semibold leading-none text-black peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Checked checkbox
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-lg bg-white">
                        <div className="border-b border-gray-300 bg-gray-200 px-4 py-3 font-semibold leading-[18px] text-black">
                            Disabled
                        </div>
                        <div className="space-y-2.5 px-4 py-3">
                            <div className="flex items-center space-x-2">
                                <Checkbox id="terms2" disabled />
                                <label
                                    htmlFor="terms2"
                                    className="text-xs font-semibold leading-none text-black peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Disabled checkbox
                                </label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="terms3" checked disabled />
                                <label
                                    htmlFor="terms3"
                                    className="text-xs font-semibold leading-none text-black peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Disabled checkbox
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-lg bg-white">
                        <div className="border-b border-gray-300 bg-gray-200 px-4 py-3 font-semibold leading-[18px] text-black">
                            Radio
                        </div>
                        <RadioGroup className="gap-2.5 px-4 py-3">
                            <label className="flex items-center gap-2.5">
                                <RadioGroupItem value="Default" />
                                <h3 className="text-xs/none font-semibold leading-tight text-black">
                                    Default radio
                                </h3>
                            </label>
                            <label className="flex items-center gap-2.5">
                                <RadioGroupItem value="DefaultChecked" />
                                <h3 className="text-xs/none font-semibold leading-tight text-black">
                                    Default checked radio
                                </h3>
                            </label>
                        </RadioGroup>
                    </div>
                    <div className="rounded-lg bg-white">
                        <div className="border-b border-gray-300 bg-gray-200 px-4 py-3 font-semibold leading-[18px] text-black">
                            Disabled
                        </div>
                        <RadioGroup className="gap-2.5 px-4 py-3" disabled>
                            <label className="flex items-center gap-2.5">
                                <RadioGroupItem value="Default" disabled />
                                <h3 className="text-xs/none font-semibold leading-tight text-black">
                                    Disabled radio
                                </h3>
                            </label>
                            <label className="flex items-center gap-2.5 mb-px">
                                <RadioGroupItem
                                    value="DefaultChecked"
                                    disabled
                                    checked
                                />
                                <h3 className="text-xs/none font-semibold leading-tight text-black">
                                    Disabled checked radio
                                </h3>
                            </label>
                        </RadioGroup>
                    </div>
                    <div className="rounded-lg bg-white">
                        <div className="border-b border-gray-300 bg-gray-200 px-4 py-3 font-semibold leading-[18px] text-black">
                            Colored Checkboxes
                        </div>
                        <div className="space-y-2.5 px-4 py-3">
                            <label className="flex items-center gap-2">
                                <Checkbox />
                                <h3 className="text-xs font-semibold leading-tight text-black peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Dark
                                </h3>
                            </label>
                            <label className="flex items-center gap-2">
                                <Checkbox color={'primary'} />
                                <h3 className="text-xs font-semibold leading-tight text-black peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Blue
                                </h3>
                            </label>
                            <label className="flex items-center gap-2">
                                <Checkbox color={'success'} />
                                <h3 className="text-xs font-semibold leading-tight text-black peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Success
                                </h3>
                            </label>
                            <label className="flex items-center gap-2">
                                <Checkbox color={'pending'} />
                                <h3 className="text-xs font-semibold leading-tight text-black peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Pending
                                </h3>
                            </label>
                            <label className="flex items-center gap-2">
                                <Checkbox color={'danger'} />
                                <h3 className="text-xs font-semibold leading-tight text-black peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Danger
                                </h3>
                            </label>
                        </div>
                    </div>
                    <div className="rounded-lg bg-white">
                        <div className="border-b border-gray-300 bg-gray-200 px-4 py-3 font-semibold leading-[18px] text-black">
                            Colored Checkboxes
                        </div>
                        <div className="space-y-2.5 px-4 py-3">
                            <label className="flex items-center gap-2">
                                <Checkbox
                                    variant={'outline'}
                                    color={'outlineBlack'}
                                />
                                <h3 className="text-xs font-semibold leading-tight text-black peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Dark
                                </h3>
                            </label>
                            <label className="flex items-center gap-2">
                                <Checkbox
                                    variant={'outline'}
                                    color={'outlinePrimary'}
                                />
                                <h3 className="text-xs font-semibold leading-tight text-black peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Blue
                                </h3>
                            </label>
                            <label className="flex items-center gap-2">
                                <Checkbox
                                    variant={'outline'}
                                    color={'outlineSuccess'}
                                />
                                <h3 className="text-xs font-semibold leading-tight text-black peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Success
                                </h3>
                            </label>
                            <label className="flex items-center gap-2">
                                <Checkbox
                                    variant={'outline'}
                                    color={'outlinePending'}
                                />
                                <h3 className="text-xs font-semibold leading-tight text-black peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Pending
                                </h3>
                            </label>
                            <label className="flex items-center gap-2">
                                <Checkbox
                                    variant={'outline'}
                                    color={'outlineDanger'}
                                />
                                <h3 className="text-xs font-semibold leading-tight text-black peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Danger
                                </h3>
                            </label>
                        </div>
                    </div>
                    <div className="rounded-lg bg-white">
                        <div className="border-b border-gray-300 bg-gray-200 px-4 py-3 font-semibold leading-[18px] text-black">
                            Colored Radio
                        </div>
                        <RadioGroup
                            defaultValue="Dark"
                            className="!gap-2.5 px-4 py-3"
                        >
                            <label className="flex items-center gap-2.5">
                                <RadioGroupItem value="Dark" />
                                <h3 className="text-xs/none font-semibold leading-tight text-black">
                                    Dark
                                </h3>
                            </label>
                            <label className="flex items-center gap-2.5">
                                <RadioGroupItem value="Blue" color="primary" />
                                <h3 className="text-xs/none font-semibold leading-tight text-black">
                                    Blue
                                </h3>
                            </label>
                            <label className="flex items-center gap-2.5">
                                <RadioGroupItem
                                    value="Success"
                                    color="success"
                                />
                                <h3 className="text-xs/none font-semibold leading-tight text-black">
                                    Success
                                </h3>
                            </label>
                            <label className="flex items-center gap-2.5">
                                <RadioGroupItem
                                    value="warning"
                                    color="pending"
                                />
                                <h3 className="text-xs/none font-semibold leading-tight text-black">
                                    Pending
                                </h3>
                            </label>
                            <label className="flex items-center gap-2.5">
                                <RadioGroupItem value="danger" color="danger" />
                                <h3 className="text-xs/none font-semibold leading-tight text-black">
                                    Danger
                                </h3>
                            </label>
                        </RadioGroup>
                    </div>
                    <div className="rounded-lg bg-white">
                        <div className="border-b border-gray-300 bg-gray-200 px-4 py-3 font-semibold leading-[18px] text-black">
                            Outline Radio
                        </div>
                        <RadioGroup
                            defaultValue="Dark"
                            className="!gap-2.5 px-4 py-3"
                        >
                            <label className="flex items-center gap-2.5">
                                <RadioGroupItem
                                    value="Dark"
                                    color="outlineBlack"
                                />
                                <h3 className="text-xs/none font-semibold leading-tight text-black">
                                    Dark
                                </h3>
                            </label>
                            <label className="flex items-center gap-2.5">
                                <RadioGroupItem
                                    value="Blue"
                                    color="outlinePrimary"
                                />
                                <h3 className="text-xs/none font-semibold leading-tight text-black">
                                    Blue
                                </h3>
                            </label>
                            <label className="flex items-center gap-2.5">
                                <RadioGroupItem
                                    value="Success"
                                    color="outlineSuccess"
                                />
                                <h3 className="text-xs/none font-semibold leading-tight text-black">
                                    Success
                                </h3>
                            </label>
                            <label className="flex items-center gap-2.5">
                                <RadioGroupItem
                                    value="warning"
                                    color="outlinePending"
                                />
                                <h3 className="text-xs/none font-semibold leading-tight text-black">
                                    Pending
                                </h3>
                            </label>
                            <label className="flex items-center gap-2.5">
                                <RadioGroupItem
                                    value="danger"
                                    color="outlineDanger"
                                />
                                <h3 className="text-xs/none font-semibold leading-tight text-black">
                                    Danger
                                </h3>
                            </label>
                        </RadioGroup>
                    </div>
                    <div className="rounded-lg bg-white">
                        <div className="border-b border-gray-300 bg-gray-200 px-4 py-3 font-semibold leading-[18px] text-black">
                            Colored Switches
                        </div>
                        <div className="space-y-2.5 px-4 py-3">
                            <label className="flex items-center space-x-2">
                                <Switch />
                                <h2 className="text-xs/none font-semibold text-black">
                                    Dark
                                </h2>
                            </label>
                            <label className="flex items-center space-x-2">
                                <Switch color="primary" />
                                <h2 className="text-xs/none font-semibold text-black">
                                    Primary
                                </h2>
                            </label>
                            <label className="flex items-center space-x-2">
                                <Switch color="success" />
                                <h2 className="text-xs/none font-semibold text-black">
                                    Success
                                </h2>
                            </label>
                            <label className="flex items-center space-x-2">
                                <Switch color="pending" />
                                <h2 className="text-xs/none font-semibold text-black">
                                    Pending
                                </h2>
                            </label>
                            <label className="flex items-center space-x-2">
                                <Switch color="danger" />
                                <h2 className="text-xs/none font-semibold text-black">
                                    Danger
                                </h2>
                            </label>
                        </div>
                    </div>
                    <div className="rounded-lg bg-white">
                        <div className="border-b border-gray-300 bg-gray-200 px-4 py-3 font-semibold leading-[18px] text-black">
                            Toggle Switches Style - 2
                        </div>
                        <div className="space-y-2.5 px-4 py-3">
                            <label className="flex items-center space-x-2">
                                <Switch
                                    variant={'outline'}
                                    color="outlineBlack"
                                />
                                <h2 className="text-xs/tight font-semibold text-black">
                                    Dark
                                </h2>
                            </label>
                            <label className="flex items-center space-x-2">
                                <Switch
                                    variant={'outline'}
                                    color="outlinePrimary"
                                />
                                <h2 className="text-xs/tight font-semibold text-black">
                                    Primary
                                </h2>
                            </label>
                            <label className="flex items-center space-x-2">
                                <Switch
                                    variant={'outline'}
                                    color="outlineSuccess"
                                />
                                <h2 className="text-xs/tight font-semibold text-black">
                                    Success
                                </h2>
                            </label>
                            <label className="flex items-center space-x-2">
                                <Switch
                                    variant={'outline'}
                                    color="outlinePending"
                                />
                                <h2 className="text-xs/tight font-semibold text-black">
                                    Pending
                                </h2>
                            </label>
                            <label className="flex items-center space-x-2">
                                <Switch
                                    variant={'outline'}
                                    color="outlineDanger"
                                />
                                <h2 className="text-xs/tight font-semibold text-black">
                                    Danger
                                </h2>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
