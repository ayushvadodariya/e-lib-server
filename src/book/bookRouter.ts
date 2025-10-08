import express from "express";
import {
  createBook,
  deleteBook,
  getSingleBook,
  listBooks,
  updateBook,
  fixDescriptionGrammar,
} from "./bookController";
import authenticate from "../middlewares/authenticate";
import { upload } from "../config/multer";

const bookRouter = express.Router();

// /api/books
bookRouter.post(
  "/",
  authenticate,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  createBook
);

bookRouter.patch(
  "/:bookId",
  authenticate,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  updateBook
);

bookRouter.get("/",authenticate, listBooks);
bookRouter.get("/:bookId", getSingleBook);

bookRouter.delete("/:bookId", authenticate, deleteBook);

// NLP Cloud text improvement endpoints
bookRouter.post("/fix-grammar", authenticate, fixDescriptionGrammar);

export default bookRouter;
