import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import CodeShowcase from '@/components/ui/code-showcase'
import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'Cards',
}

const Cards = () => {
  const basicCardCode = `<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    <p className="text-white-dark">Your content here</p>
  </CardContent>
</Card>`

  const fullWidthCardCode = `<Card className="w-full">
  <CardHeader>
    <CardTitle>Wide Card</CardTitle>
  </CardHeader>
  <CardContent>
    <p className="text-white-dark">Full width content</p>
  </CardContent>
</Card>`

  const customSizedCardCode = `<Card className="w-[300px]">
  <CardHeader>
    <CardTitle>Custom Width</CardTitle>
  </CardHeader>
  <CardContent>
    <p className="text-white-dark">Content with custom width</p>
  </CardContent>
</Card>`

  const customSpacingCardCode = `<Card className="max-w-md">
  <CardHeader className="p-8">
    <CardTitle className="text-2xl">Custom Spacing</CardTitle>
  </CardHeader>
  <CardContent className="p-8">
    <p className="text-white-dark">Content with custom padding</p>
  </CardContent>
</Card>`

  const productCardCode = `<Card>
  <CardHeader>
    <CardTitle>Product Card</CardTitle>
    <p className="text-sm text-white-dark">Premium Package</p>
  </CardHeader>
  <CardContent>
    <p>Complete access to all premium features</p>
    <ul className="mt-2 space-y-1">
      <li>✓ Advanced Analytics</li>
      <li>✓ Priority Support</li>
      <li>✓ Custom Integrations</li>
      <li>✓ Unlimited Storage</li>
    </ul>
  </CardContent>
  <CardFooter className="gap-4 justify-between">
    <p className="font-semibold text-lg">$99/month</p>
    <Button size="sm">Subscribe Now</Button>
  </CardFooter>
</Card>`

  const variantCardsCode = `{/* Light Card */}
<Card className="bg-white border border-gray-200">
  <CardContent className="p-6">
    <h3 className="font-semibold text-gray-900">Light Card</h3>
    <p className="text-gray-600 mt-2">Clean and minimal design</p>
  </CardContent>
</Card>

{/* Primary Card */}
<Card className="bg-primary text-white">
  <CardContent className="p-6">
    <h3 className="font-semibold">Primary Card</h3>
    <p className="opacity-90 mt-2">Highlighted content card</p>
  </CardContent>
</Card>

{/* Success Card */}
<Card className="bg-success text-white">
  <CardContent className="p-6">
    <h3 className="font-semibold">Success Card</h3>
    <p className="opacity-90 mt-2">Positive feedback design</p>
  </CardContent>
</Card>`

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Card Components</h1>
        <p className="text-white-dark">Flexible and extensible content containers with multiple variants and customization options.</p>
      </div>

      <div className="grid gap-8">
        {/* Basic Card */}
        <CodeShowcase
          title="Basic Card"
          description="Simple card with header and content"
          code={basicCardCode}
          preview={
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Card Title</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white-dark">Your content here</p>
              </CardContent>
            </Card>
          }
        />

        {/* Full Width Card */}
        <CodeShowcase
          title="Full Width Card"
          description="Card that spans the full container width"
          code={fullWidthCardCode}
          preview={
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Wide Card</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white-dark">Full width content</p>
              </CardContent>
            </Card>
          }
        />

        {/* Custom Sized Card */}
        <CodeShowcase
          title="Custom Width Card"
          description="Card with fixed width dimensions"
          code={customSizedCardCode}
          preview={
            <Card className="w-[300px]">
              <CardHeader>
                <CardTitle>Custom Width</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white-dark">Content with custom width</p>
              </CardContent>
            </Card>
          }
        />

        {/* Custom Spacing Card */}
        <CodeShowcase
          title="Custom Spacing"
          description="Card with custom padding and spacing"
          code={customSpacingCardCode}
          preview={
            <Card className="max-w-md">
              <CardHeader className="p-8">
                <CardTitle className="text-2xl">Custom Spacing</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <p className="text-white-dark">Content with custom padding</p>
              </CardContent>
            </Card>
          }
        />

        {/* Product Card */}
        <CodeShowcase
          title="Product Card"
          description="Complete card with header, content, and footer sections"
          code={productCardCode}
          preview={
            <Card className="max-w-md">
              <CardHeader>
                <CardTitle>Product Card</CardTitle>
                <p className="text-sm text-white-dark">Premium Package</p>
              </CardHeader>
              <CardContent>
                <p>Complete access to all premium features</p>
                <ul className="mt-2 space-y-1">
                  <li>✓ Advanced Analytics</li>
                  <li>✓ Priority Support</li>
                  <li>✓ Custom Integrations</li>
                  <li>✓ Unlimited Storage</li>
                </ul>
              </CardContent>
              <CardFooter className="gap-4 justify-between">
                <p className="font-semibold text-lg">$99/month</p>
                <Button size="sm">Subscribe Now</Button>
              </CardFooter>
            </Card>
          }
        />

        {/* Card Variants */}
        <CodeShowcase
          title="Card Variants"
          description="Different card styles and color schemes"
          code={variantCardsCode}
          preview={
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
              {/* Light Card */}
              <Card className="bg-white border border-gray-200 dark:bg-gray-50">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900">Light Card</h3>
                  <p className="text-gray-600 mt-2">Clean and minimal design</p>
                </CardContent>
              </Card>

              {/* Primary Card */}
              <Card className="bg-primary text-white">
                <CardContent className="p-6">
                  <h3 className="font-semibold">Primary Card</h3>
                  <p className="opacity-90 mt-2">Highlighted content card</p>
                </CardContent>
              </Card>

              {/* Success Card */}
              <Card className="bg-success text-white">
                <CardContent className="p-6">
                  <h3 className="font-semibold">Success Card</h3>
                  <p className="opacity-90 mt-2">Positive feedback design</p>
                </CardContent>
              </Card>
            </div>
          }
        />
      </div>
    </div>
  )
};

export default Cards
