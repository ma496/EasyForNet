import { Button } from '@/components/ui/button';
import { AlertCircleIcon, ArrowRightIcon, BellIcon, CheckIcon, MailIcon, Plus, SendIcon } from 'lucide-react';
import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IconButton } from '@/components/ui/icon-button';

export const metadata: Metadata = {
  title: 'Buttons',
};

const Buttons = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Button Components</h1>
      <div className="flex flex-wrap gap-6 justify-center items-start">
        {/* Button Variants */}
        <Card>
          <CardHeader>
            <CardTitle>Variants</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4 min-w-[150px]">
            <Button>Click me</Button>
            <Button variant="outline">Click me</Button>
            <Button variant="info" icon={<SendIcon size={18} />}>Click me</Button>
            <Button variant="outline-info">Click me</Button>
            <Button variant="success">Click me</Button>
            <Button variant="outline-success">Click me</Button>
            <Button variant="warning">Click me</Button>
            <Button variant="outline-warning">Click me</Button>
            <Button variant="danger">Click me</Button>
            <Button variant="outline-danger">Click me</Button>
            <Button variant="secondary">Click me</Button>
            <Button variant="outline-secondary">Click me</Button>
            <Button variant="dark">Click me</Button>
            <Button variant="outline-dark">Click me</Button>
          </CardContent>
        </Card>

        {/* Small Size Buttons */}
        <Card>
          <CardHeader>
            <CardTitle>Small Size</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4 min-w-[150px]">
            <Button size="sm">Click me</Button>
            <Button variant="outline" size="sm">Click me</Button>
            <Button variant="info" size="sm" icon={<SendIcon size={14} />}>Click me</Button>
            <Button variant="outline-info" size="sm">Click me</Button>
            <Button variant="success" size="sm">Click me</Button>
            <Button variant="outline-success" size="sm">Click me</Button>
            <Button variant="warning" size="sm">Click me</Button>
            <Button variant="outline-warning" size="sm">Click me</Button>
            <Button variant="danger" size="sm">Click me</Button>
            <Button variant="outline-danger" size="sm">Click me</Button>
            <Button variant="secondary" size="sm">Click me</Button>
            <Button variant="outline-secondary" size="sm">Click me</Button>
            <Button variant="dark" size="sm">Click me</Button>
            <Button variant="outline-dark" size="sm">Click me</Button>
          </CardContent>
        </Card>

        {/* Large Size Buttons */}
        <Card>
          <CardHeader>
            <CardTitle>Large Size</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4 min-w-[150px]">
            <Button size="lg">Click me</Button>
            <Button variant="outline" size="lg">Click me</Button>
            <Button variant="info" size="lg">Click me</Button>
            <Button variant="outline-info" size="lg">Click me</Button>
          </CardContent>
        </Card>

        {/* Rounded Buttons */}
        <Card>
          <CardHeader>
            <CardTitle>Rounded Style</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4 min-w-[150px]">
            <Button rounded="full">Click me</Button>
            <Button variant="outline" rounded="full">Click me</Button>
            <Button variant="info" rounded="full">Click me</Button>
            <Button variant="outline-info" rounded="full">Click me</Button>
            <Button variant="success" rounded="full">Click me</Button>
            <Button variant="outline-success" rounded="full">Click me</Button>
          </CardContent>
        </Card>

        {/* Icon Buttons */}
        <Card>
          <CardHeader>
            <CardTitle>Icon Buttons</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4 min-w-[150px]">
            <Button icon={<ArrowRightIcon />}>
              Default Size
            </Button>
            <Button size="sm" icon={<SendIcon size={14} />} className='w-32'>
              Small Size
            </Button>
            <Button size="lg" icon={<BellIcon />}>
              Large Size
            </Button>
            <Button variant="outline" icon={<MailIcon />}>
              Outline with Icon
            </Button>
            <Button variant="success" size="sm" icon={<CheckIcon />}>
              Success Small
            </Button>
            <Button variant="danger" size="lg" icon={<AlertCircleIcon />}>
              Danger Large
            </Button>
          </CardContent>
        </Card>

        {/* Custom Styled Buttons */}
        <Card>
          <CardHeader>
            <CardTitle>Custom Styles</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4 min-w-[150px]">
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white">
              Gradient Button
            </Button>
            <Button className="bg-emerald-500 shadow-lg shadow-emerald-500/50 hover:bg-emerald-600">
              Shadow Effect
            </Button>
            <Button className="bg-transparent hover:bg-blue-500 text-blue-700 hover:text-white border border-blue-500 hover:border-transparent">
              Hover Transform
            </Button>
            <Button className="bg-rose-500 hover:bg-rose-600 active:bg-rose-700 focus:ring-4 focus:ring-rose-300">
              Interactive States
            </Button>
            <Button className="relative overflow-hidden bg-violet-500 hover:bg-violet-600 before:absolute before:inset-0 before:bg-white/20 before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-300">
              Shine Effect
            </Button>
          </CardContent>
        </Card>

        {/* Loading State Buttons */}
        <Card>
          <CardHeader>
            <CardTitle>Loading States</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4 min-w-[150px]">
            <Button isLoading>Loading Default</Button>
            <Button variant="outline" isLoading>Loading Outline</Button>
            <Button variant="info" isLoading>Loading Info</Button>
            <Button variant="success" size="lg" isLoading>Loading Large</Button>
            <Button variant="warning" size="sm" isLoading>Loading Small</Button>
            <Button variant="danger" rounded="full" isLoading>Loading Rounded</Button>
            <Button variant="secondary" isLoading={false} icon={<BellIcon />}>Loading Secondary</Button>
          </CardContent>
        </Card>

        {/* Icon Buttons */}
        <Card>
          <CardHeader>
            <CardTitle>Icon Buttons</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4 min-w-[150px]">
            <IconButton icon={<Plus />} />
            <IconButton icon={<Plus />} size="sm" />
            <IconButton icon={<Plus />} size="lg" />

            <IconButton
              icon={<BellIcon size={18} />}
              variant="secondary"
              rounded="full"
            />
            <IconButton
              icon={<Plus />}
              variant="secondary"
              rounded="full"
              size="sm"
            />
            <IconButton
              icon={<Plus />}
              variant="secondary"
              rounded="full"
              size="lg"
            />

            <IconButton
              icon={<Plus />}
              isLoading={true}
            />
            <IconButton
              icon={<Plus />}
              isLoading={true}
              size="sm"
            />
            <IconButton
              icon={<Plus />}
              isLoading={true}
              size="lg"
            />
          </CardContent>
        </Card>

        {/* Custom Content Buttons */}
        <Card>
          <CardHeader>
            <CardTitle>Custom Content</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4 min-w-[150px]">
            <Button>
              <span className="font-bold">Bold Text</span>
            </Button>
            <Button variant="info">
              <div className="flex flex-col items-center">
                <span>Multi-line</span>
                <small>Button Text</small>
              </div>
            </Button>
            <Button variant="success">
              <div className="flex items-center gap-2">
                <span>With</span>
                <span className="bg-white/20 px-2 py-1 rounded">Badge</span>
              </div>
            </Button>
            <Button variant="warning">
              <div className="flex items-center">
                <span className="underline decoration-dotted">Styled</span>
                <span className="ms-1 italic">Text</span>
              </div>
            </Button>
            <Button variant="danger">
              <div className="flex items-center gap-1">
                <span>⭐</span>
                <span>With Emoji</span>
                <span>⭐</span>
              </div>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
};

export default Buttons;
