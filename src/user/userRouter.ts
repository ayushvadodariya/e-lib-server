import express from "express";
import { createUser, loginUser, updateUserDetail, userDetail} from "./userController";
import authenticate from "../middlewares/authenticate";

const userRouter = express.Router();

// routes
userRouter.post("/register", createUser);
userRouter.post("/login", loginUser);
userRouter.get("/", authenticate, userDetail);
userRouter.patch("/", authenticate, updateUserDetail);

export default userRouter;
