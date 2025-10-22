import CustomButton from "../CustomButton";
import { useModalStore } from "../../stores/modalStore";
import {
  useDeleteProduct,
} from "../../hooks/useProducts";
import toast from "react-hot-toast";
import ImagePlaceholder from "../../assets/images/image-placeholder.jpg";
import { useQueryClient } from "@tanstack/react-query";

interface DeleteProductModalProps {
  productId?: string;
  productName?: string;
  photo?: string;
}

export const DeleteProductModal = ({
  productId,
  productName,
  photo,
}: DeleteProductModalProps) => {
  const { closeModal } = useModalStore();
  const deleteProduct = useDeleteProduct();
  const queryClient = useQueryClient();
  
  const handleDelete = async () => {
    if (!productId) return;

    try {
      await deleteProduct.mutateAsync(productId);
      toast.success("Producto eliminado exitosamente", {
        duration: 4000,
        style: {
          background: "var(--color-white)",
          color: "var(--color-gray-600)",
        },
      });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      closeModal();
    } catch (error: any) {
      toast.error(error?.message || "Error al eliminar el producto", {
        duration: 4000,
        style: {
          background: "var(--color-white)",
          color: "var(--color-gray-600)",
        },
      });
    }
  };

  return (
    <div className="flex flex-col gap-10">
      {/* Product Image */}
      <div className="flex flex-col gap-6 text-center">
        <div className="flex flex-col gap-1">
          <img
            src={photo || ImagePlaceholder}
            alt={productName}
            className="w-100 h-56 object-cover rounded-xl mx-auto"
          />

          {/* Product Name */}
          <h3 className="text-sub1">{productName}</h3>
        </div>

        <div className="flex flex-col gap-2 text-gray-900 text-body1">
          <span>Estás seguro que queres eliminar este producto?</span>
          <span>Esta acción es irreversible</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <CustomButton
          variant="outlined"
          onClick={closeModal}
          disabled={deleteProduct.isPending}
          sx={{
            borderColor: "var(--color-gray-300)",
            color: "var(--color-gray-600)",
            "&:hover": {
              borderColor: "var(--color-gray-400)",
              backgroundColor: "var(--color-gray-50)",
            },
          }}
        >
          Cancelar
        </CustomButton>
        <CustomButton
          variant="contained"
          onClick={handleDelete}
          disabled={deleteProduct.isPending}
          loading={deleteProduct.isPending}
          sx={{
            backgroundColor: "#ef4444",
            "&:hover": {
              backgroundColor: "#dc2626",
            },
          }}
        >
          Eliminar
        </CustomButton>
      </div>
    </div>
  );
};
