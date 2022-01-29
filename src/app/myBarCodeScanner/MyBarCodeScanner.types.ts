import { Result } from '@zxing/library';
import { IScannerControls } from '@zxing/browser';

// type OnUpdate = ({ err, result }: OnUpdateParams) => void;

export type OnUpdateParams = {
  err: unknown;
  result?: Result;
};

export type scanMode = '1D' | '2D' | 'QR';

export type MyBarCodeScannerProps = {
  scanCallback: (result: Result | undefined, err: unknown, controls: IScannerControls) => void;
  mode: scanMode;
};
