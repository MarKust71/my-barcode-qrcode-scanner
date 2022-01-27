import React, { useEffect, useState } from 'react';
import { Box, Button, Card, CardContent, Modal, TextField, Typography, useTheme } from '@mui/material';
import { Result } from '@zxing/library';
import { IScannerControls } from '@zxing/browser';
import useSound from 'use-sound';

import { MyBarCodeScanner } from 'app/myBarCodeScanner/MyBarCodeScanner';
import { OnUpdateParams } from 'app/myBarCodeScanner/MyBarCodeScanner.types';
import { api } from 'api/axiosApi';
import beepSound from 'assets/barcode-scanner-beep-sound.mp3';

import { MainProps } from './Main.types';
import { useStyles } from './Main.styles';

type FetchDataParams = {
  code: string;
};

const fetchData = async ({ code }: FetchDataParams): Promise<void> => {
  try {
    const response = await api.post('tracking/checkmailex', {
      language: 'PL',
      addPostOfficeInfo: true,
      number: code,
    });

    console.log('response:', response.data.mailInfo);
  } catch (error) {
    console.debug(error);
  }
};

export const Main: React.FC<MainProps> = ({}) => {
  const theme = useTheme();
  const classes = useStyles(theme);

  const [isBarcodeScannerModalOpen, setIsBarcodeScannerModalOpen] = useState(false);
  const [scanResult, setScanResult] = useState('');
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | undefined>();
  const [scanControls, setScanControls] = useState<IScannerControls | undefined>();
  const [play] = useSound(beepSound, { volume: 1 });

  const handleSetTimeout = (controls: IScannerControls) => {
    setTimeoutId((prevState) => (prevState === undefined ? setTimeout(() => controls.stop(), 10000) : prevState));
  };

  const scanCallback = (result: Result | undefined, err: unknown, controls: IScannerControls) => {
    setScanControls((prevState) => (prevState === undefined ? controls : prevState));

    if (timeoutId === undefined) {
      handleSetTimeout(controls);
    }

    if (result) {
      play();
      controls.stop();
    }
    handleUpdate({ err, result });
  };

  const handleUpdate = ({ err, result }: OnUpdateParams) => {
    console.log({ err, result });
    if (result) {
      setScanResult(result.getText());
      setIsBarcodeScannerModalOpen(false);
    }

    if (err) {
      console.debug(err);
    }
  };

  const handleModalClose = () => {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }
    if (scanControls !== undefined) {
      scanControls.stop();
      setScanControls(undefined);
    }
    setIsBarcodeScannerModalOpen(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (scanResult) {
      fetchData({ code: scanResult });
    }
  }, [scanResult]);

  return (
    <>
      <Modal
        open={isBarcodeScannerModalOpen}
        sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
        onClose={handleModalClose}
      >
        <Card>
          <CardContent>
            <Box id="scanner-wrapper">
              <MyBarCodeScanner scanCallback={scanCallback} />
              <Box mb={1} />
              <TextField fullWidth value={scanResult} inputProps={{ style: { textAlign: 'center' } }} />
            </Box>
          </CardContent>
        </Card>
      </Modal>

      {!isBarcodeScannerModalOpen && (
        <Button
          onClick={() => {
            setScanResult('');
            setIsBarcodeScannerModalOpen(true);
          }}
        >
          Scan
        </Button>
      )}
      {isBarcodeScannerModalOpen && <Button onClick={() => setIsBarcodeScannerModalOpen(false)}>Close</Button>}
      <Typography className={classes.wrapper}>{scanResult}</Typography>
    </>
  );
};
