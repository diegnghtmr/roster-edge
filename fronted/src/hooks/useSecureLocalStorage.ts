// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import StringCrypto from "string-crypto";

const options = {
  salt: import.meta.env.VITE_SECURE_LOCAL_STORAGE_SALT,
};

const sc = new StringCrypto(options);

const useSecureLocalStorage = () => {
  // Add a new item (string) to localstorage, the value will be encrypted for safety porpoises
  const setSecureLocalStorage = (key: string, value: string) => {
    // Encrypt the value
    const encryptedValue = sc.encryptString(
      value,
      import.meta.env.VITE_SECURE_LOCAL_STORAGE_PASSWORD
    );
    localStorage.setItem(key, encryptedValue);
  };

  // Add a new item (object) to localstorage, the value will be encrypted for safety porpoises
  const setObjectSecureLocalStorage = (key: string, value: object) => {
    // Encrypt the value
    const encryptedValue = sc.encryptString(
      JSON.stringify(value),
      import.meta.env.VITE_SECURE_LOCAL_STORAGE_PASSWORD
    );
    localStorage.setItem(key, encryptedValue);
  };

  // Get an encrypted item from localstorage
  const getSecureLocalStorage = (key: string) => {
    // Check if there's a current value, in other case will return an empty string
    const value = localStorage.getItem(key);
    if (value)
      return sc.decryptString(
        value,
        import.meta.env.VITE_SECURE_LOCAL_STORAGE_PASSWORD
      );
    return "";
  };

  // Remove an item from localstorage
  const clearSecureLocalStorage = (key: string) => {
    localStorage.removeItem(key);
  };

  return {
    setSecureLocalStorage,
    setObjectSecureLocalStorage,
    getSecureLocalStorage,
    clearSecureLocalStorage,
  };
};

export default useSecureLocalStorage;
