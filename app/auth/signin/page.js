"use client"; // Add this at the top to ensure the component is treated as a Client Component

import { useSession, signIn, signOut } from "next-auth/react";

export default function HomePage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (session) {
    return (
      <div>
        <p>Welcome, {session.user.name}</p>
        <p>{session.user.email}</p>
        <button onClick={() => signOut()}>Sign out</button>
      </div>
    );
  }

  return (
    <div>
      <p>You are not signed in.</p>
      <button onClick={() => signIn("google")}>Sign in with Google</button>
    </div>
  );
}
