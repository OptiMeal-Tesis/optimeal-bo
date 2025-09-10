import { create } from 'zustand';
import type { ModalProps } from '../types/modal';
import { ModalEnum } from '../types/modal';

type ModalType = typeof ModalEnum[keyof typeof ModalEnum];

interface ModalState {
  selectedModal: ModalType | null;
  setSelectedModal: (
    selectedModal: ModalType,
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
