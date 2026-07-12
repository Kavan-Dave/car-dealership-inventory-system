import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import vehicleService from "../services/vehicleService";
import VehicleCard from "../components/VehicleCard";
import VehicleCardSkeleton from "../components/VehicleCardSkeleton";
import SearchBar from "../components/SearchBar";
import EmptyState from "../components/EmptyState";
import PurchaseConfirmModal from "../components/PurchaseConfirmModal";
import toast from "react-hot-toast";
import { Car, RefreshCw } from "lucide-react";

/**
 * Main Client Dashboard view.
 * Fetches all vehicle listings from backend, supports searching, and handles purchase order flows.
 */
const DashboardPage = () => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchActive, setSearchActive] = useState(false);
  
  // Modal tracking states
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // Load vehicles on page render
  const fetchInventory = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const data = await vehicleService.getAll();
      setVehicles(data.vehicles || []);
      setSearchActive(false);
    } catch (error) {
      console.error("Error loading inventory:", error);
      toast.error(error.response?.data?.message || "Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();

    // Auto-refresh catalog every 5 seconds to keep client synced with other salespersons/admins
    const interval = setInterval(() => {
      fetchInventory(true);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  /**
   * Dispatches search query to backend.
   */
  const handleSearch = async (searchParams) => {
    try {
      setLoading(true);
      const data = await vehicleService.search(searchParams);
      setVehicles(data.vehicles || []);
      setSearchActive(true);
    } catch (error) {
      console.error("Search failed:", error);
      toast.error(error.response?.data?.message || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Resets active search terms.
   */
  const handleClearSearch = () => {
    fetchInventory();
  };

  /**
   * Triggers the purchase confirmation dialogue.
   */
  const handlePurchaseTrigger = (vehicle) => {
    setSelectedVehicle(vehicle);
    setIsConfirmOpen(true);
  };

  /**
   * Dispatches purchase request to backend.
   * On success, updates inventory state and refreshes metrics automatically.
   */
  const handlePurchaseVehicle = async (id) => {
    try {
      const response = await vehicleService.purchase(id);
      
      // Flash success toast notification
      toast.success(response.message || "Purchase completed successfully!");
      
      // Update local vehicle state to immediately reflect new stock numbers
      setVehicles((prevVehicles) =>
        prevVehicles.map((v) =>
          v._id === id ? { ...v, quantity: response.vehicle.quantity, status: response.vehicle.status } : v
        )
      );
    } catch (error) {
      const errMsg = error.response?.data?.message || "Purchase failed. Out of stock.";
      toast.error(errMsg);
      // Re-fetch database to sync local client state with the server truth
      fetchInventory(true);
      throw error; // Let modal catch error to stop sub-loader state
    }
  };

  /**
   * Toggle vehicle status between Available and Reserved.
   * Uses the reserve endpoint.
   */
  const handleReserveToggle = async (vehicle) => {
    try {
      const response = await vehicleService.reserve(vehicle._id);
      const newStatus = response.vehicle.status;
      toast.success(`Vehicle ${newStatus === "Reserved" ? "reserved" : "unreserved"} successfully!`);
      setVehicles((prev) =>
        prev.map((v) =>
          v._id === vehicle._id
            ? { ...v, status: newStatus }
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
      {/* Premium dashboard welcome section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shadow-sm">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                Apex Motors Catalog
              </h1>
              <p className="text-slate-500 text-sm font-medium mt-0.5">
                Browse our active dealership fleet and process sales orders.
              </p>
            </div>
          </div>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchInventory()}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-xs font-semibold rounded-xl text-slate-700 bg-white hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm cursor-pointer"
            title="Refresh inventory"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reload</span>
          </button>
          
          <div className="hidden sm:flex flex-col items-end text-right">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Account Active</span>
            <span className="text-sm font-bold text-slate-800">{user?.email}</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar integration */}
      <SearchBar onSearch={handleSearch} onClear={handleClearSearch} />

      {/* Grid container */}
      <div>
        {loading ? (
          /* Render grid skeletons during loading phases */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <VehicleCardSkeleton key={idx} />
            ))}
          </div>
        ) : vehicles.length > 0 ? (
          /* Render listings */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle._id}
                vehicle={vehicle}
                onPurchase={() => handlePurchaseTrigger(vehicle)}
                onReserveToggle={handleReserveToggle}
              />
            ))}
          </div>
        ) : (
          /* Empty catalog view */
          <EmptyState
            title={searchActive ? "No matching cars found" : "Dealership catalog is empty"}
            description={
              searchActive
                ? "Try broadening your search query filters or clearing active inputs."
                : "There are currently no vehicles logged in the dealership inventory."
            }
            onReset={searchActive ? handleClearSearch : () => fetchInventory()}
          />
        )}
      </div>

      {/* Order confirmation step */}
      <PurchaseConfirmModal
        isOpen={isConfirmOpen}
        vehicle={selectedVehicle}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handlePurchaseVehicle}
      />
    </div>
  );
};

export default DashboardPage;
