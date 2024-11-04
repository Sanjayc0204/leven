import { useSidebar } from "@/components/ui/sidebar";
import { PanelLeftIcon } from "lucide-react";

export function CustomTrigger() {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      onClick={toggleSidebar}
      className="" // Maintain the button padding (adjust this as needed)
    >
      {/* Use smaller size for the icon */}
      <PanelLeftIcon className="w-4 h-4" />{" "}
      {/* 16px icon, but button size remains unchanged */}
    </button>
  );
}
