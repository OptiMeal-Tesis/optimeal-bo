import React from "react";
import { useNavigate } from "react-router-dom";
import { CustomButton } from "../components";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/login");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-h1-bold text-gray-800 mb-4">
            ¡Ups! Página no encontrada
          </h1>
          <p className="text-sub1 text-gray-600 mb-2">
            La página que buscas no existe o ha sido movida.
          </p>
          <p className="text-body1 text-gray-500">
            Pero no te preocupes, podemos ayudarte a encontrar lo que necesitas.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4">
          <CustomButton
            onClick={handleGoHome}
            sx={{
              width: "100%",
              backgroundColor: "var(--color-primary-500)",
              color: "white",
              "&:hover": {
                backgroundColor: "var(--color-primary-600)",
              },
            }}
          >
            Ir al Inicio
          </CustomButton>

          <CustomButton
            onClick={handleGoBack}
            variant="outlined"
            sx={{
              width: "100%",
              border: "2px solid var(--color-primary-500)",
              color: "var(--color-primary-500)",
              "&:hover": {
                backgroundColor: "rgba(13, 71, 161, 0.1)",
                borderColor: "var(--color-primary-600)",
              },
            }}
          >
            ← Volver Atrás
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
