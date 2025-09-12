import React from "react";
import { useModalStore } from "../stores/modalStore";
import { ModalEnum } from "../types/modal";
import { ProductModal } from "./modals/ProductModal";
import { Modal } from "./Modal";
import { SidesModal } from "./modals/SidesModal";
import { DeleteProductModal } from "./modals/DeleteProductModal";

const modalRegistry = {
  [ModalEnum.PRODUCT_MODAL]: {
    component: ProductModal,
  },
  [ModalEnum.SIDES_MODAL]: {
    component: SidesModal,
  },
  [ModalEnum.DELETE_CONFIRMATION_MODAL]: {
    component: DeleteProductModal,
  },
};

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { selectedModal, modalProps, closeModal } = useModalStore();

  const renderModal = () => {
    if (!selectedModal) return null;

    const modalConfig =
      modalRegistry[selectedModal as keyof typeof modalRegistry];
    if (!modalConfig) return null;

    const { component: ModalComponent } = modalConfig;

    return (
      <Modal isOpen={true} onClose={closeModal} title={modalProps?.title}>
        <ModalComponent {...modalProps} />
      </Modal>
    );
  };

  return (
    <>
      {children}
      {renderModal()}
    </>
  );
};
