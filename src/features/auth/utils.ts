import { redirect } from "next/navigation";

import { auth } from "@/auth";

export const protectServer = async () => {
  // Commenting out the session check for testing purposes
  // const session = await auth();

  // if (!session) {
  //   redirect("/api/auth/signin");
  // }
};
