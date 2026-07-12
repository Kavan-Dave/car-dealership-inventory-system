import React, { useState, useEffect } from "react";
import vehicleService from "../services/vehicleService";
import AdminVehicleCard from "../components/AdminVehicleCard";
import VehicleCardSkeleton from "../components/VehicleCardSkeleton";
import VehicleFormModal from "../components/VehicleFormModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import EmptyState from "../components/EmptyState";
import toast from "react-hot-toast";
import { Shield, PlusCircle, RefreshCw } from "lucide-react";

/**
 * Admin Control Panel.
 * Full CRUD interface for dealership vehicle inventory management.
 */
const AdminDashboardPage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);

  // Delete modal state
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingVehicle, setDeletingVehicle] = useState(null);

  const fetchInventory = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const data = await vehicleService.getAll();
      setVehicles(data.vehicles || []);
    } catch (error) {
      console.error("Error loading admin inventory:", error);
      toast.error(error.response?.data?.message || "Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  // Open the Add form (empty vehicle = create mode)
  const handleAdd = () => {
    setEditingVehicle(null);
    setIsFormOpen(true);
  };

  // Open the Edit form with the selected vehicle pre-populated
  const handleEdit = (vehicle) => {
    setEditingVehicle(vehicle);
    setIsFormOpen(true);
  };

  // Open the Delete confirmation modal
  const handleDeleteTrigger = (vehicle) => {
    setDeletingVehicle(vehicle);
    setIsDeleteOpen(true);
  };

  /**
   * Create or update vehicle based on editing mode.
   */
  const handleFormSubmit = async (formData) => {
    try {
      if (editingVehicle) {
        const response = await vehicleService.update(editingVehicle._id, formData);
        toast.success(response.message || "Vehicle updated successfully!");
      } else {
        const response = await vehicleService.create(formData);
        toast.success(response.message || "Vehicle added successfully!");
      }
      fetchInventory(true);
    } catch (err) {
      const errMsg = err.response?.data?.message || "Operation failed.";
      toast.error(errMsg);
      throw err; // Re-throw so form modal can display inline error state
    }
  };

  /**
   * Delete the vehicle from inventory.
   */
  const handleDeleteConfirm = async (id) => {
    try {
      const response = await vehicleService.delete(id);
      toast.success(response.message || "Vehicle deleted successfully!");
      setVehicles((prev) => prev.filter((v) => v._id !== id));
    } catch (err) {
      const errMsg = err.response?.data?.message || "Delete failed.";
      toast.error(errMsg);
      throw err;
    }
  };

  /**
   * Increment vehicle stock by 1.
   */
  const handleRestock = async (id) => {
    try {
      const response = await vehicleService.restock(id);
      toast.success(response.message || "Vehicle restocked!");
      // Update the local vehicle state optimistically
      setVehicles((prev) =>
        prev.map((v) =>
          v._id === id
            ? { ...v, quantity: response.vehicle.quantity, status: response.vehicle.status }
            : v
        )
      );
    } catch (err) {
      const errMsg = err.response?.data?.message || "Restock failed.";
      toast.error(errMsg);
      throw err;
    }
  };

  /**
   * Toggle vehicle status between Available and Reserved.
   * Uses the update endpoint to change the status field.
   */
  const handleReserveToggle = async (vehicle) => {
    const newStatus = vehicle.status === "Reserved" ? "Available" : "Reserved";
    try {
      const response = await vehicleService.update(vehicle._id, { ...vehicle, status: newStatus });
      toast.success(`Vehicle ${newStatus === "Reserved" ? "reserved" : "unreserved"} successfully!`);
      setVehicles((prev) =>
        prev.map((v) =>
          v._id === vehicle._id
            ? { ...v, status: response.vehicle.status }
            : v
        )
      );
    } catch (err) {
      const errMsg = err.response?.data?.message || "Status update failed.";
      toast.error(errMsg);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Admin Panel Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center shadow-sm">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                Admin Control Panel
              </h1>
              <p className="text-slate-500 text-sm font-medium mt-0.5">
                Manage your complete vehicle inventory — add, edit, restock, or delete listings.
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchInventory()}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-xs font-semibold rounded-xl text-slate-700 bg-white hover:bg-slate-50 transition-all shadow-sm cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reload
          </button>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 border border-transparent text-xs font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-sm shadow-blue-100 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            Add Vehicle
          </button>
        </div>
      </div>

      {/* Inventory Stats Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 text-center">
          <p className="text-2xl font-extrabold text-blue-600">{vehicles.length}</p>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Total Listings</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 text-center">
          <p className="text-2xl font-extrabold text-emerald-600">
            {vehicles.filter((v) => v.status === "Available").length}
          </p>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Available</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 text-center">
          <p className="text-2xl font-extrabold text-amber-600">
            {vehicles.filter((v) => v.status === "Reserved").length}
          </p>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Reserved</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 text-center">
          <p className="text-2xl font-extrabold text-rose-600">
            {vehicles.filter((v) => v.status === "Sold" || v.quantity === 0).length}
          </p>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Sold Out</p>
        </div>
      </div>

      {/* Vehicle Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => <VehicleCardSkeleton key={i} />)}
        </div>
      ) : vehicles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <AdminVehicleCard
              key={vehicle._id}
              vehicle={vehicle}
              onEdit={handleEdit}
              onDelete={handleDeleteTrigger}
              onRestock={handleRestock}
              onReserveToggle={handleReserveToggle}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No vehicles in inventory"
          description="Add your first vehicle listing using the button above."
          onReset={handleAdd}
        />
      )}

      {/* Add / Edit Form Modal */}
      <VehicleFormModal
        isOpen={isFormOpen}
        vehicle={editingVehicle}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        vehicle={deletingVehicle}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default AdminDashboardPage;
