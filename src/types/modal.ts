export const ModalEnum = {
  NEW_PRODUCT_MODAL: "NEW_PRODUCT_MODAL",
} as const;

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}
