import React from 'react';
import { render, screen } from '@testing-library/react';

import { MyBarCodeScanner } from './MyBarCodeScanner';

describe('MyBarCodeScanner', () => {
  test('renders', () => {
    render(<MyBarCodeScanner scanCallback={() => null} />);
    const element = screen.getByText('MyBarCodeScanner');
    expect(element).toBeInTheDocument();
  });
});
