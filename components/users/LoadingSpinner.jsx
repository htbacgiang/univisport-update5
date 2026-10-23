import React from "react";

export default function FullScreenLoadingSpinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center  z-50">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-500"></div>
    </div>
  );
}