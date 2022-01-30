import { Result } from '@zxing/library';

export type OnUpdateParams = {
  err: unknown;
  result?: Result;
};

export type TScanMode = '1D' | '2D' | 'QR';

export type MyBarCodeScannerProps = {
  mode: TScanMode;
};
