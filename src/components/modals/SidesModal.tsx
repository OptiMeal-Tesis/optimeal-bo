import React, { useMemo, useState } from "react";
import CustomButton from "../CustomButton";
import CustomTextField from "../CustomTextField";
import { CustomRadioGroup } from "../CustomRadioGroup";
import {
  useDeleteSide,
  useGetAllSides,
  useCreateSide,
  useUpdateSide,
} from "../../hooks/useSides";
import { useModalStore } from "../../stores/modalStore";
import type { Side } from "../../types/sides";
import { Loader } from "..";
import { TrashIcon } from "../../assets/icons/TrashIcon";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

interface SidesModalProps {
  title?: string;
}

export const SidesModal: React.FC<SidesModalProps> = () => {
  const { data, isLoading } = useGetAllSides();
  const createSide = useCreateSide();
  const deleteSide = useDeleteSide();
  const updateSide = useUpdateSide();
  const { closeModal } = useModalStore();
  const queryClient = useQueryClient();
  
  const sides: Side[] = useMemo(() => data?.data ?? [], [data]);

  const [newSide, setNewSide] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editedSides, setEditedSides] = useState<
    Record<number, { name: string; isActive: boolean }>
  >({});

  const handleAdd = async () => {
    const name = newSide.trim();
    if (!name) return;
    setSubmitting(true);
    try {
      await createSide.mutateAsync({ name });
      toast.success("Guarnición creada exitosamente", {
        duration: 4000,
        style: {
          background: "var(--color-white)",
          color: "var(--color-gray-600)",
        },
      });
      setNewSide("");
      queryClient.invalidateQueries({ queryKey: ['sides'] });

    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    setSubmitting(true);
    try {
      await deleteSide.mutateAsync({ id });
      toast.success("Guarnición eliminada exitosamente", {
        duration: 4000,
        style: {
          background: "var(--color-white)",
          color: "var(--color-gray-600)",
        },
      });
      queryClient.invalidateQueries({ queryKey: ['sides'] });
    } finally {
      setSubmitting(false);
    }
  };

  const handleNameChange = (sideId: number, newName: string) => {
    setEditedSides((prev) => ({
      ...prev,
      [sideId]: {
        ...prev[sideId],
        name: newName,
        isActive:
          prev[sideId]?.isActive ??
          sides.find((s) => s.id === sideId)?.isActive ??
          false,
      },
    }));
  };

  const handleAvailabilityChange = (sideId: number, isActive: boolean) => {
    setEditedSides((prev) => ({
      ...prev,
      [sideId]: {
        ...prev[sideId],
        name:
          prev[sideId]?.name ?? sides.find((s) => s.id === sideId)?.name ?? "",
        isActive,
      },
    }));
  };

  const handleSave = async () => {
    setSubmitting(true);
    try {
      const updatePromises = Object.entries(editedSides).map(
        ([sideId, changes]) =>
          updateSide.mutateAsync({
            id: parseInt(sideId),
            data: changes,
          })
      );

      await Promise.all(updatePromises);
      setEditedSides({});
      queryClient.invalidateQueries({ queryKey: ['sides'] });

      toast.success("Guarniciones actualizadas exitosamente", {
        duration: 4000,
        style: {
          background: "var(--color-white)",
          color: "var(--color-gray-600)",
        },
      });
      closeModal();
    } catch (error) {
      toast.error("Error al actualizar las guarniciones", {
        duration: 4000,
        style: {
          background: "var(--color-white)",
          color: "var(--color-gray-600)",
        },
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 max-h-[36vh] overflow-auto">
          {isLoading ? (
            <Loader />
          ) : sides.length === 0 ? (
            <div className="flex items-center justify-center py-4">
              <span className="text-gray-500 text-center">
                No hay guarniciones disponibles
              </span>
            </div>
          ) : (
            sides.map((side) => (
              <div key={side.id} className="pt-2">
                <div className="flex items-center justify-between">
                  <div className="flex flex-row gap-6">
                    <div className="min-w-[30%]">
                      <CustomTextField
                        label="Guarnición"
                        value={editedSides[side.id]?.name ?? side.name}
                        onChange={(e) =>
                          handleNameChange(side.id, e.target.value)
                        }
                      />
                    </div>

                    <div className="flex-1 -mt-2">
                      <CustomRadioGroup
                        label="Disponible"
                        value={
                          editedSides[side.id]?.isActive ?? side.isActive
                            ? "si"
                            : "no"
                        }
                        onChange={(value: string) => {
                          const newActive = value === "si";
                          handleAvailabilityChange(side.id, newActive);
                        }}
                        options={[
                          { value: "si", label: "Si" },
                          { value: "no", label: "No" },
                        ]}
                        vertical={true}
                      />
                    </div>
                  </div>

                  <div className="flex items-center">
                    <CustomButton
                      onClick={() => handleDelete(side.id)}
                      sx={{
                        padding: 0,
                        minWidth: 0,
                        "&:hover": {
                          backgroundColor: "transparent",
                        },
                      }}
                    >
                      <TrashIcon color="var(--color-red-500)" />
                    </CustomButton>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!newSide.trim() || submitting) return;
            void handleAdd();
          }}
          className="flex items-center gap-2 pt-2"
        >
          <div className="flex-1">
            <CustomTextField
              label="Nueva guarnición"
              value={newSide}
              onChange={(e) => setNewSide(e.target.value)}
              fullWidth
            />
          </div>
          <CustomButton
            type="submit"
            disabled={submitting || !newSide.trim()}
            sx={{
              height: 56,
              borderColor: `${
                !newSide.trim()
                  ? "var(--color-gray-200)"
                  : "var(--color-primary-500)"
              }`,
              borderWidth: "1.5px",
              borderStyle: "solid",
              color: `${
                !newSide.trim()
                  ? "var(--color-primary-500)"
                  : "var(--color-primary-500)"
              }`,
              "&:hover": {
                borderColor: "var(--color-primary-500)",
              },
            }}
          >
            Agregar
          </CustomButton>
        </form>

        <div className="flex justify-center gap-4 pt-2">
          <CustomButton
            variant="outlined"
            type="button"
            onClick={closeModal}
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
            type="button"
            onClick={handleSave}
            disabled={submitting || Object.keys(editedSides).length === 0}
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

export default SidesModal;
