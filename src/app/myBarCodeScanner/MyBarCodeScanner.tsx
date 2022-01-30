import React, { useEffect } from 'react';

import { useScanCode } from 'hooks/useScanCode/useScanCode';

import { MyBarCodeScannerProps } from './MyBarCodeScanner.types';

export const MyBarCodeScanner: React.FC<MyBarCodeScannerProps> = ({ mode }) => {
  const { setScanMode, scanResult } = useScanCode();

  useEffect(() => {
    // TODO: remove!
    console.log('scanResult:', scanResult);
  }, [scanResult]);

  useEffect(() => {
    setScanMode(mode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <video id="scannerVideo" playsInline width="100% !important" height="auto !important" />;
};
