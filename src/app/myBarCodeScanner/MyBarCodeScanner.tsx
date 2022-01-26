import React, { useEffect, useState } from 'react';
import useSound from 'use-sound';
import { BrowserMultiFormatOneDReader, IScannerControls } from '@zxing/browser';
import { Result } from '@zxing/library';
import { Box } from '@mui/material';

import beepSound from 'assets/barcode-scanner-beep-sound.mp3';

import { MyBarCodeScannerProps } from './MyBarCodeScanner.types';

export const MyBarCodeScanner: React.FC<MyBarCodeScannerProps> = ({ onUpdate }) => {
  const [play] = useSound(beepSound, { volume: 1 });
  const [scanControls, setScanControls] = useState<IScannerControls | undefined>();

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

    const scanTimeout = (controls: IScannerControls) => {
      setTimeout(() => {
        controls.stop();
      }, 10000);
    };

    const scanCallback = (result: Result | undefined, err: unknown, controls: IScannerControls) => {
      scanTimeout(controls);
      setScanControls(controls);
      if (result) {
        play();
        controls.stop();
      }
      onUpdate({ err, result });
    };

    codeReader.decodeFromVideoDevice(undefined, 'scannerVideo', scanCallback);

    return (): void => {
      if (scanControls) {
        scanControls.stop();
      }
      // codeReader.reset();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box id="scanner-container" sx={{ width: 400, height: 300, border: '1px solid black' }}>
      <video id="scannerVideo" playsInline width={400} />
    </Box>
  );
};
