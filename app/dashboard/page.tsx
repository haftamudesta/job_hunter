import { getSession } from "@/lib/auth/auth";
import connectDB from "@/lib/dbConnection";
import { redirect } from "next/navigation";
import React from "react";

export default async function page() {
  const session = await getSession();
  if (!session?.user) {
    redirect("/sign-in");
  }
  await connectDB();
  return <div>page</div>;
}
