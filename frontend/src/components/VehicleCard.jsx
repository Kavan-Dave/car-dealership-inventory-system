import React from "react";
import { Gauge, Fuel, Settings, ShoppingCart } from "lucide-react";

/**
 * Premium Vehicle Card component.
 * Displays structural vehicle parameters, status indicators, and handles purchase actions.
 */
const VehicleCard = ({ vehicle, onPurchase, isAdminView = false }) => {
  const {
    make,
    model,
    year,
    price,
    mileage,
    color,
    fuelType,
    transmission,
    status,
    category,
    quantity,
  } = vehicle;

  // Format currency value professionally
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);

  // Format mileage value
  const formattedMileage = new Intl.NumberFormat("en-US").format(mileage);

  // Determine status color codes
  const isOutOfStock = quantity === 0 || status === "Sold";

  const statusStyles = {
    Available: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Reserved: "bg-amber-50 text-amber-700 border-amber-200",
    Sold: "bg-rose-50 text-rose-700 border-rose-200",
  };

  const currentStatus = isOutOfStock ? "Sold" : status;
  const badgeStyle = statusStyles[currentStatus] || "bg-slate-50 text-slate-700 border-slate-200";

  // Category specific gradients for card image headers
  const gradientStyles = {
    sedan: "from-blue-500 to-indigo-600",
    suv: "from-cyan-500 to-blue-600",
    coupe: "from-purple-500 to-indigo-600",
    truck: "from-slate-600 to-slate-800",
    hatchback: "from-teal-500 to-emerald-600",
    convertible: "from-pink-500 to-rose-600",
  };

  const categoryLower = category ? category.toLowerCase() : "";
  const headerGradient = gradientStyles[categoryLower] || "from-blue-600 to-cyan-500";

  // The parent (DashboardPage) owns the modal and loading state.
  // onPurchase fires with no args; the vehicle is already closed over in the parent callback.
  const handlePurchaseClick = () => {
    if (isOutOfStock) return;
    onPurchase();
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 group">
      
      {/* Category banner / Image Placeholder */}
      <div className={`h-40 bg-gradient-to-br ${headerGradient} relative flex items-center justify-center p-6 text-white`}>
        {/* Dynamic backdrop grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:16px_16px]"></div>
        
        {/* Badges container */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-center z-10">
          <span className="bg-white/15 backdrop-blur-md text-white text-[10px] tracking-wide font-extrabold uppercase px-2.5 py-1 rounded-full border border-white/10">
            {category || "Vehicle"}
          </span>
          <span className={`text-[10px] tracking-wide font-extrabold uppercase px-2.5 py-1 rounded-full border ${badgeStyle}`}>
            {currentStatus}
          </span>
        </div>

        {/* Decorative central silhouette */}
        <div className="text-center relative z-10 transition-transform duration-300 group-hover:scale-105">
          <h3 className="text-2xl font-black tracking-wide drop-shadow-md">
            {make}
          </h3>
          <p className="text-xs text-white/80 font-medium tracking-wider uppercase mt-0.5">
            {model}
          </p>
        </div>

        {/* Bottom bar overlay showing model year */}
        <div className="absolute bottom-3 left-3 bg-black/20 backdrop-blur-sm text-[10px] text-white/90 font-bold px-2 py-0.5 rounded">
          {year}
        </div>

        {/* Bottom bar overlay showing color */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/20 backdrop-blur-sm text-[10px] text-white/90 font-bold px-2 py-0.5 rounded">
          <span className="w-2 h-2 rounded-full border border-white/20" style={{ backgroundColor: color }}></span>
          <span>{color}</span>
        </div>
      </div>

      {/* Attributes content */}
      <div className="p-5 flex-grow flex flex-col justify-between gap-4">
        {/* Price and Stock levels */}
        <div className="flex justify-between items-baseline">
          <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {formattedPrice}
          </span>
          <span className="text-xs font-semibold text-slate-500">
            {quantity > 0 ? (
              <span className="text-slate-600">Stock: <strong className="text-slate-900 font-bold">{quantity}</strong></span>
            ) : (
              <span className="text-rose-600 font-bold">Out of stock</span>
            )}
          </span>
        </div>

        {/* Technical specs grid */}
        <div className="grid grid-cols-3 gap-2 border-y border-slate-50 py-3 text-[11px] text-slate-500 font-medium">
          <div className="flex flex-col items-center gap-1 text-center">
            <Gauge className="w-4 h-4 text-slate-400" />
            <span className="truncate w-full">{formattedMileage} mi</span>
          </div>
          <div className="flex flex-col items-center gap-1 text-center border-x border-slate-50">
            <Fuel className="w-4 h-4 text-slate-400" />
            <span className="truncate w-full">{fuelType}</span>
          </div>
          <div className="flex flex-col items-center gap-1 text-center">
            <Settings className="w-4 h-4 text-slate-400" />
            <span className="truncate w-full">{transmission}</span>
          </div>
        </div>

        {/* Action Button */}
        {!isAdminView && (
          <button
            onClick={handlePurchaseClick}
            disabled={isOutOfStock}
            className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent text-xs font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-100 disabled:text-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all shadow-sm shadow-blue-50 disabled:shadow-none cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>{isOutOfStock ? "Sold Out" : "Purchase"}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default VehicleCard;
