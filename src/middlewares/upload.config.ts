// middleware/upload.config.ts
import { createUploadMiddleware } from '@/libs/multer';

// For profile images (2MB max)
export const uploadProfileImage = createUploadMiddleware({
  allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/jpg', 'image/gif'],
  maxSizeMB: 2,
});

// For videos (200MB max)
export const uploadVideos = createUploadMiddleware({
  allowedMimeTypes: ['video/mp4', 'video/mkv', 'video/mpeg', 'video/webm'],
  maxSizeMB: 200,
});

// For documents (PDF, DOCX) (1MB max)
export const uploadDocuments = createUploadMiddleware({
  allowedMimeTypes: [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
  maxSizeMB: 1,
});

// For CSV (0.5MB max)
export const uploadCSV = createUploadMiddleware({
  allowedMimeTypes: ['text/csv', 'application/vnd.ms-excel'],
  maxSizeMB: 0.5,
});

// // routes/user.routes.ts
// import { Router } from 'express';

// const router = Router();

// router.patch('/me/profile-photo', uploadProfileImage.single('avatar'), (req, res) => {
//   // Handle storing req.file.path to DB, etc.
//   res.json({ success: true, file: req.file });
// });

// // routes/video.routes.ts
// router.post('/upload', uploadVideos.single('video'), (req, res) => {
//   res.json({ success: true, file: req.file });
// });

// export default router;
