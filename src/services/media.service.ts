import { File } from 'formidable'
import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import { UPLOAD_IMAGE_DIR } from '~/constants/dir'
import { MediaType } from '~/constants/enums'
import { HttpStatusCode } from '~/constants/HttpStatusCode'
import { USERS_MESSAGES } from '~/constants/messages'
import { Media } from '~/types/media.type'
import { handleUploadImage, handleUploadVideo } from '~/utils/files'
import { handleResponse } from '~/utils/response'

class MediaService {
  async uploadImageMedia(req: any) {
    const files: File[] = await handleUploadImage(req)

    // Bước 2: Dùng `map` để xử lý từng file
    const result: Media[] | any = await Promise.all(
      files.map(async (uploadedFile) => {
        const inputPath = uploadedFile.filepath

        const outputDir = path.resolve(UPLOAD_IMAGE_DIR)
        const outputFileName = `processed-${Date.now()}-${Math.random().toString(36).substring(2, 9)}.webp`
        const outputPath = path.join(outputDir, outputFileName)

        // Bước 3: Chuyển đổi ảnh sang WebP
        await sharp(inputPath).webp({ quality: 80 }).toFile(outputPath)

        // Bước 4: Xóa file gốc nếu cần
        fs.unlinkSync(inputPath)

        // Bước 5: Tạo URL cho ảnh đã chuyển đổi
        const imageUrl = `${req.protocol}://${req.get('host')}/static/image/${outputFileName}`
        return {
          url: imageUrl,
          type: MediaType.Image
        }
      })
    )

    // Bước 6: Trả về phản hồi với danh sách URL của ảnh đã xử lý
    return handleResponse(HttpStatusCode.SUCCESS, true, USERS_MESSAGES.UPLOAD_SUCCESS, {
      urls: result
    })
  }
  async uploadVideoMedia(req: any) {
    const files: File[] = await handleUploadVideo(req)

    const { newFilename } = files[0]
    const videoUrl = `${req.protocol}://${req.get('host')}/static/video/${newFilename}`

    return handleResponse(HttpStatusCode.SUCCESS, true, USERS_MESSAGES.UPLOAD_SUCCESS, {
      urls: videoUrl,
      type: MediaType.Video
    })
  }
}

export default new MediaService()
