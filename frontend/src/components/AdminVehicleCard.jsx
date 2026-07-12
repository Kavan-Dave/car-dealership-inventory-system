import React, { useState } from "react";
import { Gauge, Fuel, Settings, Pencil, Trash2, PackagePlus, Loader2 } from "lucide-react";

/**
 * Admin variant of the vehicle card.
 * Exposes management actions: Edit, Reserve/Unreserve, Restock, and Delete.
 */
const AdminVehicleCard = ({ vehicle, onEdit, onDelete, onRestock }) => {
  const [restocking, setRestocking] = useState(false);

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

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);

  const formattedMileage = new Intl.NumberFormat("en-US").format(mileage);

  const isOutOfStock = quantity === 0 || status === "Sold";
  const currentStatus = isOutOfStock ? "Sold" : status;

  const statusStyles = {
    Available: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Sold: "bg-rose-50 text-rose-700 border-rose-200",
  };
  const badgeStyle = statusStyles[currentStatus] || "bg-slate-50 text-slate-700 border-slate-200";

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

  const handleRestock = async () => {
    try {
      setRestocking(true);
      await onRestock(vehicle._id);
    } catch (err) {
      console.error("Restock failed:", err);
    } finally {
      setRestocking(false);
    }
  };


  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 group">
      {/* Card Banner */}
      <div className={`h-32 bg-gradient-to-br ${headerGradient} relative flex items-center justify-center p-6 text-white`}>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:16px_16px]"></div>

        <div className="absolute top-3 left-3 right-3 flex justify-between items-center z-10">
          <span className="bg-white/15 backdrop-blur-md text-white text-[10px] tracking-wide font-extrabold uppercase px-2.5 py-1 rounded-full border border-white/10">
            {category || "Vehicle"}
          </span>
          <span className={`text-[10px] tracking-wide font-extrabold uppercase px-2.5 py-1 rounded-full border ${badgeStyle}`}>
            {currentStatus}
          </span>
        </div>

        <div className="text-center relative z-10">
          <h3 className="text-xl font-black tracking-wide drop-shadow-md">{make}</h3>
          <p className="text-xs text-white/80 font-medium tracking-wider uppercase mt-0.5">{model}</p>
        </div>

        <div className="absolute bottom-3 left-3 bg-black/20 backdrop-blur-sm text-[10px] text-white/90 font-bold px-2 py-0.5 rounded">
          {year}
        </div>
        <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/20 backdrop-blur-sm text-[10px] text-white/90 font-bold px-2 py-0.5 rounded">
          <span className="w-2 h-2 rounded-full border border-white/20" style={{ backgroundColor: color }}></span>
          {color}
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex-grow flex flex-col gap-3 justify-between">
        <div>
          {/* Price and Stock */}
          <div className="flex justify-between items-baseline mb-2">
            <span className="text-xl font-extrabold text-slate-900 tracking-tight">{formattedPrice}</span>
            <span className={`text-xs font-bold ${quantity > 0 ? "text-slate-600" : "text-rose-600"}`}>
              Stock: {quantity}
            </span>
          </div>

          {/* Specs */}
          <div className="grid grid-cols-3 gap-2 border-y border-slate-50 py-3 text-[10px] text-slate-500 font-medium">
            <div className="flex flex-col items-center gap-1 text-center">
              <Gauge className="w-3.5 h-3.5 text-slate-400" />
              <span>{formattedMileage} mi</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-center border-x border-slate-50">
              <Fuel className="w-3.5 h-3.5 text-slate-400" />
              <span>{fuelType}</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-center">
              <Settings className="w-3.5 h-3.5 text-slate-400" />
              <span>{transmission}</span>
            </div>
          </div>
        </div>

        {/* Admin Action Buttons — 3 equal buttons in one row */}
        <div className="flex gap-2 mt-3 pt-1">
          {/* Edit Button */}
          <button
            onClick={() => onEdit(vehicle)}
            className="flex-1 flex justify-center items-center gap-1.5 py-2 px-2 border border-slate-200 text-xs font-bold rounded-xl text-slate-700 bg-white hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-all cursor-pointer"
          >
            <Pencil className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>

          {/* Restock Button */}
          <button
            onClick={handleRestock}
            disabled={restocking}
            className="flex-1 flex justify-center items-center gap-1.5 py-2 px-2 border border-slate-200 text-xs font-bold rounded-xl text-slate-700 bg-white hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition-all cursor-pointer disabled:opacity-50"
          >
            {restocking ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <>
                <PackagePlus className="w-3.5 h-3.5" />
                <span>Restock</span>
              </>
            )}
          </button>

          {/* Delete Button */}
          <button
            onClick={() => onDelete(vehicle)}
            className="flex-1 flex justify-center items-center gap-1.5 py-2 px-2 border border-slate-200 text-xs font-bold rounded-xl text-slate-700 bg-white hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 transition-all cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminVehicleCard;
