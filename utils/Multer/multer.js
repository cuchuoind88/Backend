import multer from "multer";
import path from "path";
const __dirname = path.resolve();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "./video"));
  },
  filename: function (req, file, cb) {
    console.log(file.originalname);
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });
export default upload;
