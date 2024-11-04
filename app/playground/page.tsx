import { Button } from "@/components/ui/button";
import CommunitySidebar from "@/components/ui/communities-sidebar";
import DailyQuests from "@/components/ui/daily-quests";
import LeetcodeRubric from "@/components/ui/leetcode-components/leetcode-rubric";
import NavBar from "@/components/ui/navbar";

export default function PlaygroundPage() {
  // return (
  //   // <>
  //   //   <LeetcodeRubric />
  //   // </>
  // );
  return (
    <div className="relative h-screen w-screen">
      {/* Move the NavBar outside of the blur stacking context */}
      <div className="fixed top-0 left-0 w-full z-30">
        <NavBar />
      </div>

      {/* Background Blur */}
      <div className="absolute inset-0 backdrop-blur-sm bg-white/30 z-10"></div>
      <NavBar></NavBar>
      {/* The actual page content (behind the blur) */}
      <div className="relative z-0">
        {/* Content that will be blurred */}
        <div className="p-8">
          <h1 className="text-6xl font-bold">Welcome to the Community</h1>
          <p className="mt-4 text-xl">Content behind the blur</p>
        </div>
      </div>

      {/* Login Button centered on top of the blur */}
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <Button className="text-lg font-bold px-6 py-3">Log In</Button>
      </div>
    </div>
  );
}
