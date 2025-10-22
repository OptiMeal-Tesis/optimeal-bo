import { useState, useRef, useEffect } from "react";
import { CustomButton } from ".";
import { PencilIcon } from "../assets/icons/PencilIcon";
import { CustomNumberField } from "./CustomNumberField";
import { useModalStore } from "../stores/modalStore";
import { ModalEnum } from "../types/modal";
import { formatPrice } from "./OrdersTable";

interface ProductItemCardProps {
  id: string;
  image: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  onStockChange?: (newStock: number) => void | Promise<void>;
}

export const ProductItemCard = ({
  id,
  image,
  name,
  description,
  price,
  stock,
  onStockChange,
}: ProductItemCardProps) => {
  const { setSelectedModal } = useModalStore();
  const [loaded, setLoaded] = useState(false);
  const [showNameTooltip, setShowNameTooltip] = useState(false);
  const [showDescTooltip, setShowDescTooltip] = useState(false);
  const [isNameHovered, setIsNameHovered] = useState(false);
  const [isDescHovered, setIsDescHovered] = useState(false);
  const nameRef = useRef<HTMLSpanElement>(null);
  const descRef = useRef<HTMLSpanElement>(null);

  const handleEditClick = () => {
    setSelectedModal(ModalEnum.PRODUCT_MODAL, {
      productId: id,
      title: "Editar Producto",
    });
  };

  // Check if text is truncated
  const checkTruncation = (element: HTMLElement | null, setShowTooltip: (show: boolean) => void) => {
    if (element) {
      const isOverflowing = element.scrollHeight > element.clientHeight;
      setShowTooltip(isOverflowing);
    }
  };

  useEffect(() => {
    checkTruncation(nameRef.current, setShowNameTooltip);
    checkTruncation(descRef.current, setShowDescTooltip);
  }, [name, description]);

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden w-full max-w-sm">

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
          <div className="relative">
            <span 
              ref={nameRef}
              className="text-sub1-bold text-black text-ellipsis overflow-hidden line-clamp-1 text-wrap leading-relaxed pb-0.5 hover:bg-gray-50 rounded px-1 -mx-1 cursor-default"
              onMouseEnter={() => setIsNameHovered(true)}
              onMouseLeave={() => setIsNameHovered(false)}
            >
              {name}
            </span>
            {showNameTooltip && isNameHovered && (
              <div className="absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg transition-opacity duration-200 z-20 max-w-xs">
                {name}
                <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
              </div>
            )}
          </div>
          <div className="relative">
            <span 
              ref={descRef}
              className="text-body2 text-gray-500 line-clamp-2 text-wrap leading-relaxed pb-0.5 hover:bg-gray-50 rounded px-1 -mx-1 cursor-default"
              onMouseEnter={() => setIsDescHovered(true)}
              onMouseLeave={() => setIsDescHovered(false)}
            >
              {description}
            </span>
            {showDescTooltip && isDescHovered && (
              <div className="absolute top-full left-0 mt-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg transition-opacity duration-200 z-20 max-w-xs">
                {description}
                <div className="absolute bottom-full left-4 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900"></div>
              </div>
            )}
          </div>
          <span className="text-body2 text-black">{formatPrice(price)}</span>
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
