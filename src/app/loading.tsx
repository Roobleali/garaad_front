import { Loader } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center space-y-4">
        <Loader className="h-12 w-12 text-primary animate-spin" />
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    </div>
  );
}
