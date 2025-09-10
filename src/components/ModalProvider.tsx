import React from "react";
import { useModalStore } from "../stores/modalStore";
import { ModalEnum } from "../types/modal";
import { NewProductModal } from "./modals/NewProductModal";
import { Modal } from "./Modal";

const modalRegistry = {
  [ModalEnum.NEW_PRODUCT_MODAL]: {
    component: NewProductModal,
    title: "Agregar Nuevo Producto",
  },
};

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { selectedModal, closeModal } = useModalStore();

  const renderModal = () => {
    if (!selectedModal) return null;

    const modalConfig =
      modalRegistry[selectedModal as keyof typeof modalRegistry];
    if (!modalConfig) return null;

    const { component: ModalComponent, title } = modalConfig;

    return (
      <Modal isOpen={true} onClose={closeModal} title={title}>
        <ModalComponent />
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
