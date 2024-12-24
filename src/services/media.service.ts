import { File } from 'formidable'
import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import { UPLOAD_IMAGE_DIR } from '~/constants/dir'
import { HttpStatusCode } from '~/constants/HttpStatusCode'
import { USERS_MESSAGES } from '~/constants/messages'
import { handleUploadImage } from '~/utils/files'
import { handleResponse } from '~/utils/response'

class MediaService {
  async uploadImageMedia(req: any) {
    const files: File[] = await handleUploadImage(req)
    const uploadedFile = files[0]
    const inputPath = uploadedFile.filepath

    const outputDir = path.resolve(UPLOAD_IMAGE_DIR)
    const outputFileName = `processed-${Date.now()}.webp`
    const outputPath = path.join(outputDir, outputFileName)

    // Thực hiện chuyển đổi sang WebP
    const resolve = await sharp(inputPath).webp({ quality: 80 }).toFile(outputPath)

    // Xóa file gốc nếu cần
    fs.unlinkSync(inputPath)

    return handleResponse(HttpStatusCode.SUCCESS, true, USERS_MESSAGES.UPLOAD_SUCCESS, resolve)
  }
}

export default new MediaService()
