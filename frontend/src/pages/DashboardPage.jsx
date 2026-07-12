import React from "react";

const DashboardPage = () => {
  return (
    <div className="p-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Dealership Inventory Dashboard</h1>
        <p className="text-slate-500 mb-6">
          Welcome to the premium car dealership inventory. Browse, search, and purchase vehicles.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          System Online
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
