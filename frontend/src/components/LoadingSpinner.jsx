import React from "react";
import { Loader2 } from "lucide-react";

/**
 * Premium loading spinner component.
 * Displays a centered, animated loader with subtle backdrop blur.
 */
const LoadingSpinner = ({ fullPage = true }) => {
  const content = (
    <div className="flex flex-col items-center justify-center gap-3 p-6 text-center animate-fade-in">
      <div className="relative">
        {/* Outer glowing ring */}
        <div className="absolute inset-0 rounded-full bg-blue-500/10 blur-md animate-pulse"></div>
        {/* Spinner */}
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin relative z-10" />
      </div>
      <p className="text-slate-500 text-sm font-medium tracking-wide">Loading resources...</p>
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-slate-50/80 backdrop-blur-sm z-50 flex items-center justify-center min-h-screen">
        {content}
      </div>
    );
  }

  return <div className="w-full flex items-center justify-center py-12">{content}</div>;
};

export default LoadingSpinner;
