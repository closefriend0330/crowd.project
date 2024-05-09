import { createStore, useStore } from 'zustand';

type DialogStore = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  open: () => void;
  close: () => void;
};

const createDialogStore = () =>
  createStore<DialogStore>((set) => ({
    isOpen: false,
    setIsOpen: (isOpen: boolean) => set({ isOpen }),
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false }),
  }));

const dialogStores: Record<string, ReturnType<typeof createDialogStore>> = {};

const useDialog = (dialogId: string) => {
  if (!dialogStores[dialogId]) {
    dialogStores[dialogId] = createDialogStore();
  }
  return useStore(dialogStores[dialogId]);
};

export default useDialog;
