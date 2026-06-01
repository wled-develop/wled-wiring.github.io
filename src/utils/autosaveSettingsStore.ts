import { create } from 'zustand';

const AUTOSAVE_ENABLED_KEY = 'wled-wiring.autosave.enabled';

type AutosaveSettingsStore = {
  autosaveEnabled: boolean;
  setAutosaveEnabled: (autosaveEnabled: boolean) => void;
};

const readInitialAutosaveEnabled = () => {
  if(typeof window === 'undefined') return true;

  try {
    const stored = window.localStorage.getItem(AUTOSAVE_ENABLED_KEY);
    return stored === null ? true : stored === 'true';
  } catch {
    return true;
  }
};

export const useAutosaveSettingsStore = create<AutosaveSettingsStore>((set) => ({
  autosaveEnabled: readInitialAutosaveEnabled(),
  setAutosaveEnabled: (autosaveEnabled) => {
    try {
      window.localStorage.setItem(AUTOSAVE_ENABLED_KEY, String(autosaveEnabled));
    } catch {
      // The setting still works for the current session if storage is blocked.
    }

    set({autosaveEnabled});
  },
}));
