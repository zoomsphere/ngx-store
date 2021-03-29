import { cookiesStorageUtility, localStorageUtility, sessionStorageUtility, sharedStorageUtility } from '.';

describe('WebStorageUtility', () => {
  it('getStorageName() should give proper values', () => {
    expect(localStorageUtility.getStorageName()).toBe('localStorage');
    expect(sessionStorageUtility.getStorageName()).toBe('sessionStorage');
    expect(cookiesStorageUtility.getStorageName()).toBe('cookiesStorage');
    expect(sharedStorageUtility.getStorageName()).toBe('sharedStorage');
  });
});
