import React from "react";

const AdminDashboardPage = () => {
  return (
    <div className="p-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Admin Control Panel</h1>
        <p className="text-slate-500 mb-6">
          Authorized personnel only. Restock vehicles, create listings, and modify inventory metrics here.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg text-sm font-medium">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
          Restricted Access Area
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
