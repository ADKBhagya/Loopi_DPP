import { useState } from "react";

export default function useQRScanner() {

  const [scannerOpen, setScannerOpen] =
    useState(false);

  const [scannerLoading, setScannerLoading] =
    useState(false);

  const [scanSuccess, setScanSuccess] =
    useState(false);

  const [scannedPassport, setScannedPassport] =
    useState<any>(null);

  const startScanner = () => {

    setScannerOpen(true);
    setScannerLoading(false);

  };

  const closeScanner = () => {

    setScannerOpen(false);
    setScannerLoading(false);

  };

  const simulateScan = () => {

    setScannerLoading(true);

    setTimeout(() => {

      const passport = {
        id: "GP-9821",
        verified: true,
      };

      setScannedPassport(passport);

      setScannerLoading(false);
      setScannerOpen(false);

      setScanSuccess(true);

      setTimeout(() => {
        setScanSuccess(false);
      }, 4000);

    }, 2500);

  };

  return {

    scannerOpen,
    scannerLoading,
    scanSuccess,
    scannedPassport,

    startScanner,
    closeScanner,
    simulateScan,

  };
}