import axiosInstance from "../api/axiosInstance";

/**
 * Service handlers for Vehicle operations.
 * Interacts with /api/vehicles endpoints.
 */
export const vehicleService = {
  /**
   * Retrieves all vehicles from inventory.
   * @returns {Promise<object>} Response data containing vehicles array
   */
  getAll: async () => {
    const response = await axiosInstance.get("/vehicles");
    return response.data;
  },

  /**
   * Searches for vehicles based on query filters.
   * @param {object} params - Search criteria (make, model, category, minPrice, maxPrice)
   * @returns {Promise<object>} Response data containing matching vehicles array
   */
  search: async (params) => {
    // Filter out empty or undefined criteria
    const cleanParams = {};
    Object.keys(params).forEach((key) => {
      if (params[key] !== "" && params[key] !== undefined && params[key] !== null) {
        cleanParams[key] = params[key];
      }
    });

    const response = await axiosInstance.get("/vehicles/search", {
      params: cleanParams,
    });
    return response.data;
  },

  /**
   * Retrieves a single vehicle by ID.
   * @param {string} id - Database vehicle ID
   * @returns {Promise<object>} Vehicle document
   */
  getById: async (id) => {
    const response = await axiosInstance.get(`/vehicles/${id}`);
    return response.data;
  },

  /**
   * Creates a new vehicle (Admin only).
   * @param {object} vehicleData - Vehicle schema properties
   * @returns {Promise<object>} Response message and created document
   */
  create: async (vehicleData) => {
    const response = await axiosInstance.post("/vehicles", vehicleData);
    return response.data;
  },

  /**
   * Updates an existing vehicle (Admin only).
   * @param {string} id - Vehicle ID
   * @param {object} vehicleData - Updated schema fields
   * @returns {Promise<object>} Response and updated document
   */
  update: async (id, vehicleData) => {
    const response = await axiosInstance.put(`/vehicles/${id}`, vehicleData);
    return response.data;
  },

  /**
   * Deletes a vehicle (Admin only).
   * @param {string} id - Vehicle ID
   * @returns {Promise<object>} Response message
   */
  delete: async (id) => {
    const response = await axiosInstance.delete(`/vehicles/${id}`);
    return response.data;
  },

  /**
   * Initiates vehicle purchase decrement.
   * @param {string} id - Vehicle ID
   * @returns {Promise<object>} Response and updated vehicle document
   */
  purchase: async (id) => {
    const response = await axiosInstance.post(`/vehicles/${id}/purchase`);
    return response.data;
  },

  /**
   * Restocks a vehicle by 1 (Admin only).
   * @param {string} id - Vehicle ID
   * @returns {Promise<object>} Response and updated vehicle document
   */
  restock: async (id) => {
    const response = await axiosInstance.post(`/vehicles/${id}/restock`);
    return response.data;
  },
};

export default vehicleService;
