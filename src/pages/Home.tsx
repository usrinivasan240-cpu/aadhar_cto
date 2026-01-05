import { useState } from 'react';
import Scanner from '../components/Scanner';
import { Layout } from 'lucide-react';

const Home = () => {
  const [showScanner, setShowScanner] = useState(false);

  return (
    <div className="max-w-md mx-auto pt-10 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Aadhaar VC Event Entry</h1>
        <p className="text-gray-600">Scan your Aadhaar Verifiable Credential QR code to enter the event.</p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        {!showScanner ? (
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
              <Layout className="w-10 h-10 text-blue-600" />
            </div>
            <button
              onClick={() => setShowScanner(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-sm"
            >
              Scan Aadhaar VC QR
            </button>
            <p className="mt-4 text-xs text-gray-400 text-center">
              By scanning, you consent to verify your digital credential for event entry.
              No personal data or Aadhaar number will be stored.
            </p>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Scan QR Code</h2>
              <button
                onClick={() => setShowScanner(false)}
                className="text-gray-500 hover:text-gray-700 text-sm font-medium"
              >
                Cancel
              </button>
            </div>
            <Scanner onComplete={() => setShowScanner(false)} />
          </div>
        )}
      </div>

      <div className="mt-12 text-center">
        <a href="/admin" className="text-sm text-gray-500 hover:text-blue-600 underline">
          Go to Admin Dashboard
        </a>
      </div>
    </div>
  );
};

export default Home;
