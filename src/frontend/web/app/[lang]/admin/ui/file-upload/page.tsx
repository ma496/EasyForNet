import { getServerTranslation } from '@/i18n'
import { Metadata } from 'next'
import { FileUploadExample } from "./_components/file-upload-example"
import { AdminPageContent } from '@/components/layouts/admin-page-content'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  return {
    title: await getServerTranslation(lang, 'page.ui.fileUpload.title'),
  }
}

interface FileUploadPageProps {
  params: Promise<{ lang: string }>
}

const FileUploadPage = async ({ params }: FileUploadPageProps) => {
  const { lang } = await params
  const title = await getServerTranslation(lang, 'page.ui.fileUpload.title')

  return (
    <AdminPageContent title={title}>
      <FileUploadExample />
    </AdminPageContent>
  )
}

export default FileUploadPage

