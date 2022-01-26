import { Result } from '@zxing/library';

type OnUpdate = ({ err, result }: OnUpdateParams) => void;

export type OnUpdateParams = {
  err: unknown;
  result?: Result;
};

export type MyBarCodeScannerProps = {
  onUpdate: OnUpdate;
};
