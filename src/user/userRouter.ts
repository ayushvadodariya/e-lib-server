import express from "express";
import { createUser, loginUser, updateUserDetail, userDetail} from "./userController";
import authenticate from "../middlewares/authenticate";
import { upload } from "../config/multer";

const userRouter = express.Router();

// routes
userRouter.post("/register", createUser);
userRouter.post("/login", loginUser);
userRouter.get("/", authenticate, userDetail);
userRouter.patch("/",
  authenticate,
  upload.fields([{name: "profilePicture", maxCount:1}]),
  updateUserDetail
);

export default userRouter;
