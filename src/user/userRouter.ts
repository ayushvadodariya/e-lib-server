import express from "express";
import { createUser, loginUser, userDetail} from "./userController";
import authenticate from "../middlewares/authenticate";

const userRouter = express.Router();

// routes
userRouter.post("/register", createUser);
userRouter.post("/login", loginUser);
userRouter.get("/", authenticate, userDetail);

export default userRouter;
