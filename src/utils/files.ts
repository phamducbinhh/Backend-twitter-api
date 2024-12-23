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
    maxFileSize: 300 * 1024, // 300kb
    filter: function ({ name, mimetype }) {
      const valid = name === 'image' && Boolean(mimetype?.includes('image/'))
      if (!valid) {
        form.emit('error' as any, new Error('File type is not valid') as any)
      }
      return valid
    }
  })

  return await new Promise<File[]>((resolve, reject) => {
    form.parse(req as any, (err, fields, files) => {
      if (err) return reject(err)

      if (!files.image) {
        return reject(new Error('File is empty'))
      }
      resolve(files as any)
    })
  })
}
