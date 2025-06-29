import mongoose from "mongoose";
import { User } from "./userTypes";

const userSchema = new mongoose.Schema<User>(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      unique: true
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    bio: {
      type: String
    },
    profilePhoto: {
      type: String
    }
  },
  { timestamps: true }
);

//Generate username ONLY on first creation
userSchema.pre('save', async function (next) {
  if(this.isNew && !this.username) {
    let baseUsername = this.name
      .toLowerCase()
      .replace(/\s+/g, '')      // Remove all whitespace
      .replace(/[^a-z0-9]/g, '') // Keep only alphanumeric
      .trim();
    
    if (baseUsername.length < 3) {
      baseUsername = baseUsername + 'user';
    } else if (baseUsername.length > 15) {
      baseUsername = baseUsername.substring(0, 15);
    }
    
    const uniqueSuffix = this._id.toString().slice(-6);
    this.username = `${baseUsername}${uniqueSuffix}`;
  }
  next();
});

export default mongoose.model<User>("User", userSchema);