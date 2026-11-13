import express from "express";
import multer from "multer";
import {register,login} from "../controllers/auth.controller.js"

const router=express.Router()
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, callback) => {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.mimetype)) {
      const error = new Error("photo must be a JPEG, PNG or WebP image");
      error.status = 400;
      return callback(error);
    }
    callback(null, true);
  },
});

router.post("/register", upload.single("photo"), register)
router.post("/login",login)

export default router;  