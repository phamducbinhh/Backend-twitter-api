import formidable, { File } from 'formidable'
import fs from 'fs'
import path from 'path'
import { UPLOAD_IMAGE_TEMP_DIR, UPLOAD_VIDEO_TEMP_DIR } from '~/constants/dir'
export const initFolder = () => {
  ;[UPLOAD_IMAGE_TEMP_DIR, UPLOAD_VIDEO_TEMP_DIR].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, {
        recursive: true // mục đích là để tạo folder nested
      })
    }
  })
}

export const handleUploadImage = async (req: Request) => {
  const form = formidable({
    uploadDir: path.resolve(UPLOAD_IMAGE_TEMP_DIR),
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

      const file = files.image // Lấy file từ trường `image`
      if (!file) {
        return reject(new Error('File is empty'))
      }

      resolve(file as File[]) // Trả về file đã upload
    })
  })
}

export const getNameFromFullname = (fullname: string) => {
  const namearr = fullname.split('.')
  namearr.pop()
  return namearr.join('')
}
