import { v2 as cloudinary } from 'cloudinary'
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } from './env-util'

// Validate Cloudinary configuration
if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    console.error('❌ Cloudinary configuration missing!')
    console.error('CLOUD_NAME:', CLOUDINARY_CLOUD_NAME ? '✅ Set' : '❌ Missing')
    console.error('API_KEY:', CLOUDINARY_API_KEY ? '✅ Set' : '❌ Missing')
    console.error('API_SECRET:', CLOUDINARY_API_SECRET ? '✅ Set' : '❌ Missing')
    throw new Error('Cloudinary configuration is incomplete')
}

// Configure Cloudinary
cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
})

console.log('✅ Cloudinary configured successfully')

export interface CloudinaryUploadResult {
    public_id: string
    secure_url: string
    url: string
    format: string
    width: number
    height: number
    bytes: number
}

export class CloudinaryUtil {
    static async uploadImage(
        fileBuffer: Buffer,
        folder: string = 'alp_backend',
        publicId?: string
    ): Promise<CloudinaryUploadResult> {
        try {
            const uploadOptions = {
                folder,
                public_id: publicId,
                resource_type: 'image' as const,
                transformation: [
                    { width: 800, height: 600, crop: 'limit' }, // Resize max 800x600
                    { quality: 'auto' }, // Auto quality optimization
                ],
            }

            const result = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    uploadOptions,
                    (error, result) => {
                        if (error) {
                            console.error('Cloudinary upload error:', error)
                            reject(new Error(`Cloudinary upload failed: ${error.message}`))
                        } else if (result) {
                            resolve(result as CloudinaryUploadResult)
                        } else {
                            reject(new Error('Upload failed: No result returned'))
                        }
                    }
                ).end(fileBuffer)
            })

            return result
        } catch (error) {
            console.error('CloudinaryUtil.uploadImage error:', error)
            throw error
        }
    }

    static async deleteImage(publicId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.destroy(publicId, (error, result) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(result)
                }
            })
        })
    }

    static getPublicIdFromUrl(url: string): string | null {
        try {
            // Extract public_id from Cloudinary URL
            // URL format: https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{public_id}.{format}
            const urlParts = url.split('/')
            const uploadIndex = urlParts.findIndex(part => part === 'upload')

            if (uploadIndex !== -1 && uploadIndex + 2 < urlParts.length) {
                // Get the part after 'upload/v{version}/'
                const publicIdWithFormat = urlParts[uploadIndex + 2]
                // Remove file extension to get public_id
                return publicIdWithFormat.split('.')[0]
            }

            return null
        } catch (error) {
            console.error('Error extracting public_id from URL:', error)
            return null
        }
    }
}