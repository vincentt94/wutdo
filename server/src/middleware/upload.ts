import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        resource_type: "image", // Ensure it's an image
        public_id: (_req: Request, file: Express.Multer.File) => `${Date.now()}-${file.originalname}`, // Unique filename
        allowedFormats: ["jpg", "png", "jpeg"],
    } as any,
});

const upload = multer({ storage });

export default upload;