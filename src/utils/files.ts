import formidable from 'formidable'
import fs from 'fs'
import path from 'path'
export const initFolder = () => {
  const uploadsDir = path.resolve('uploads')
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, {
      recursive: true
    })
  }
}

export const handleUploadSingleImages = async (req: Request) => {
  const form = formidable({
    uploadDir: path.resolve('uploads'),
    maxFields: 1,
    keepExtensions: true,
    maxFileSize: 300 * 1024 // 300kb
  })

  return await new Promise<{ files: formidable.Files }>((resolve, reject) => {
    form.parse(req as any, (err, fields, files) => {
      if (err) return reject(err)
      resolve(files as any)
    })
  })
}
