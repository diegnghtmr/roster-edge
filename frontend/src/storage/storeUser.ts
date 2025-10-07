import type { ILoginUser } from "@/interface/ILogin";
import { create } from "zustand";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import StringCrypto from "string-crypto";

// Define the state and actions for the store
interface UserStore {
  user: ILoginUser | null;
  setUser: (user: ILoginUser) => void;
  updateUser: (updates: Partial<ILoginUser>) => void;
  clearUser: () => void;
}

// Setup crypto outside of the store
const options = {
  salt: import.meta.env.VITE_SECURE_LOCAL_STORAGE_SALT,
};
const sc = new StringCrypto(options);

const getSecureLocalStorage = (key: string) => {
  const value = localStorage.getItem(key);
  if (value)
    return sc.decryptString(
      value,
      import.meta.env.VITE_SECURE_LOCAL_STORAGE_PASSWORD
    );
  return "";
};

const setObjectSecureLocalStorage = (key: string, value: object) => {
  const encryptedValue = sc.encryptString(
    JSON.stringify(value),
    import.meta.env.VITE_SECURE_LOCAL_STORAGE_PASSWORD
  );
  localStorage.setItem(key, encryptedValue);
};

// Create the store
const useUserStore = create<UserStore>((set) => {
  // Initialize state from localStorage if available
  const storedUser = getSecureLocalStorage("user");
  const initialUser = storedUser ? JSON.parse(storedUser) : null;

  // Set a new user into the store and persists it in the local storage
  const setUser = (user: ILoginUser) => {
    setObjectSecureLocalStorage("user", user);
    set({ user });
  };

  // Update the current user information
  const updateUser = (updates: Partial<ILoginUser>) =>
    set((state) => {
      const updatedUser = state.user ? { ...state.user, ...updates } : null;
      if (updatedUser) {
        localStorage.setItem("user", JSON.stringify(updatedUser));
      } else {
        localStorage.removeItem("user");
      }
      return { user: updatedUser };
    });

  // Remove the current user from store and local storage
  const clearUser = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    set({ user: null });
  };

  return {
    user: initialUser,
    setUser,
    updateUser,
    clearUser,
  };
});

export default useUserStore;
