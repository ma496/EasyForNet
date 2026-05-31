import { getServerTranslation } from '@/i18n'
import { FileUploadExample } from "./_components/file-upload-example"
import { AdminPageContent } from '@/components/layouts/admin-page-content'

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

