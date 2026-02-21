import { Metadata } from 'next'
import { Locale } from '@/i18n-config'
import { getDictionary } from '@/get-dictionary'
import { FileUploadExample } from "./_components/file-upload-example"

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)
  return {
    title: dict.page.ui.fileUpload.title,
  }
}

const FileUploadPage = () => {
  return (
    <div className="flex justify-center items-center">
      <FileUploadExample />
    </div>
  )
}

export default FileUploadPage

