import { renderHook } from '@testing-library/react';

import useAuth from './use-auth';

describe('useAuth', () => {
  it('should render successfully', () => {
    renderHook(() => useAuth());
    expect(true).toBeTruthy();
  });
});
