import { Locale, getDictionary } from '@/i18n'
import { Metadata } from 'next'
import { FileUploadExample } from "./_components/file-upload-example"
import { AdminPageContent } from '@/components/layouts/admin-page-content'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)
  return {
    title: dict.page.ui.fileUpload.title,
  }
}

interface FileUploadPageProps {
  params: Promise<{ lang: string }>
}

const FileUploadPage = async ({ params }: FileUploadPageProps) => {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)

  return (
    <AdminPageContent title={dict.page.ui.fileUpload.title}>
      <FileUploadExample />
    </AdminPageContent>
  )
}

export default FileUploadPage

