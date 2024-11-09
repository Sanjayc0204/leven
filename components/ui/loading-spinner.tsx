import { Icons } from "./icon";

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Icons.spinner className="h-16 w-16 animate-spin" />
    </div>
  );
}
