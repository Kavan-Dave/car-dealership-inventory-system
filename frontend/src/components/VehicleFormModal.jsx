import React, { useState, useEffect } from "react";
import { X, Loader2, Save } from "lucide-react";

/**
 * Reusable Add/Edit Vehicle form modal.
 * Respects all backend validations (enums, number ranges, string requirements).
 */
const VehicleFormModal = ({ isOpen, onClose, onSubmit, vehicle = null }) => {
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: new Date().getFullYear(),
    price: "",
    mileage: "",
    color: "",
    fuelType: "Petrol",
    transmission: "Automatic",
    category: "",
    quantity: 1,
    status: "Available",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Sync state if modal mode changes or vehicle to edit changes
  useEffect(() => {
    if (vehicle) {
      setFormData({
        make: vehicle.make || "",
        model: vehicle.model || "",
        year: vehicle.year || new Date().getFullYear(),
        price: vehicle.price || "",
        mileage: vehicle.mileage || "",
        color: vehicle.color || "",
        fuelType: vehicle.fuelType || "Petrol",
        transmission: vehicle.transmission || "Automatic",
        category: vehicle.category || "",
        quantity: vehicle.quantity !== undefined ? vehicle.quantity : 1,
        status: vehicle.status || "Available",
      });
    } else {
      setFormData({
        make: "",
        model: "",
        year: new Date().getFullYear(),
        price: "",
        mileage: "",
        color: "",
        fuelType: "Petrol",
        transmission: "Automatic",
        category: "",
        quantity: 1,
        status: "Available",
      });
    }
    setErrors({});
  }, [vehicle, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "year" || name === "quantity"
        ? parseInt(value) || ""
        : name === "price" || name === "mileage"
        ? parseFloat(value) || ""
        : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const currentYear = new Date().getFullYear();

    if (!formData.make.trim()) newErrors.make = "Make is required";
    if (!formData.model.trim()) newErrors.model = "Model is required";
    
    if (!formData.year) {
      newErrors.year = "Year is required";
    } else if (formData.year < 1886 || formData.year > currentYear + 1) {
      newErrors.year = `Year must be between 1886 and ${currentYear + 1}`;
    }

    if (formData.price === "" || formData.price < 0) {
      newErrors.price = "Price must be 0 or greater";
    }
    if (formData.mileage === "" || formData.mileage < 0) {
      newErrors.mileage = "Mileage must be 0 or greater";
    }
    if (!formData.color.trim()) newErrors.color = "Color is required";
    if (!formData.category.trim()) newErrors.category = "Category is required";
    
    if (formData.quantity === "" || formData.quantity < 0) {
      newErrors.quantity = "Quantity must be 0 or greater";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      await onSubmit(formData);
      onClose();
    } catch (err) {
      console.error("Form modal submission error:", err);
      // Attempt to map backend validation error payload if present
      if (err.response?.data?.errors) {
        const backendErrors = {};
        err.response.data.errors.forEach((valErr) => {
          backendErrors[valErr.path || valErr.param] = valErr.msg;
        });
        setErrors(backendErrors);
      } else if (err.response?.data?.message) {
        setErrors({ general: err.response.data.message });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-100 shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-lg font-bold text-slate-900">
            {vehicle ? "Edit Vehicle Listing" : "Add New Vehicle"}
          </h3>
          <button
            onClick={onClose}
            disabled={submitting}
            className="text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-100 rounded-xl transition-all cursor-pointer disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body Scroll viewport */}
        <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-6 space-y-6" noValidate>
          {errors.general && (
            <div className="p-4 bg-rose-50 border border-rose-100 text-rose-700 rounded-xl text-xs font-semibold">
              {errors.general}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Make */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Make *</label>
              <input
                type="text"
                name="make"
                value={formData.make}
                onChange={handleChange}
                className={`block w-full px-3 py-2 border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all bg-slate-55/20 ${
                  errors.make ? "border-red-300 bg-red-50/20" : "border-slate-200"
                }`}
                placeholder="e.g. Ford"
              />
              {errors.make && <p className="mt-1 text-xs text-red-600 font-medium">{errors.make}</p>}
            </div>

            {/* Model */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Model *</label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                className={`block w-full px-3 py-2 border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all bg-slate-55/20 ${
                  errors.model ? "border-red-300 bg-red-50/20" : "border-slate-200"
                }`}
                placeholder="e.g. Mustang"
              />
              {errors.model && <p className="mt-1 text-xs text-red-600 font-medium">{errors.model}</p>}
            </div>

            {/* Year */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Year *</label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                className={`block w-full px-3 py-2 border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all bg-slate-55/20 ${
                  errors.year ? "border-red-300 bg-red-50/20" : "border-slate-200"
                }`}
              />
              {errors.year && <p className="mt-1 text-xs text-red-600 font-medium">{errors.year}</p>}
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Category *</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`block w-full px-3 py-2 border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all bg-slate-55/20 ${
                  errors.category ? "border-red-300 bg-red-50/20" : "border-slate-200"
                }`}
                placeholder="e.g. Coupe, SUV"
              />
              {errors.category && <p className="mt-1 text-xs text-red-600 font-medium">{errors.category}</p>}
            </div>

            {/* Price */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Price ($) *</label>
              <input
                type="number"
                name="price"
                min="0"
                value={formData.price}
                onChange={handleChange}
                className={`block w-full px-3 py-2 border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all bg-slate-55/20 ${
                  errors.price ? "border-red-300 bg-red-50/20" : "border-slate-200"
                }`}
                placeholder="45000"
              />
              {errors.price && <p className="mt-1 text-xs text-red-600 font-medium">{errors.price}</p>}
            </div>

            {/* Mileage */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Mileage (Miles) *</label>
              <input
                type="number"
                name="mileage"
                min="0"
                value={formData.mileage}
                onChange={handleChange}
                className={`block w-full px-3 py-2 border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all bg-slate-55/20 ${
                  errors.mileage ? "border-red-300 bg-red-50/20" : "border-slate-200"
                }`}
                placeholder="12000"
              />
              {errors.mileage && <p className="mt-1 text-xs text-red-600 font-medium">{errors.mileage}</p>}
            </div>

            {/* Color */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Color *</label>
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleChange}
                className={`block w-full px-3 py-2 border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all bg-slate-55/20 ${
                  errors.color ? "border-red-300 bg-red-50/20" : "border-slate-200"
                }`}
                placeholder="Red, Blue, black"
              />
              {errors.color && <p className="mt-1 text-xs text-red-600 font-medium">{errors.color}</p>}
            </div>

            {/* Fuel Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Fuel Type *</label>
              <select
                name="fuelType"
                value={formData.fuelType}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
              >
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Electric">Electric</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            {/* Transmission */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Transmission *</label>
              <select
                name="transmission"
                value={formData.transmission}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
              >
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
              </select>
            </div>

            {/* Initial Stock Level */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Quantity *</label>
              <input
                type="number"
                name="quantity"
                min="0"
                value={formData.quantity}
                onChange={handleChange}
                className={`block w-full px-3 py-2 border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all bg-slate-55/20 ${
                  errors.quantity ? "border-red-300 bg-red-50/20" : "border-slate-200"
                }`}
              />
              {errors.quantity && <p className="mt-1 text-xs text-red-600 font-medium">{errors.quantity}</p>}
            </div>

            {/* Status selection (only shown/editable in Edit mode or optionally available) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
              >
                <option value="Available">Available</option>
                <option value="Reserved">Reserved</option>
                <option value="Sold">Sold</option>
              </select>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t border-slate-100 bg-slate-50/20 -mx-6 -mb-6 p-6">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 border border-slate-200 text-xs font-semibold rounded-xl text-slate-700 bg-white hover:bg-slate-50 transition-all cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-1.5 px-5 py-2 border border-transparent text-xs font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-sm cursor-pointer disabled:opacity-50"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{vehicle ? "Save Changes" : "Create Listing"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VehicleFormModal;
