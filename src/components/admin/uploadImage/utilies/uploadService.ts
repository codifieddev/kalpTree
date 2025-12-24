import { convertImageFileToWebp } from './ConvertImageToWebp';
import { DirectS3UploadService, UploadProgress, UploadResult } from './DirectS3UploadService';

export interface FileValidation {
  valid: boolean;
  error?: string;
}

export interface ProcessedFile {
  file: File;
  preview: string;
}

export class UploadService {
  /**
   * Validate and process an image file
   * @param file - The file to process
   * @param maxSize - Maximum file size in bytes
   * @param allowedTypes - Array of allowed MIME types
   * @returns Processed file with preview URL
   */
  static async processImageFile(
    file: File,
    maxSize: number = 10 * 1024 * 1024,
    allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  ): Promise<ProcessedFile> {
    // Validate file
    const validation = DirectS3UploadService.validateFile(file, maxSize, allowedTypes);
    if (!validation.valid) {
      throw new Error(validation.error || 'Invalid file');
    }

    // Convert to WebP
    let webpFile: File;
    try {
      webpFile = await convertImageFileToWebp(file);
    } catch (err) {
      throw new Error('Failed to convert image to WebP.');
    }

    // Create preview URL
    const preview = URL.createObjectURL(webpFile);

    return {
      file: webpFile,
      preview,
    };
  }

  /**
   * Upload a file directly to S3
   * @param file - The file to upload (can be null)
   * @param userId - User ID (optional)
   * @param onProgress - Progress callback
   * @param projectId - Project ID (optional) for organizing files
   * @returns Upload result
   */
  static async uploadToS3(
    file: File | null,
    userId?: string,
    onProgress?: (progress: UploadProgress) => void,
    projectId?: string
  ): Promise<UploadResult> {
    if (!file) {
      return {
        success: false,
        error: 'No file selected',
      };
    }

    // Check if AWS credentials are configured
    if (!DirectS3UploadService.isConfigured()) {
      return {
        success: false,
        error: 'AWS credentials not configured. Please set your environment variables.',
      };
    }

    try {
      // Use direct S3 upload service
      const result = await DirectS3UploadService.uploadFile(
        file,
        userId,
        onProgress,
        projectId
      );

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Clean up object URL
   * @param url - The object URL to revoke
   */
  static cleanupPreview(url?: string): void {
    if (url) {
      URL.revokeObjectURL(url);
    }
  }

  /**
   * Format file size in human-readable format
   * @param bytes - File size in bytes
   * @returns Formatted string (e.g., "2.5 MB")
   */
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Check if the upload service is properly configured
   * @returns true if AWS credentials are configured
   */
  static isConfigured(): boolean {
    return DirectS3UploadService.isConfigured();
  }
}
