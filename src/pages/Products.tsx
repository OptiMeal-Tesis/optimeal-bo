import { useState } from "react";
import { ProductItemCard } from "../components/ProductItemCard";
import { CustomButton } from "../components";
import { PlusIcon } from "../assets/icons/PlusIcon";
import { PencilIcon } from "../assets/icons/PencilIcon";
import { useModalStore } from "../stores/modalStore";
import { ModalEnum } from "../types/modal";

export const Products = () => {
  const today = new Date();
  const formattedDate = today.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  // Mock data para los productos
  const [products, setProducts] = useState([
    {
      id: "1",
      image:
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
      name: "Milanesa de alta ternera con guarnición",
      description:
        "Milanesa frita de ternera con guarnición a elección con mucho queso y salsa y jamoncito.",
      stock: 12,
    },
    {
      id: "2",
      image:
        "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop",
      name: "Pizza Margherita",
      description: "Pizza clásica con tomate, mozzarella y albahaca fresca.",
      stock: 8,
    },
    {
      id: "3",
      image:
        "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop",
      name: "Hamburguesa Clásica",
      description: "Hamburguesa con carne, lechuga, tomate y cebolla.",
      stock: 15,
    },
    {
      id: "4",
      image:
        "https://images.unsplash.com/photo-1563379091339-03246963d96a?w=400&h=300&fit=crop",
      name: "Ensalada César",
      description:
        "Ensalada fresca con lechuga, pollo, crutones y aderezo césar.",
      stock: 6,
    },
    {
      id: "5",
      image:
        "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop",
      name: "Pasta Carbonara",
      description: "Pasta con salsa carbonara, panceta y queso parmesano.",
      stock: 10,
    },
    {
      id: "6",
      image:
        "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&h=300&fit=crop",
      name: "Sushi Roll",
      description: "Roll de sushi con salmón, aguacate y arroz.",
      stock: 4,
    },
  ]);

  const handleStockChange = (productId: string, newStock: number) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId ? { ...product, stock: newStock } : product
      )
    );
  };

  const setSelectedModal = useModalStore((state) => state.setSelectedModal);

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
          <CustomButton sx={{ gap: "8px" }} onClick={() => setSelectedModal(ModalEnum.NEW_PRODUCT_MODAL)}>
            <PlusIcon color="var(--color-primary-500)" />
            <span className="text-body1 text-primary-500">Nuevo producto</span>
          </CustomButton>
        </div>
      </div>

      {/* Scrollable Products Grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductItemCard
              key={product.id}
              id={product.id}
              image={product.image}
              name={product.name}
              description={product.description}
              stock={product.stock}
              onStockChange={handleStockChange}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
