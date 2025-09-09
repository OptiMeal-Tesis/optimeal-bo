import { CustomButton } from ".";
import { PencilIcon } from "../assets/icons/PencilIcon";
import { CustomNumberField } from "./CustomNumberField";

interface ProductItemCardProps {
  id: string;
  image: string;
  name: string;
  description: string;
  stock: number;
  onStockChange?: (id: string, newStock: number) => void;
}

export const ProductItemCard = ({
  id,
  image,
  name,
  description,
  stock,
  onStockChange,
}: ProductItemCardProps) => {
  return (
    <div className="bg-white rounded-lg border border-gray-100 overflow-hidden w-full max-w-sm">
      {/* Image Section */}
      <div className="h-50 w-full overflow-hidden">
        <img src={image} alt={name} className="w-full h-full object-cover" />
      </div>

      {/* Content Section */}
      <div className="flex flex-col p-4 h-50">
        {/* Title and Description */}
        <div className="flex flex-col gap-2 flex-grow">
          <span className="text-sub1-bold line-clamp-2">{name}</span>
          <span className="text-body2 text-gray-500 line-clamp-3">
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
              onChange={(newStock) => onStockChange?.(id, newStock)}
            />
          </div>

          {/* Edit Button */}
          <CustomButton
            sx={{
              backgroundColor: "var(--color-primary-500)",
              padding: "0",
              minWidth: "40px",
              width: "40px",
              height: "40px",
              borderRadius: "50%",
            }}
          >
            <PencilIcon color="var(--color-white)" />
          </CustomButton>
        </div>
      </div>
    </div>
  );
};
