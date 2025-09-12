import React, { useMemo, useState } from "react";
import CustomButton from "../CustomButton";
import CustomTextField from "../CustomTextField";
import {
  useDeleteSide,
  useInvalidateSides,
  useGetAllSides,
  useCreateSide,
  useUpdateSideActive,
} from "../../hooks/useSides";
import { useModalStore } from "../../stores/modalStore";
import type { Side } from "../../types/sides";
import { Loader } from "..";
import { TrashIcon } from "../../assets/icons/TrashIcon";

interface SidesModalProps {
  title?: string;
}

export const SidesModal: React.FC<SidesModalProps> = () => {
  const { data, isLoading } = useGetAllSides();
  const createSide = useCreateSide();
  const deleteSide = useDeleteSide();
  const updateActive = useUpdateSideActive();
  const invalidate = useInvalidateSides();
  const { closeModal } = useModalStore();

  const sides: Side[] = useMemo(() => data?.data ?? [], [data]);

  const [newSide, setNewSide] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleAdd = async () => {
    const name = newSide.trim();
    if (!name) return;
    setSubmitting(true);
    try {
      await createSide.mutateAsync({ name });
      setNewSide("");
      invalidate();
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    setSubmitting(true);
    try {
      await deleteSide.mutateAsync({ id });
      invalidate();
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (side: Side) => {
    setSubmitting(true);
    try {
      await updateActive.mutateAsync({
        id: side.id,
        data: { isActive: !side.isActive },
      });
      invalidate();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 max-h-[36vh] overflow-auto pr-2">
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
              <div
                key={side.id}
                className="flex items-center justify-between py-1"
              >
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-[var(--color-primary-500)]"
                    checked={side.isActive}
                    onChange={() => handleToggle(side)}
                  />
                  <span className="text-gray-800">{side.name}</span>
                </label>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <CustomButton
                    onClick={() => handleDelete(side.id)}
                    sx={{ padding: 0, minWidth: 0 }}
                  >
                    <TrashIcon color="var(--color-red-500)" />
                  </CustomButton>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex items-center gap-2 pt-2">
          <div className="flex-1">
            <CustomTextField
              label="Nueva guarnición"
              value={newSide}
              onChange={(e) => setNewSide(e.target.value)}
              fullWidth
            />
          </div>
          <CustomButton
            onClick={handleAdd}
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
        </div>

        <div className="flex justify-center gap-4 pt-2">
          <CustomButton
            variant="outlined"
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
            onClick={closeModal}
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
