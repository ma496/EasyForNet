import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Cards',
};

const Cards = () => {
  return (
    <div className="container flex flex-col gap-4">
      {/* Basic usage */}
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-white-dark">Your content here</p>
        </CardContent>
      </Card>

      {/* Full-width card */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Wide Card</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-white-dark">Full width content</p>
        </CardContent>
      </Card>

      {/* Custom sized card */}
      <Card className="w-[300px]">
        <CardHeader>
          <CardTitle>Custom Width</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-white-dark">Content with custom width</p>
        </CardContent>
      </Card>

      {/* Card with custom spacing */}
      <Card className="max-w-md">
        <CardHeader className="p-8">
          <CardTitle className="text-2xl">Custom Spacing</CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <p className="text-white-dark">Content with custom padding</p>
        </CardContent>
      </Card>

      {/* Example with all sections and actions */}
      <Card>
        <CardHeader>
          <CardTitle>Product Card</CardTitle>
          <p className="text-sm text-white-dark">Premium Package</p>
        </CardHeader>
        <CardContent>
          <p>Complete access to all premium features</p>
          <ul className="mt-2">
            <li>Feature 1</li>
            <li>Feature 2</li>
            <li>Feature 3</li>
          </ul>
        </CardContent>
        <CardFooter className="gap-4 justify-between">
          <p className="font-semibold">$99/month</p>
          <Button size={'sm'}>Subscribe Now</Button>
        </CardFooter>
      </Card>
    </div>
  )
};

export default Cards;
