import { useEffect, useState } from 'react';
import {
  BrowserMultiFormatOneDReader,
  BrowserMultiFormatReader,
  BrowserQRCodeReader,
  IScannerControls,
} from '@zxing/browser';
import { Result } from '@zxing/library';
import useSound from 'use-sound';

import { OnUpdateParams, TScanMode } from 'app/myBarCodeScanner/MyBarCodeScanner.types';
import beepSound from 'assets/barcode-scanner-beep-sound.mp3';

import { TBrowser } from './useScanCode.types';

export const useScanCode = () => {
  const [play] = useSound(beepSound, { volume: 1 });
  const [isScanning, setIsScanning] = useState(false);
  const [codeReader, setCodeReader] = useState<TBrowser | undefined>();
  const [scanMode, setScanMode] = useState<TScanMode | undefined>();
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | undefined>();
  const [scanResult, setScanResult] = useState('');

  const handleSetTimeout = (controls: IScannerControls) => {
    setTimeoutId((prevState) => (prevState === undefined ? setTimeout(() => controls.stop(), 10000) : prevState));
  };

  const handleUpdate = ({ err, result }: OnUpdateParams) => {
    console.log({ err, result });
    if (result) {
      setScanResult(result.getText());
      setIsScanning(true);
    }

    if (err) {
      console.debug(err);
    }
  };

  const scanCallback = (result: Result | undefined, err: unknown, controls: IScannerControls) => {
    if (timeoutId === undefined) {
      handleSetTimeout(controls);
    }

    if (result) {
      play();
      controls.stop();
    }
    handleUpdate({ err, result });
  };

  const choseCodeReader = (mode: TScanMode) => {
    switch (mode) {
      case '1D':
        setCodeReader(new BrowserMultiFormatOneDReader());
        break;

      case '2D':
        setCodeReader(new BrowserMultiFormatReader());
        break;

      case 'QR':
        setCodeReader(new BrowserQRCodeReader());
        break;
    }
  };

  const scanCode = (codeReader: TBrowser) => {
    setIsScanning(true);
    codeReader
      .decodeFromVideoDevice(undefined, 'scannerVideo', scanCallback)
      .then((response) => console.log('Response:', response))
      .catch((error) => console.log('Error:', error));
  };

  useEffect(() => {
    if (scanMode) choseCodeReader(scanMode);
  }, [scanMode]);

  useEffect(() => {
    if (codeReader) scanCode(codeReader);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codeReader]);

  return { isScanning, scanCode, setScanMode, scanResult };
};
