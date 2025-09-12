import React, { useState } from "react";
import CustomTextField from "../CustomTextField";
import CustomButton from "../CustomButton";
import { ImageUpload, CustomSelectField, CustomRadioGroup } from "../";
import { useModalStore } from "../../stores/modalStore";
import {
  useCreateProduct,
  useUpdateProduct,
  useGetProductById,
  useInvalidateProductsQueryKey,
  useInvalidateProductQueryKey,
} from "../../hooks/useProducts";
import { useGetActiveSides } from "../../hooks/useSides";
import { ModalEnum } from "../../types/modal";
import toast from "react-hot-toast";

import type { CreateProductRequest } from "../../types/products";
import {
  mapRestrictionsToEnum,
  mapRestrictionsToStrings,
  ProductTypeEnum,
} from "../../types/products";

interface FormData {
  name: string;
  description: string;
  price: string;
  restrictions: string[];
  sides: string[];
  admitsClarifications: "yes" | "no";
  productType: "food" | "drink";
  image?: File;
  existingImageUrl?: string;
}

const initialFormData: FormData = {
  name: "",
  description: "",
  price: "",
  restrictions: [],
  sides: [],
  admitsClarifications: "yes",
  productType: "food",
  existingImageUrl: undefined,
};

//TODO: Get from API
const restrictionOptions = [
  "Sin gluten",
  "Sin lactosa",
  "Sin azúcar",
  "Vegano",
];

interface ProductModalProps {
  productId?: string;
  title?: string;
}

