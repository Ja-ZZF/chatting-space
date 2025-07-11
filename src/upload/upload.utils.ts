import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

export const momentImageStorage = {
  storage: diskStorage({
    destination: 'public/uploads/moments', // ✅ 静态目录内
    filename: (req, file, callback) => {
      const ext = extname(file.originalname);
      const filename = `${uuidv4()}${ext}`;
      callback(null, filename);
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
};
