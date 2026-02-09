import { Metadata } from "next"
import { FileUploadExample } from "./_components/file-upload-example"

export const metadata: Metadata = {
  title: "File Upload",
}

const FileUploadPage = () => {
  return (
    <div className="flex justify-center items-center">
      <FileUploadExample />
    </div>
  )
}

export default FileUploadPage

