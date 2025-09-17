import React from "react";
import { CustomButton } from ".";
import { CloseIcon } from "../assets/icons/CloseIcon";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  size = "lg",
}) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "max-w-md";
      case "md":
        return "max-w-2xl";
      case "lg":
        return "max-w-4xl";
      case "xl":
        return "max-w-6xl";
      default:
        return "max-w-4xl";
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={handleOverlayClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" />

      {/* Modal content */}
      <div
        className={`relative bg-white rounded-lg shadow-xl w-full ${getSizeClasses()} mx-4 max-h-[90vh] overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between py-6 px-6">
          {title && (
            <h2 id="modal-title" className="text-h3-bold text-primary-500">
              {title}
            </h2>
          )}
          <CustomButton
            onClick={onClose}
            sx={{ padding: "0px", minWidth: "0px" }}
          >
            <CloseIcon color="var(--color-gray-600)" />
          </CustomButton>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
