import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import userModel from "./userModel";
import { sign } from "jsonwebtoken";
import { config } from "../config/config";
import { User } from "./userTypes";
import { AuthRequest } from "../types/express";
import { formatUserResponse } from "./userUtils";

const updateUserDetail = async(req: Request, res: Response, next: NextFunction) => {
  const { name, username, bio} = req.body;
  const _req = req as AuthRequest;

  try{
    const updateFields: Partial<User> = {};

    const allowedFields = ['name', 'username', 'bio', 'profilePhoto'] as const;

    for( const field of allowedFields) {
      if(req.body[field] !== undefined) {
        updateFields[field] = req.body[field];
      }
    }

    if(Object.keys(updateFields).length === 0) {
      return res.status(400).json({ message: "No valid fields to update"});
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      _req.userId,
      updateFields,
      { new: true }
    ).select("-password");

    if(!updatedUser) {
      return next(createHttpError(404, "User not found"));
    }

    return res.status(200).json(formatUserResponse(updatedUser));

  } catch (error) {
    return next(createHttpError(500, "Error while updating user details"));
  }
}

const userDetail = async (req: Request, res: Response, next: NextFunction) => {
  const _req = req as AuthRequest;
  const userId = _req.userId;
  try {
    const user = await userModel.findById(userId,{password: 0}) as User;
    return res.status(200).json(formatUserResponse(user));
  } catch (error) {
    return next(createHttpError(500, "error while getting user detail"));
  }
}

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;

  // Validation
  if (!name || !email || !password) {
    const error = createHttpError(400, "All fields are required");
    return next(error);
  }

  // Database call.
  try {
    const user = await userModel.findOne({ email });
    if (user) {
      const error = createHttpError(
        400,
        "User already exists with this email."
      );
      return next(error);
    }
  } catch (err) {
    return next(createHttpError(500, "Error while getting user"));
  }

  /// password -> hash

  const hashedPassword = await bcrypt.hash(password, 10);

  let newUser: User;
  try {
    newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });
  } catch (err) {
    return next(createHttpError(500, "Error while creating user."));
  }

  try {
    // Token generation JWT
    const token = sign({ sub: newUser._id }, config.jwtSecret as string, {
      expiresIn: "7d",
      algorithm: "HS256",
    });
    // Response
    res.status(201).json({ accessToken: token });
  } catch (err) {
    return next(createHttpError(500, "Error while signing the jwt token"));
  }
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(createHttpError(400, "All fields are required"));
  }

  // todo: wrap in try catch.
  const user = await userModel.findOne({ email });
  if (!user) {
    return next(createHttpError(404, "User not found."));
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return next(createHttpError(400, "Username or password incorrect!"));
  }

  // todo: handle errors
  // Create accesstoken
  const token = sign({ sub: user._id }, config.jwtSecret as string, {
    expiresIn: "7d",
    algorithm: "HS256",
  });

  res.json({ accessToken: token });
};

export { createUser, loginUser, userDetail, updateUserDetail};