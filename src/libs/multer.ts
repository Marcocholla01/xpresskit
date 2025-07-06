import { generateUUID } from '@/utils/uuid';
import type { Request } from 'express';
import fs from 'fs';
import multer, { type FileFilterCallback, type Options } from 'multer';
import path from 'path';

// Define folders
const BASE_UPLOAD_DIR = path.join(process.cwd(), 'uploads');

// Map MIME type prefixes to folders
const MIME_FOLDER_MAP: Record<string, string> = {
  image: 'images',
  video: 'videos',
  audio: 'audio',
  application: 'documents',
  text: 'documents',
};

// Create folder if it doesn't exist
const ensureDir = (dir: string) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

// Create base and subdirectories
const initUploadDirs = () => {
  ensureDir(BASE_UPLOAD_DIR);
  Object.values(MIME_FOLDER_MAP).forEach(sub => ensureDir(path.join(BASE_UPLOAD_DIR, sub)));
  ensureDir(path.join(BASE_UPLOAD_DIR, 'others'));
};
initUploadDirs();

// Get subfolder based on MIME type
const getUploadSubfolder = (mimetype: string) => {
  const typePrefix = mimetype.split('/')[0];
  return MIME_FOLDER_MAP[typePrefix!] || 'others';
};

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = getUploadSubfolder(file.mimetype);
    const uploadPath = path.join(BASE_UPLOAD_DIR, folder);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${generateUUID()}${ext}`;
    cb(null, name);
  },
});

// File filter utility
const fileFilter = (allowedTypes: string[]) => {
  return (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`❌ File type not allowed: ${file.mimetype}`));
    }
  };
};

// Export reusable upload middleware factory
export const createUploadMiddleware = ({
  allowedMimeTypes,
  maxSizeMB = 2,
}: {
  allowedMimeTypes?: string[];
  maxSizeMB?: number;
}) => {
  const options: Options = {
    storage,
    fileFilter: allowedMimeTypes ? fileFilter(allowedMimeTypes) : undefined,
    limits: {
      fileSize: maxSizeMB * 1024 * 1024,
    },
  };

  return multer(options);
};
