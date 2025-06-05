import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure the directory exists
const uploadPath = "uploads/resumes";
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}-${file.fieldname}${ext}`);
    }
});

export const singleUpload = multer({ storage }).single("resume");
