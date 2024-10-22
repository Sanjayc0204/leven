import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Input } from "@/components/ui/input";

export default function SearchBar() {
  return (
    <div className="w-[300px]">
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Input
          type="text"
          placeholder="Search For Communities"
          className="w-full pl-10 pr-4 py-2 text-sm text-slate-900 bg-white border border-slate-900 rounded-md focus:outline-none"
        />
      </div>
    </div>
  );
}
