import { Card, CardContent } from '@/components/ui/card'

const PageHeading = ({ heading, className }: any) => {
    return (
        <Card className="px-5 py-3.5 text-base/5 shadow-sm font-semibold text-black">
            <CardContent>{heading}</CardContent>
        </Card>
    )
}

export default PageHeading
