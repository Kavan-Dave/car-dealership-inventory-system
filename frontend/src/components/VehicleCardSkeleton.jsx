import React from "react";

/**
 * Skeleton loader component matching VehicleCard layout.
 * Used during inventory API fetch operations to offer premium interface responsiveness.
 */
const VehicleCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden flex flex-col justify-between h-[368px] shadow-sm animate-pulse">
      {/* Top Header Mock Image */}
      <div className="h-40 bg-slate-200 relative"></div>

      {/* Content Area */}
      <div className="p-5 flex-grow flex flex-col justify-between gap-4">
        {/* Price and Stock levels */}
        <div className="flex justify-between items-center">
          <div className="h-6 bg-slate-200 rounded w-24"></div>
          <div className="h-4 bg-slate-200 rounded w-16"></div>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-3 gap-2 border-y border-slate-100 py-3">
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-4 h-4 bg-slate-200 rounded-full"></div>
            <div className="h-3 bg-slate-200 rounded w-12"></div>
          </div>
          <div className="flex flex-col items-center gap-1.5 border-x border-slate-100">
            <div className="w-4 h-4 bg-slate-200 rounded-full"></div>
            <div className="h-3 bg-slate-200 rounded w-12"></div>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-4 h-4 bg-slate-200 rounded-full"></div>
            <div className="h-3 bg-slate-200 rounded w-12"></div>
          </div>
        </div>

        {/* Button Mock */}
        <div className="h-10 bg-slate-200 rounded-xl w-full"></div>
      </div>
    </div>
  );
};

export default VehicleCardSkeleton;
