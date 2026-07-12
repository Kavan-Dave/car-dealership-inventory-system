import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

/**
 * EmptyState feedback component.
 * Displays clean messages when database queries return no results.
 */
const EmptyState = ({
  title = "No vehicles found",
  description = "We couldn't find any vehicles matching your criteria.",
  onReset,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center max-w-md mx-auto my-6 bg-white rounded-2xl border border-slate-100 shadow-sm animate-fade-in">
      <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center mb-4">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-bold text-slate-900">{title}</h3>
      <p className="text-sm text-slate-500 mt-2 mb-6">{description}</p>
      
      {onReset && (
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 text-xs font-semibold rounded-xl text-slate-700 bg-white hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Clear Filters</span>
        </button>
      )}
    </div>
  );
};

export default EmptyState;
