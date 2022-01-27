import React, { useEffect } from 'react';
import { BrowserMultiFormatOneDReader } from '@zxing/browser';
import { Box } from '@mui/material';

import { MyBarCodeScannerProps } from './MyBarCodeScanner.types';

export const MyBarCodeScanner: React.FC<MyBarCodeScannerProps> = ({ scanCallback }) => {
  useEffect(() => {
    const codeReader = new BrowserMultiFormatOneDReader();

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

  return (
    <Box id="scanner-container" sx={{ width: 400, height: 300, border: '1px solid black' }}>
      <video id="scannerVideo" playsInline width={400} />
    </Box>
  );
};
