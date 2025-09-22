"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EyeIcon, CodeIcon, CopyIcon, CheckIcon } from 'lucide-react'

interface CodeShowcaseProps {
  title: string
  description?: string
  preview: React.ReactNode
  code: string
  className?: string
}

export const CodeShowcase = ({ title, description, preview, code, className = '' }: CodeShowcaseProps) => {
  const [showCode, setShowCode] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy code:', error)
    }
  }

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            {description && (
              <p className="text-sm text-white-dark mt-1">{description}</p>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCode(!showCode)}
              icon={showCode ? <EyeIcon size={16} /> : <CodeIcon size={16} />}
            >
              {showCode ? 'Preview' : 'Code'}
            </Button>
            {showCode && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyCode}
                icon={copied ? <CheckIcon size={16} /> : <CopyIcon size={16} />}
                className={copied ? 'text-success' : ''}
              >
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {showCode ? (
          <div className="relative">
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
              <code className="language-tsx">{code}</code>
            </pre>
          </div>
        ) : (
          <div className="min-h-[100px] flex items-center justify-center">
            {preview}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default CodeShowcase
