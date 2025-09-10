import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import { CloudUpload, Close } from "@mui/icons-material";

const ImageUploadArea = styled(Box)(() => ({
  width: "100%",
  height: "300px",
  border: "2px dashed #e0e0e0",
  borderRadius: "12px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  backgroundColor: "#fafafa",
  transition: "all 0.2s ease",
  "&:hover": {
    borderColor: "var(--color-primary-500)",
    backgroundColor: "#f5f5f5",
  },
  "&.has-image": {
    border: "none",
    backgroundColor: "transparent",
    position: "relative",
  },
}));

const ImagePreview = styled("img")({
  width: "100%",
  height: "100%",
  objectFit: "cover",
  borderRadius: "12px",
});

const RemoveImageButton = styled(IconButton)({
  position: "absolute",
  top: "8px",
  right: "8px",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  color: "white",
  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
});

interface ImageUploadProps {
  image?: File;
  onImageChange: (file: File | undefined) => void;
  accept?: string;
  className?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  image,
  onImageChange,
  accept = "image/*",
  className = "",
}) => {
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageChange(file);
    }
  };

  const handleRemoveImage = () => {
    onImageChange(undefined);
  };

  return (
    <ImageUploadArea
      className={`${image ? "has-image" : ""} ${className}`}
      onClick={() => !image && document.getElementById("image-upload")?.click()}
    >
      {image ? (
        <>
          <ImagePreview src={URL.createObjectURL(image)} alt="Image preview" />
          <RemoveImageButton size="small" onClick={handleRemoveImage}>
            <Close />
          </RemoveImageButton>
        </>
      ) : (
        <>
          <CloudUpload sx={{ fontSize: 48, color: "#9e9e9e", mb: 1 }} />
          <Typography
            variant="body2"
            color="primary"
            sx={{
              fontFamily: "var(--font-family-sans)",
              color: "var(--color-primary-500)",
            }}
          >
            Agregar foto
          </Typography>
        </>
      )}
      <input
        id="image-upload"
        type="file"
        accept={accept}
        onChange={handleImageUpload}
        style={{ display: "none" }}
      />
    </ImageUploadArea>
  );
};
