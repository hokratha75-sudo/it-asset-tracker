'use client';

import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Bell, User, Laptop, Monitor, Printer, Server } from 'lucide-react';

export default function AssetDashboard() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // មុខងារទាញទិន្នន័យពី API (Airtable)
  useEffect(() => {
    fetch('/api/assets')
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          console.error("Error fetching:", data.error);
          setLoading(false);
          return;
        }
        // រៀបចំទិន្នន័យ
        const formattedData = data.map((record) => ({
          id: record.id,
          name: record.fields['Asset Name'] || 'មិនមានឈ្មោះ',
          type: record.fields['Asset Type'] || 'ផ្សេងៗ',
          serialNumber: record.fields['Serial Number'] || 'N/A',
          status: record.fields['Status'] || 'Available',
        }));
        setAssets(formattedData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("មានបញ្ហា:", err);
        setLoading(false);
      });
  }, []);

  // មុខងារស្វែងរក
  const filteredAssets = assets.filter((asset) =>
    asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.serialNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // មុខងារកំណត់ពណ៌ Status
  const getStatusColor = (status) => {
    switch (status) {
      case 'Available': return 'bg-green-100 text-green-800';
      case 'In Use': return 'bg-blue-100 text-blue-800';
      case 'Maintenance': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* ផ្នែកខាងលើ (Header) */}
      <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Monitor className="text-blue-600" /> IT Asset Management
        </h1>
        <div className="flex items-center gap-4">
          <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
            JD
          </div>
        </div>
      </div>

      {/* ផ្នែកបញ្ជា (Toolbar) */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="ស្វែងរកតាមឈ្មោះ ឬលេខស៊េរី..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition w-full md:w-auto justify-center">
          <Plus size={20} /> បន្ថែមសម្ភារៈថ្មី
        </button>
      </div>

      {/* តារាងទិន្នន័យ (Data Table) */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-500">
                <th className="p-4">ឈ្មោះសម្ភារៈ (Asset Name)</th>
                <th className="p-4">ប្រភេទ (Type)</th>
                <th className="p-4">លេខស៊េរី (Serial Number)</th>
                <th className="p-4">ស្ថានភាព (Status)</th>
                <th className="p-4 text-center">សកម្មភាព</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">
                    <div className="flex justify-center items-center gap-2">
                      <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      កំពុងទាញទិន្នន័យ...
                    </div>
                  </td>
                </tr>
              ) : filteredAssets.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">
                    មិនមានទិន្នន័យស្វែងរកទេ
                  </td>
                </tr>
              ) : (
                filteredAssets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-gray-50 transition">
                    <td className="p-4 font-medium text-gray-800">{asset.name}</td>
                    <td className="p-4">
                      <span className="inline-flex text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded-md border border-blue-100">
                        {asset.type}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600 font-mono text-sm">{asset.serialNumber}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(asset.status)}`}>
                        {asset.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center gap-3">
                        <button className="text-gray-400 hover:text-blue-600 transition"><Edit2 size={18} /></button>
                        <button className="text-gray-400 hover:text-red-600 transition"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}