import React, { useEffect } from 'react';
import { BrowserMultiFormatOneDReader, BrowserMultiFormatReader, BrowserQRCodeReader } from '@zxing/browser';

import { MyBarCodeScannerProps, scanMode } from './MyBarCodeScanner.types';

export const MyBarCodeScanner: React.FC<MyBarCodeScannerProps> = ({ scanCallback, mode }) => {
  useEffect(() => {
    const browser = (mode: scanMode) => {
      switch (mode) {
        case '1D':
          return new BrowserMultiFormatOneDReader();

        case '2D':
          return new BrowserMultiFormatReader();

        case 'QR':
          return new BrowserQRCodeReader();
      }
    };

    const codeReader = browser(mode);

    /*
    const scanOnce = codeReader
      .decodeOnceFromVideoDevice(undefined, 'scannerVideo')
      .then((result: Result) => {
        play();
        console.log({ result });
        onUpdate({ err: null, result });
      })
      .catch((error) => {
        console.log(error);
        onUpdate({ err: error, result: undefined });
      });
*/

    codeReader.decodeFromVideoDevice(undefined, 'scannerVideo', scanCallback);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <video id="scannerVideo" playsInline width="100% !important" height="auto !important" />;
};
