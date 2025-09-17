import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { CustomTextField, CustomButton } from "../components";
import { useAuth } from "../contexts/AuthContext";
import optimealLogo from "../assets/images/optimeal-logo.png";
import trayImage from "../assets/images/tray.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const [touched, setTouched] = useState<{ email: boolean; password: boolean }>(
    {
      email: false,
      password: false,
    }
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = "El email es requerido";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "El email no es válido";
    }

    if (!password.trim()) {
      newErrors.password = "La contraseña es requerida";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({ email: true, password: true });

    if (validateForm()) {
      setIsSubmitting(true);

      try {
        await login({ email, password });
        navigate("/orders", { replace: true });
      } catch (error) {
        toast.error(
          "Credenciales inválidas. Por favor, verifica tu email y contraseña.",
          {
            duration: 3000,
            style: {
              background: "var(--color-white)",
              color: "var(--color-gray-600)",
            },
          }
        );
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleFieldChange = (field: "email" | "password", value: string) => {
    if (field === "email") {
      setEmail(value);
    } else {
      setPassword(value);
    }
  };

  const handleFieldBlur = (field: "email" | "password") => {
    setTouched((prev) => ({ ...prev, [field]: true }));

    // Validate individual field on blur
    if (field === "email" && touched.email) {
      if (!email.trim()) {
        setErrors((prev) => ({ ...prev, email: "El email es requerido" }));
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        setErrors((prev) => ({ ...prev, email: "El email no es válido" }));
      }
    }

    if (field === "password" && touched.password) {
      if (!password.trim()) {
        setErrors((prev) => ({
          ...prev,
          password: "La contraseña es requerida",
        }));
      }
    }
  };

  return (
    <div className="bg-primary-600 flex items-center justify-center p-4 h-screen w-screen">
      {/* Login Card */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden py-20 px-24">
        <div className="flex flex-col md:flex-row gap-24">
          {/* Left Column - Image */}
          <div className="md:w-1/2">
            <div className="relative">
              <img
                src={trayImage}
                alt="Cafeteria tray with healthy food"
                className="w-full h-full object-cover rounded-l-2xl md:rounded-l-2xl md:rounded-r-none"
              />
            </div>
          </div>

          {/* Vertical Divider */}
          <div className="hidden md:block w-0.5 rounded-full bg-primary-500"></div>

          {/* Right Column - Logo and Form */}
          <div className="flex flex-col justify-center gap-10 w-1/2">
            {/* OptiMeal Logo */}
            <div>
              <img
                src={optimealLogo}
                alt="OptiMeal Logo"
                className="mx-auto max-w-[240px] h-auto"
              />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <CustomTextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => handleFieldChange("email", e.target.value)}
                onBlur={() => handleFieldBlur("email")}
                size="medium"
                fullWidth
                aria-label="Email address"
                required
                helperText={touched.email && errors.email}
                disabled={isSubmitting}
              />

              <CustomTextField
                label="Contraseña"
                type="password"
                value={password}
                onChange={(e) => handleFieldChange("password", e.target.value)}
                onBlur={() => handleFieldBlur("password")}
                size="medium"
                fullWidth
                aria-label="Password"
                required
                helperText={touched.password && errors.password}
                disabled={isSubmitting}
              />
            </form>

            {/* Login Button */}
            <div className="flex justify-center">
              <CustomButton
                type="submit"
                variant="contained"
                fullWidth={false}
                onClick={handleSubmit}
                disabled={isSubmitting}
                loading={isSubmitting}
                sx={{
                  backgroundColor: "var(--color-primary-500)",
                  "&:hover": {
                    backgroundColor: "var(--color-primary-600)",
                  },
                  "&:disabled": {
                    backgroundColor: "var(--color-primary-300)",
                  },
                }}
              >
                Iniciar sesión
              </CustomButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
