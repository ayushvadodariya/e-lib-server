import { User } from "./userTypes";

export const formatUserResponse = (user: User) => {
  if (!user) return null;
  
  return {
    id: user._id,
    email: user.email,
    name: user.name,
    username: user.username,
    bio: user.bio,
    profilePhoto: user.profilePhoto,
    createdAt: user.createdAt
  };
};