import type { User } from "@clerk/nextjs/dist/types/server";

export const filterUserForClient = (user: User) => {
  const name = user.username || user.firstName || "chirper";
  return {
    id: user.id,
    username: name.toLowerCase(),
    profileImageUrl: user.profileImageUrl,
  };
};
