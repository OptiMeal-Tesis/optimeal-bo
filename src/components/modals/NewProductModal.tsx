import React, { useState } from "react";
import CustomTextField from "../CustomTextField";
import CustomButton from "../CustomButton";
import { ImageUpload, CustomSelectField, CustomRadioGroup } from "../";
import { useModalStore } from "../../stores/modalStore";
import {
  useCreateProduct,
  useInvalidateProducts,
} from "../../hooks/useProducts";
import { useGetActiveSides } from "../../hooks/useSides";
import toast from "react-hot-toast";

import type { CreateProductRequest } from "../../types/products";
import { mapRestrictionsToEnum, ProductTypeEnum } from "../../types/products";

interface FormData {
  name: string;
  description: string;
  price: string;
  restrictions: string[];
  sides: string[];
  allowsClarifications: "yes" | "no";
  productType: "food" | "drink";
  image?: File;
}

const initialFormData: FormData = {
  name: "",
  description: "",
  price: "",
  restrictions: [],
  sides: [],
  allowsClarifications: "yes",
  productType: "food",
};

//TODO: Get from API
const restrictionOptions = [
  "Sin gluten",
  "Sin lactosa",
  "Sin azúcar",
  "Vegano",
];

export const NewProductModal = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {}
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { closeModal } = useModalStore();

  const createProduct = useCreateProduct();
  const invalidateProducts = useInvalidateProducts();
  const {
    data: activeSidesData,
    isLoading: isLoadingSides,
    error: sidesError,
  } = useGetActiveSides();

  // Transform active sides data to options format
  const sideOptions = activeSidesData?.data?.map((side) => side.name) || [];

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleImageChange = (file: File | undefined) => {
    handleInputChange("image", file);
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
      const productData: CreateProductRequest = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price.replace(/[^0-9]/g, "")),
        restrictions: mapRestrictionsToEnum(formData.restrictions),
        sides: formData.sides,
        allowsClarifications: formData.allowsClarifications === "yes",
        type:
          formData.productType === "food"
            ? ProductTypeEnum.FOOD
            : ProductTypeEnum.BEVERAGE,
        stock: 0,
      };

      await createProduct
        .mutateAsync({
          data: productData,
          file: formData.image,
        })
        .then(() => {
          toast.success("Producto creado exitosamente", {
            duration: 4000,
            style: { background: "#10b981", color: "#fff" },
          });
          invalidateProducts();
          closeModal();
        })
        .catch((error: any) => {
          toast.error(error?.message || "Error al crear el producto", {
            duration: 4000,
            style: { background: "#ef4444", color: "#fff" },
          });
        });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <div className="w-full flex flex-col gap-4">
        <div className="flex flex-row gap-6 py-2">
          {/* Image Upload Section - Left */}
          <div className="flex-shrink-0 w-[40%]">
            <ImageUpload
              image={formData.image}
              onImageChange={handleImageChange}
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
                  value={formData.allowsClarifications}
                  onChange={(value) =>
                    handleInputChange("allowsClarifications", value)
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
        <div className="flex justify-center gap-4">
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
            disabled={isSubmitting}
            loading={isSubmitting}
            sx={{
              backgroundColor: "var(--color-primary-500)",
              "&:hover": {
                backgroundColor: "var(--color-primary-600)",
              },
            }}
          >
            Guardar
          </CustomButton>
        </div>
      </div>
    </div>
  );
};
