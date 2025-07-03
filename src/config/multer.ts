import { NextFunction, Request, Response } from "express";
import { mkdirSync } from "fs";
import multer from "multer"
import path from "path";

export const UPLOAD_BASE = path.resolve(__dirname, "../../public");
export const UPLOAD_DIR = path.join(UPLOAD_BASE, "data/uploads");
export const BOOKS_DIR = path.join(UPLOAD_BASE, "books");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = UPLOAD_DIR;

    if(file.fieldname === "coverImage" || file.fieldname === "file") {
      uploadPath = BOOKS_DIR;
    }
    
    mkdirSync(uploadPath, { recursive: true});
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random());
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const multerUpload = multer({
  storage,
  limits: {
    fileSize: 30 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    if(file.fieldname === "coverImage"){
      const allowedMimes = ["image/jpeg", "image/jpg", "image/png"];
      if(allowedMimes.includes(file.mimetype)){
        cb(null, true);
      } else{
        cb(new Error("Only image files are allowed for cover images"));
      }
    } else if ( file.fieldname === "file"){
      const allowedMimes = ["application/pdf", "application/epub+zip" ];
      if(allowedMimes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error("Only PDF and EPUB files are allowed for books"));
      }
    } else {
      cb(null, true);
    }
  }
});

export const upload = {
  fields: (fields: multer.Field[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
      multerUpload.fields(fields)(req, res, (err) => {
        if(err) {
          return res.status(400).json({
            error:true,
            message: err.message || "File upload error"
          });
        }
        next();
      });
    };
  }
}