"use client";

import { SessionProvider } from "next-auth/react"; // Correctly import SessionProvider as a value
import { ReactNode } from "react"; // Import ReactNode for typing children

// Define a proper type for the children prop
interface AuthProviderProps {
  children: ReactNode; // ReactNode can be any valid JSX or React element
}

export default function AuthProvider({ children }: AuthProviderProps) {
  return <SessionProvider>{children}</SessionProvider>;
}
