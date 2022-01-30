import {
  BrowserMultiFormatOneDReader,
  BrowserMultiFormatReader,
  BrowserQRCodeReader,
  IScannerControls,
} from '@zxing/browser';
import { Result } from '@zxing/library';

export type TBrowser = BrowserMultiFormatOneDReader | BrowserMultiFormatReader | BrowserQRCodeReader;

export type TScanCallback = {
  result: Result | undefined;
  err: unknown;
  controls: IScannerControls;
};
