import { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import toast from 'react-hot-toast';
import { CheckCircle2, XCircle } from 'lucide-react';
import { addLocalEntryLog } from '../utils/entryLogs';

interface ScannerProps {
  onComplete: () => void;
}

const Scanner = ({ onComplete }: ScannerProps) => {
  const [scanResult, setScanResult] = useState<{ status: 'verified' | 'denied', message: string } | null>(null);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    scannerRef.current = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false
    );

    async function onScanSuccess(decodedText: string) {
      if (scannerRef.current) {
        scannerRef.current.clear();
      }

      // Simple verification logic
      // In a real Aadhaar VC app, we would verify the digital signature here
      // No personal data or Aadhaar number is extracted or stored
      const isValid = verifyAadhaarVC(decodedText);

      const status = isValid ? 'verified' : 'denied';
      const resultMessage = isValid ? 'Verified – Entry Allowed' : 'Invalid VC – Entry Denied';

      setScanResult({ status, message: resultMessage });

      // Store in Firebase
      try {
        await addDoc(collection(db, "entries"), {
          status: resultMessage,
          timestamp: serverTimestamp(),
          // CRITICAL: We do NOT store decodedText or any personal data
        });
        toast.success(isValid ? "Entry Recorded" : "Invalid Scan Recorded");
      } catch (error) {
        console.error("Error storing entry:", error);
        // Fallback to local storage if Firebase fails (for demo purposes)
        addLocalEntryLog(resultMessage);
      }
    }

    function onScanFailure(error: any) {
      // console.warn(`Code scan error = ${error}`);
    }

    scannerRef.current.render(onScanSuccess, onScanFailure);

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(err => console.error("Failed to clear scanner", err));
      }
    };
  }, []);

  const verifyAadhaarVC = (data: string) => {
    // This is a placeholder for actual Aadhaar VC verification logic
    // Real verification would involve checking the digital signature
    // For this demo, we check for specific entry code
    if (data === "Canada") {
      return true; // Entry allowed
    } else if (data && data.length > 0) {
      return false; // Entry denied for other data
    }
    return false; // Simple heuristic for a signed VC
  };

  if (scanResult) {
    return (
      <div className="text-center py-8">
        {scanResult.status === 'verified' ? (
          <div className="flex flex-col items-center">
            <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
            <h3 className="text-2xl font-bold text-green-700">{scanResult.message}</h3>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <XCircle className="w-16 h-16 text-red-500 mb-4" />
            <h3 className="text-2xl font-bold text-red-700">{scanResult.message}</h3>
          </div>
        )}
        <button
          onClick={onComplete}
          className="mt-8 text-blue-600 font-medium hover:underline"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div id="reader" className="overflow-hidden rounded-lg border border-gray-200"></div>
      <p className="mt-4 text-xs text-gray-500 text-center italic">
        Position the Aadhaar VC QR code within the frame to scan.
      </p>
    </div>
  );
};

export default Scanner;
