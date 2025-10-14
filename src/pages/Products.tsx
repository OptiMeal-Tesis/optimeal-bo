import toast from "react-hot-toast";
import { ProductItemCard } from "../components/ProductItemCard";
import { CustomButton, ProductCardSkeleton } from "../components";
import { PlusIcon } from "../assets/icons/PlusIcon";
import { PencilIcon } from "../assets/icons/PencilIcon";
import { useModalStore } from "../stores/modalStore";
import { ModalEnum } from "../types/modal";
import { useGetAllProducts, useUpdateProduct } from "../hooks/useProducts";
import { useQueryClient } from "@tanstack/react-query";
import type { Product } from "../types/products";
import { mapRestrictionsToEnum, ProductTypeEnum } from "../types/products";
import ImagePlaceholder from "../assets/images/image-placeholder.jpg";
import { useRef, useCallback } from "react";

export const Products = () => {
  const today = new Date();
  const formattedDate = today.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const { data: products = [], isLoading, error } = useGetAllProducts();
  const queryClient = useQueryClient();
  const updateProductMutation = useUpdateProduct();
  const debounceTimeouts = useRef<Map<string, number>>(new Map());

  // Show error toast if query fails
  if (error) {
    toast.error("No se pudieron obtener los productos", {
      duration: 4000,
      style: {
        background: "var(--color-white)",
        color: "var(--color-gray-600)",
      },
    });
  }

  const handleStockChange = useCallback(
    (newStock: number, currentProduct: Product) => {
      const productId = currentProduct.id.toString();

      // Clear existing timeout for this product
      const existingTimeout = debounceTimeouts.current.get(productId);
      if (existingTimeout) {
        window.clearTimeout(existingTimeout);
      }

      // Update cache immediately for responsive UI
      queryClient.setQueryData(
        ["products"],
        (oldData: Product[] | undefined) => {
          if (!oldData) return oldData;
          return oldData.map((product) =>
            product.id.toString() === productId
              ? { ...product, stock: newStock }
              : product
          );
        }
      );

      // Set new timeout for API call. Avoids multiple requests.
      const timeout = window.setTimeout(async () => {
        try {
          await updateProductMutation.mutateAsync({
            id: currentProduct.id.toString(),
            data: {
              ...currentProduct,
              restrictions: mapRestrictionsToEnum(currentProduct.restrictions),
              sides: currentProduct.sides.map((side) => side.id),
              type: currentProduct.type as ProductTypeEnum,
              stock: newStock,
            },
          });

          toast.success(
            "Stock actualizado correctamente para el producto " +
              currentProduct.name,
            {
              style: {
                background: "var(--color-white)",
                color: "var(--color-gray-600)",
              },
            }
          );
        } catch (error) {
          queryClient.invalidateQueries({ queryKey: ["products"] });
          toast.error(
            "Error al actualizar el stock del producto " + currentProduct.name,
            {
              style: {
                background: "var(--color-white)",
                color: "var(--color-gray-600)",
              },
            }
          );
        } finally {
          debounceTimeouts.current.delete(productId);
        }
      }, 1000);

      debounceTimeouts.current.set(productId, timeout);
    },
    [queryClient, updateProductMutation]
  );

  const { setSelectedModal } = useModalStore();

  return (
    <div className="flex flex-col h-full">
      {/* Fixed Page Header */}
      <div className="flex flex-row justify-between items-center sticky top-0 z-10 bg-gray-100 pb-4">
        <div className="flex flex-col gap-2">
          <span className="text-h2-bold text-primary-500">Productos</span>
          <span className="text-body1-bold text-primary-500">
            {formattedDate}
          </span>
        </div>
        <div className="flex flex-row">
          <CustomButton
            sx={{ gap: "8px" }}
            onClick={() => {
              setSelectedModal(ModalEnum.SIDES_MODAL, {
                title: "Editar Guarniciones",
              });
            }}
          >
            <PencilIcon color="var(--color-primary-500)" />
            <span className="text-body1 text-primary-500">Guarniciones</span>
          </CustomButton>
          <CustomButton
            sx={{ gap: "8px" }}
            onClick={() => {
              setSelectedModal(ModalEnum.PRODUCT_MODAL, {
                title: "Agregar Nuevo Producto",
              });
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
                  setSelectedModal(ModalEnum.PRODUCT_MODAL, {
                    title: "Agregar Nuevo Producto",
                  });
                }}
                sx={{ backgroundColor: "var(--color-primary-500)", color: "var(--color-white)" }}
              >
                Agregar primer producto
              </CustomButton>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product: Product) => (
              <ProductItemCard
                key={product.id}
                id={product.id.toString()}
                image={product.photo || ImagePlaceholder}
                name={product.name}
                description={product.description}
                stock={product.stock}
                onStockChange={(newStock) =>
                  handleStockChange(newStock, product)
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
