import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardActions,
  CardContent,
  Container,
  Modal,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
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
  const [scan1D, setScan1D] = useState(false);
  const [scan2D, setScan2D] = useState(false);
  const [scanQR, setScanQR] = useState(false);

  const handleSetTimeout = (controls: IScannerControls) => {
    setTimeoutId((prevState) => (prevState === undefined ? setTimeout(() => controls.stop(), 10000) : prevState));
  };

  const handleScan1D = () => {
    setScan1D((prevState) => !prevState);
  };

  const handleScan2D = () => {
    setScan2D((prevState) => !prevState);
  };

  const handleScanQR = () => {
    setScanQR((prevState) => !prevState);
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
      // setIsBarcodeScannerModalOpen(false);
      setScan1D(false);
      setScan2D(false);
      setScanQR(false);
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

  useEffect(() => {
    if (scan1D) {
      setScan2D(false);
      setScanQR(false);
    }
  }, [scan1D]);

  useEffect(() => {
    if (scan2D) {
      setScan1D(false);
      setScanQR(false);
    }
  }, [scan2D]);

  useEffect(() => {
    if (scanQR) {
      setScan1D(false);
      setScan2D(false);
    }
  }, [scanQR]);

  return (
    <>
      <AppBar position="static">
        <Typography>AppBar</Typography>
      </AppBar>
      <Container sx={{ backgroundColor: 'yellow' }}>
        <Modal
          open={isBarcodeScannerModalOpen}
          sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
          onClose={handleModalClose}
        >
          <Card>
            <CardContent>
              <Box id="scanner-wrapper" sx={{ textAlign: 'center' }}>
                <Box mb={1}>
                  <ButtonGroup size="small" aria-label="small button group">
                    <Button onClick={handleScan1D}>1D</Button>
                    <Button onClick={handleScan2D}>1D + 2D</Button>
                    <Button onClick={handleScanQR}>QR</Button>
                  </ButtonGroup>
                </Box>
                <Box id="scanner-container" sx={{ width: 400, height: 300, border: '1px solid black' }}>
                  {scan1D && <MyBarCodeScanner mode="1D" scanCallback={scanCallback} />}
                  {scan2D && <MyBarCodeScanner mode="2D" scanCallback={scanCallback} />}
                  {scanQR && <MyBarCodeScanner mode="QR" scanCallback={scanCallback} />}
                </Box>
                <Box mb={1} />
                <TextField fullWidth value={scanResult} inputProps={{ style: { textAlign: 'center' } }} />
              </Box>
            </CardContent>
            <CardActions>
              <Button size="small" color="primary" variant="contained" onClick={() => setScan2D(false)}>
                Re-Scan
              </Button>
              <Button
                size="small"
                color="primary"
                variant="outlined"
                onClick={() => setIsBarcodeScannerModalOpen(false)}
              >
                Close
              </Button>
            </CardActions>
          </Card>
        </Modal>

        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
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
        </Box>
      </Container>
    </>
  );
};
