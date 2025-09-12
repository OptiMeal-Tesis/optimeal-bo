export const ModalEnum = {
  PRODUCT_MODAL: "PRODUCT_MODAL",
  SIDES_MODAL: "SIDES_MODAL",
} as const;

export interface ModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  children?: React.ReactNode;
  title?: string;
  productId?: string;
}
