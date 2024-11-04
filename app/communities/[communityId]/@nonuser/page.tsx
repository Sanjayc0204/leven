"use client";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";

export default function CommunityPage() {
  return (
    <motion.div>
      <div className="flex justify-center items-center h-screen w-screen">
        <div className="flex flex-col items-center justify-center space-y-2">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.3 }}
          >
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-3xl p-0 text-center">
              Your most productive self awaits you.
            </h1>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.3, delay: 1.5 }}
          >
            <h2 className="text-center text-base scroll-m-20 p-0">
              Log in to embark on a journey of a{" "}
              <span className="inline italic font-bold">lifetime</span> (and see
              the community ofc)
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2.0, delay: 3.0 }}
          >
            <Button
              className="group inline-flex h-9 w-max items-center text-white justify-center rounded-md bg-black px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-800 hover:text-gray-100 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50"
              onClick={() => signIn("google")}
            >
              Log In
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
