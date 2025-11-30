import React from 'react';
import { Link } from 'react-router-dom';

function Dashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Found Items Card */}
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-4">Found Items</h2>
          <p className="text-gray-600 mb-4">Manage items that have been found and reported.</p>
          <Link 
            to="/found"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            View Found Items
          </Link>
        </div>

        {/* Lost Items Card */}
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-4">Lost Items</h2>
          <p className="text-gray-600 mb-4">View and manage reported lost items.</p>
          <Link 
            to="/lost"
            className="inline-block bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            View Lost Items
          </Link>
        </div>

        {/* Report New Item Card */}
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-4">Report New Item</h2>
          <p className="text-gray-600 mb-4">Report a new found or lost item.</p>
          <div className="flex space-x-2">
            <Link 
              to="/report/found"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
            >
              Report Found
            </Link>
            <Link 
              to="/report/lost"
              className="inline-block bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-sm"
            >
              Report Lost
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600">Your recent activities will appear here.</p>
          {/* You can map through recent activities here */}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
