import React, { useState } from "react";
import { ShoppingCart, X, Loader2 } from "lucide-react";

/**
 * Premium confirmation dialog for inventory purchases.
 * Prevents accidental actions and displays transaction costs.
 */
const PurchaseConfirmModal = ({ isOpen, vehicle, onClose, onConfirm }) => {
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !vehicle) return null;

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(vehicle.price);

  const handleConfirm = async () => {
    try {
      setSubmitting(true);
      await onConfirm(vehicle._id);
      onClose();
    } catch (err) {
      console.error("Confirmation purchase failure:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full border border-slate-100 shadow-2xl overflow-hidden relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={submitting}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-50 rounded-xl transition-all cursor-pointer disabled:opacity-50"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header & Content */}
        <div className="p-6 md:p-8 space-y-6">
          <div className="flex flex-col items-center text-center">
            {/* Header Icon */}
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-sm shadow-blue-100">
              <ShoppingCart className="w-6 h-6" />
            </div>
            
            <h3 className="text-xl font-bold text-slate-900">Confirm Order</h3>
            <p className="text-slate-500 text-sm mt-1.5">
              You are about to register a purchase order for the following vehicle:
            </p>
          </div>

          {/* Vehicle Detail Summary Box */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100/50 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-slate-800">Vehicle</span>
              <span className="text-slate-600">{vehicle.year} {vehicle.make} {vehicle.model}</span>
            </div>
            <div className="flex justify-between items-center text-sm border-t border-slate-200/40 pt-2">
              <span className="font-semibold text-slate-800">Category</span>
              <span className="text-slate-500">{vehicle.category}</span>
            </div>
            <div className="flex justify-between items-center text-sm border-t border-slate-200/40 pt-2">
              <span className="font-semibold text-slate-800">Total Price</span>
              <span className="font-extrabold text-blue-600 text-base">{formattedPrice}</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 text-center">
            Completing this action will deduct exactly 1 unit from the dealership's active stock.
          </p>

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={submitting}
              className="flex-1 py-2.5 px-4 border border-slate-200 text-xs font-bold rounded-xl text-slate-700 bg-white hover:bg-slate-50 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-all shadow-sm cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={submitting}
              className="flex-1 flex justify-center items-center gap-1.5 py-2.5 px-4 border border-transparent text-xs font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all shadow-sm shadow-blue-100 cursor-pointer disabled:opacity-50"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  <span>Confirm Purchase</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseConfirmModal;
