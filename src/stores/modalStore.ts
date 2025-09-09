import { create } from 'zustand';
import type { ModalEnum, ModalProps } from '../types/modal';

interface ModalState {
  selectedModal: ModalEnum | null;
  setSelectedModal: (
    selectedModal: ModalEnum,
    modalProps?: ModalProps
  ) => void;
  closeModal: () => void;
  modalProps: ModalProps | null;
}

export const useModalStore = create<ModalState>((set) => ({
  selectedModal: null,
  setSelectedModal: (selectedModal, modalProps) =>
    set({ selectedModal, modalProps }),
  closeModal: () => set({ selectedModal: null, modalProps: null }),
  modalProps: null,
}));
