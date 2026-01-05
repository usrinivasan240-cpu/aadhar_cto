import { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { Users, Clock, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getLocalEntryLogs } from '../utils/entryLogs';

interface Entry {
  id: string;
  status: string;
  timestamp: any;
}

const AdminDashboard = () => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to get data from Firestore
    const q = query(collection(db, "entries"), orderBy("timestamp", "desc"));

    const loadFromLocalStorage = () => {
      const localLogs = getLocalEntryLogs();
      setEntries(
        localLogs
          .map((log, i) => ({
            id: `local-${i}`,
            status: log.status,
            timestamp: { toDate: () => new Date(log.time) }
          }))
          .reverse()
      );
      setLoading(false);
    };

    let unsubscribe = () => {};

    try {
      unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          const entriesData: Entry[] = [];
          querySnapshot.forEach((doc) => {
            entriesData.push({ id: doc.id, ...doc.data() } as Entry);
          });
          setEntries(entriesData);
          setLoading(false);
        },
        (error) => {
          console.warn("Firestore listener failed, falling back to local storage:", error);
          loadFromLocalStorage();
        }
      );
    } catch (error) {
      console.warn("Firestore listener failed, falling back to local storage:", error);
      loadFromLocalStorage();
    }

    return () => unsubscribe();
  }, []);

  const totalEntries = entries.filter(e => e.status.includes('Allowed')).length;

  return (
    <div className="max-w-2xl mx-auto pt-10 px-4 pb-20">
      <div className="flex items-center mb-6">
        <Link to="/" className="text-blue-600 mr-4">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mr-4">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Entries</p>
            <p className="text-2xl font-bold text-gray-900">{totalEntries}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
          <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mr-4">
            <Clock className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Last Entry</p>
            <p className="text-lg font-bold text-gray-900">
              {entries.length > 0 ? entries[0].timestamp?.toDate().toLocaleTimeString() : 'N/A'}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50">
          <h2 className="text-lg font-semibold text-gray-800">Recent Entry Logs</h2>
        </div>

        {loading ? (
          <div className="p-10 text-center text-gray-500">Loading logs...</div>
        ) : entries.length === 0 ? (
          <div className="p-10 text-center text-gray-500">No entries recorded yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-white">
                <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                  <th className="px-6 py-3">Time</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {entries.map((entry) => (
                  <tr key={entry.id} className="align-top">
                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                      {entry.timestamp?.toDate().toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                          entry.status.includes('Allowed')
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {entry.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
