import { renderHook } from '@testing-library/react-hooks';

import { useScanCode } from './useScanCode';

describe('useScanCode', () => {
  test('returns a value', async () => {
    const { result } = renderHook(() => useScanCode());

    expect(result.current).toEqual('1');
  });
});