export const ProductModal = ({ productId }: ProductModalProps) => {
  // Determine if we're in editing mode based on whether productId is provided
  const isEditing = !!productId;
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {}
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { closeModal, setSelectedModal } = useModalStore();

  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const invalidateProducts = useInvalidateProductsQueryKey();
  const invalidateProduct = useInvalidateProductQueryKey();

  // Get product data when editing
  const {
    data: productData,
    isLoading: isLoadingProduct,
    error: productError,
  } = useGetProductById(productId || "");
  const {
    data: activeSidesData,
    isLoading: isLoadingSides,
    error: sidesError,
  } = useGetActiveSides();

  // Transform active sides data to options format
  const sideOptions = activeSidesData?.data?.map((side) => side.name) || [];

  // Load product data when editing
  React.useEffect(() => {
    if (isEditing && productData) {
      setFormData({
        name: productData.name || "",
        description: productData.description || "",
        price: productData.price ? productData.price.toString() : "",
        restrictions: mapRestrictionsToStrings(productData.restrictions || []),
        sides: productData.sides || [],
        admitsClarifications: productData.admitsClarifications ? "yes" : "no",
        productType:
          productData.type === ProductTypeEnum.FOOD ? "food" : "drink",
        existingImageUrl: productData.photo,
      });
    }
  }, [isEditing, productData]);

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleImageChange = (file: File | undefined) => {
    handleInputChange("image", file);
  };

  const handleRemoveExistingImage = () => {
    handleInputChange("existingImageUrl", undefined);
  };

  const handleDeleteClick = () => {
    if (productId && productData) {
      setSelectedModal(ModalEnum.DELETE_CONFIRMATION_MODAL, {
        productId,
        productName: productData.name,
        photo: productData.photo,
        title: "¿Eliminar Producto?",
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.name.trim()) newErrors.name = "El nombre es obligatorio";
    if (!formData.description.trim())
      newErrors.description = "La descripción es obligatoria";
    if (!formData.price.trim()) newErrors.price = "El precio es obligatorio";
    if (isNaN(Number(formData.price.replace(/[^0-9]/g, "")))) {
      newErrors.price = "El precio debe ser un número válido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const productRequestData: CreateProductRequest = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price.replace(/[^0-9]/g, "")),
        restrictions: mapRestrictionsToEnum(formData.restrictions),
        sides: formData.sides,
        admitsClarifications: formData.admitsClarifications === "yes",
        type:
          formData.productType === "food"
            ? ProductTypeEnum.FOOD
            : ProductTypeEnum.BEVERAGE,
        stock: isEditing && productData ? productData.stock : 0,
      };

      if (isEditing && productId) {
        await updateProduct
          .mutateAsync({
            id: productId,
            data: productRequestData,
            file: formData.image,
          })
          .then(() => {
            toast.success("Producto actualizado exitosamente", {
              duration: 4000,
              style: {
                background: "var(--color-white)",
                color: "var(--color-success)",
              },
            });
            invalidateProducts();
            invalidateProduct(productId);
            closeModal();
          })
          .catch((error: any) => {
            toast.error(error?.message || "Error al actualizar el producto", {
              duration: 4000,
              style: {
                background: "var(--color-white)",
                color: "var(--color-error)",
              },
            });
          });
      } else {
        await createProduct
          .mutateAsync({
            data: productRequestData,
            file: formData.image,
          })
          .then(() => {
            toast.success("Producto creado exitosamente", {
              duration: 4000,
              style: {
                background: "var(--color-white)",
                color: "var(--color-success)",
              },
            });
            invalidateProducts();
            closeModal();
          })
          .catch((error: any) => {
            toast.error(error?.message || "Error al crear el producto", {
              duration: 4000,
              style: {
                background: "var(--color-white)",
                color: "var(--color-error)",
              },
            });
          });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state when editing and product is being fetched
  if (isEditing && isLoadingProduct) {
    return (
      <div className="w-full flex justify-center items-center py-8">
        <div className="text-gray-500">Cargando producto...</div>
      </div>
    );
  }

  // Show error state when editing and product failed to load
  if (isEditing && productError) {
    return (
      <div className="w-full flex justify-center items-center py-8">
        <div className="text-red-500">Error al cargar el producto</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="w-full flex flex-col gap-4">
        <div className="flex flex-row gap-6 py-2">
          {/* Image Upload Section - Left */}
          <div className="flex-shrink-0 w-[40%]">
            <ImageUpload
              image={formData.image}
              existingImageUrl={formData.existingImageUrl}
              onImageChange={handleImageChange}
              onRemoveExistingImage={handleRemoveExistingImage}
            />
          </div>

          {/* Form Fields Section - Right */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col gap-4">
              {/* Name */}
              <div>
                <CustomTextField
                  label="Nombre"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  error={!!errors.name}
                  helperText={errors.name}
                  fullWidth
                  required
                />
              </div>

              {/* Description */}
              <div>
                <CustomTextField
                  label="Descripción"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  error={!!errors.description}
                  helperText={errors.description}
                  fullWidth
                  multiline
                  required
                />
              </div>

              {/* Price */}
              <div>
                <CustomTextField
                  label="Precio"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  error={!!errors.price}
                  helperText={errors.price}
                  fullWidth
                  required
                  placeholder="$ 12000"
                  type="number"
                  prefix="$"
                />
              </div>

              {/* Restrictions */}
              <div>
                <CustomSelectField
                  label="Restricciones"
                  value={formData.restrictions}
                  onChange={(value) => handleInputChange("restrictions", value)}
                  options={restrictionOptions}
                  SelectProps={{ multiple: true }}
                  showChips={true}
                  error={!!errors.restrictions}
                  helperText={errors.restrictions}
                />
              </div>

              {/* Sides */}
              <div>
                <CustomSelectField
                  label="Guarniciones"
                  value={formData.sides}
                  onChange={(value) => handleInputChange("sides", value)}
                  options={sideOptions}
                  SelectProps={{
                    multiple: true,
                    disabled:
                      isLoadingSides ||
                      !!sidesError ||
                      sideOptions.length === 0,
                  }}
                  showChips={true}
                  error={!!errors.sides || !!sidesError}
                  helperText={
                    sidesError
                      ? "Error al cargar las guarniciones"
                      : isLoadingSides
                      ? "Cargando guarniciones..."
                      : sideOptions.length === 0
                      ? "No hay guarniciones disponibles"
                      : "Si no tiene guarniciones el plato, deje este espacio en blanco"
                  }
                />
              </div>

              {/* Allows Clarifications */}
              <div>
                <CustomRadioGroup
                  label="¿Admite aclaraciones?"
                  value={formData.admitsClarifications}
                  onChange={(value) =>
                    handleInputChange("admitsClarifications", value)
                  }
                  options={[
                    { value: "yes", label: "Si" },
                    { value: "no", label: "No" },
                  ]}
                />
              </div>

              {/* Product Type */}
              <div>
                <CustomRadioGroup
                  label="Tipo de producto:"
                  value={formData.productType}
                  onChange={(value) => handleInputChange("productType", value)}
                  options={[
                    { value: "food", label: "Comida" },
                    { value: "drink", label: "Bebida" },
                  ]}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div
          className={`flex items-center ${
            isEditing ? "justify-between" : "justify-center"
          }`}
        >
          {/* Delete Button - Only show when editing */}
          {isEditing && (
            <CustomButton
              variant="contained"
              onClick={handleDeleteClick}
              disabled={isSubmitting || isLoadingProduct}
              sx={{
                backgroundColor: "#ef4444",
                "&:hover": {
                  backgroundColor: "#dc2626",
                },
              }}
            >
              Eliminar Producto
            </CustomButton>
          )}

          {/* Cancel and Save Buttons - Always on the right */}
          <div className="flex gap-4">
            <CustomButton
              variant="outlined"
              onClick={closeModal}
              disabled={isSubmitting}
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
              onClick={handleSubmit}
              disabled={isSubmitting || (isEditing && isLoadingProduct)}
              loading={isSubmitting || (isEditing && isLoadingProduct)}
              sx={{
                backgroundColor: "var(--color-primary-500)",
                "&:hover": {
                  backgroundColor: "var(--color-primary-600)",
                },
              }}
            >
              {isEditing ? "Actualizar" : "Guardar"}
            </CustomButton>
          </div>
        </div>
      </div>
    </div>
  );
};
