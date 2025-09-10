import toast from "react-hot-toast";
import { ProductItemCard } from "../components/ProductItemCard";
import { CustomButton, ProductCardSkeleton } from "../components";
import { PlusIcon } from "../assets/icons/PlusIcon";
import { PencilIcon } from "../assets/icons/PencilIcon";
import { useModalStore } from "../stores/modalStore";
import { ModalEnum } from "../types/modal";
import { useProducts } from "../hooks/useProducts";
import { useQueryClient } from "@tanstack/react-query";
import type { Product } from "../types/products";
import ImagePlaceholder from "../assets/images/image-placeholder.jpg";

export const Products = () => {
  const today = new Date();
  const formattedDate = today.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const { data: products = [], isLoading, error } = useProducts();
  const queryClient = useQueryClient();

  // Show error toast if query fails
  if (error) {
    toast.error("No se pudieron obtener los productos", {
      duration: 4000,
      style: {
        background: "#ef4444",
        color: "#fff",
      },
    });
  }

  const handleStockChange = (productId: string, newStock: number) => {
    // Update the cache directly
    queryClient.setQueryData(["products"], (oldData: Product[] | undefined) => {
      if (!oldData) return oldData;
      return oldData.map((product) =>
        product.id.toString() === productId
          ? { ...product, stock: newStock }
          : product
      );
    });
  };

  const { setSelectedModal } = useModalStore();

  return (
    <div className="flex flex-col h-full">
      {/* Fixed Page Header */}
      <div className="flex flex-row justify-between items-center sticky top-0 z-10 bg-gray-100 py-4">
        <div>
          <span className="text-h2-bold text-primary-500">
            Productos - {formattedDate}
          </span>
        </div>
        <div className="flex flex-row">
          <CustomButton sx={{ gap: "8px" }}>
            <PencilIcon color="var(--color-primary-500)" />
            <span className="text-body1 text-primary-500">Guarniciones</span>
          </CustomButton>
          <CustomButton
            sx={{ gap: "8px" }}
            onClick={() => {
              setSelectedModal(ModalEnum.NEW_PRODUCT_MODAL);
            }}
          >
            <PlusIcon color="var(--color-primary-500)" />
            <span className="text-body1 text-primary-500">Nuevo producto</span>
          </CustomButton>
        </div>
      </div>

      {/* Scrollable Products Grid */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-body1 text-gray-600 mb-4">
                No hay productos disponibles
              </p>
              <CustomButton
                onClick={() => {
                  setSelectedModal(ModalEnum.NEW_PRODUCT_MODAL);
                }}
                sx={{ backgroundColor: "var(--color-primary-500)" }}
              >
                Agregar primer producto
              </CustomButton>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductItemCard
                key={product.id}
                id={product.id.toString()}
                image={product.photo || ImagePlaceholder}
                name={product.name}
                description={product.description}
                stock={product.stock}
                onStockChange={handleStockChange}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
