import express from "express";
import {
  login,
  logout,
  register,
  updateProfile
} from "../controllers/user.controller.js";
import multer from "multer";
import { singleUpload } from "../middlewares/mutler.js";
const upload = multer({ dest: 'uploads/profile/' });
const router = express.Router();

router.route('/register').post(upload.single('file'), register);
router.route("/login").post(login);
router.route("/logout").get(logout);

router.route("/profile/update").post(singleUpload, updateProfile);

export default router;
