import React, { useState } from "react";
import { Trash2, X, Loader2, AlertTriangle } from "lucide-react";

/**
 * Confirmation modal before permanently deleting a vehicle listing.
 * Prevents accidental destructive actions.
 */
const DeleteConfirmModal = ({ isOpen, vehicle, onClose, onConfirm }) => {
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !vehicle) return null;

  const handleConfirm = async () => {
    try {
      setSubmitting(true);
      await onConfirm(vehicle._id);
      onClose();
    } catch (err) {
      console.error("Delete confirmation error:", err);
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

        <div className="p-6 md:p-8 space-y-6">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center mb-4 shadow-sm shadow-rose-100">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Delete Vehicle?</h3>
            <p className="text-slate-500 text-sm mt-1.5">
              This action is permanent and cannot be reversed.
            </p>
          </div>

          {/* Vehicle Summary */}
          <div className="bg-rose-50/40 rounded-xl p-4 border border-rose-100/50 text-sm text-center">
            <p className="font-bold text-slate-900">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </p>
            <p className="text-slate-500 text-xs mt-0.5">{vehicle.category}</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={submitting}
              className="flex-1 py-2.5 px-4 border border-slate-200 text-xs font-bold rounded-xl text-slate-700 bg-white hover:bg-slate-50 transition-all cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={submitting}
              className="flex-1 flex justify-center items-center gap-1.5 py-2.5 px-4 border border-transparent text-xs font-bold rounded-xl text-white bg-rose-600 hover:bg-rose-700 transition-all shadow-sm cursor-pointer disabled:opacity-50"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Listing</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
