import React, { useEffect, useState } from 'react';
import { Box, Button, Card, CardContent, Modal, TextField, Typography, useTheme } from '@mui/material';

import { MyBarCodeScanner } from 'app/myBarCodeScanner/MyBarCodeScanner';
import { OnUpdateParams } from 'app/myBarCodeScanner/MyBarCodeScanner.types';

import { MainProps } from './Main.types';
import { useStyles } from './Main.styles';

export const Main: React.FC<MainProps> = ({}) => {
  const theme = useTheme();
  const classes = useStyles(theme);

  const [isBarcodeScannerModalOpen, setIsBarcodeScannerModalOpen] = useState(false);
  const [scanResult, setScanResult] = useState('');

  const handleUpdate = ({ err, result }: OnUpdateParams) => {
    console.log({ err, result });
    if (result) {
      setScanResult(result.getText());
      setIsBarcodeScannerModalOpen(false);
    }
  };

  const modalHandleClose = () => {
    setIsBarcodeScannerModalOpen(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Modal
        open={isBarcodeScannerModalOpen}
        sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
        onClose={modalHandleClose}
      >
        <Card>
          <CardContent>
            <Box id="scanner-wrapper">
              <MyBarCodeScanner onUpdate={handleUpdate} />
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
