import { useState } from "react";
import { CustomButton } from ".";
import { PencilIcon } from "../assets/icons/PencilIcon";
import { CustomNumberField } from "./CustomNumberField";
import { useModalStore } from "../stores/modalStore";
import { ModalEnum } from "../types/modal";

interface ProductItemCardProps {
  id: string;
  image: string;
  name: string;
  description: string;
  stock: number;
  onStockChange?: (newStock: number) => void | Promise<void>;
}

export const ProductItemCard = ({
  id,
  image,
  name,
  description,
  stock,
  onStockChange,
}: ProductItemCardProps) => {
  const { setSelectedModal } = useModalStore();
  const [loaded, setLoaded] = useState(false);

  const handleEditClick = () => {
    setSelectedModal(ModalEnum.PRODUCT_MODAL, {
      productId: id,
      title: "Editar Producto",
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-100 overflow-hidden w-full max-w-sm">

      <div
        className="relative w-full overflow-hidden bg-gray-100"
        style={{ aspectRatio: "4 / 3" }}
      >
        {!loaded && (
          <div className="absolute inset-0 animate-pulse bg-gray-200" />
        )}
        <img
          src={image}
          alt={name}
          loading="lazy"
          decoding="async"
          fetchPriority="low"
          onLoad={() => setLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>

      {/* Content Section */}
      <div className="flex flex-col p-4 h-50">
        {/* Title and Description */}
        <div className="flex flex-col gap-2 flex-grow">
          <span className="text-sub1-bold text-black">{name}</span>
          <span className="text-body2 text-gray-500">
            {description}
          </span>
        </div>

        {/* Bottom Section - Stock and Edit Button */}
        <div className="flex items-end justify-between mt-6">
          {/* Stock Input */}
          <div className="flex flex-col space-y-2">
            <CustomNumberField
              value={stock}
              label="Stock"
              min={0}
              onChange={(newStock) => onStockChange?.(newStock)}
            />
          </div>

          {/* Edit Button */}
          <CustomButton
            onClick={handleEditClick}
            sx={{
              padding: "0",
              minWidth: "40px",
              height: "100%",
              variant: "outlined",
              borderColor: "var(--color-primary-500)",
              borderWidth: "2px",
              borderStyle: "solid",
              borderRadius: "12px",
              color: "var(--color-primary-500)",
              "&:hover": {
                backgroundColor: "var(--color-primary-500)",
                color: "var(--color-white)",
                borderColor: "var(--color-primary-500)",
                "& .edit-text": {
                  color: "var(--color-white)",
                },
                "& .edit-icon": {
                  color: "var(--color-white)",
                },
              },
            }}
          >
            <div className="flex flex-row gap-2 items-center px-3">
              <span className="edit-text text-body1 text-primary-500">
                Editar
              </span>
              <PencilIcon />
            </div>
          </CustomButton>
        </div>
      </div>
    </div>
  );
};
