import { useState } from "react";
import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { CustomTextField, CustomButton } from "../components";
import { useAuth } from "../contexts/AuthContext";
import { Logo } from "../assets/Logo";
import EyeOpenIcon from "../assets/icons/EyeOpenIcon";
import EyeClosedIcon from "../assets/icons/EyeClosedIcon";
import trayImage from "../assets/images/tray.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    if (isSubmitting) return;

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
            <div className="flex justify-center items-center">
              <Logo width={200} height={50} />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-10">
              <div className="flex flex-col gap-5">
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
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => handleFieldChange("password", e.target.value)}
                  onBlur={() => handleFieldBlur("password")}
                  size="medium"
                  fullWidth
                  aria-label="Password"
                  required
                  helperText={touched.password && errors.password}
                  disabled={isSubmitting}
                  rightIcon={showPassword ? (
                    <EyeOpenIcon width={20} height={20} />
                  ) : (
                    <EyeClosedIcon width={20} height={20} />
                  )}
                  onRightIconClick={() => setShowPassword((prev) => !prev)}
                />
              </div>
              {/* Login Button */}
              <div className="flex justify-center">
                <CustomButton
                  type="submit"
                  variant="contained"
                  fullWidth={false}
                  sx={{
                    backgroundColor: "var(--color-primary-500)",
                    "&:hover": {
                      backgroundColor: "var(--color-primary-600)",
                    },
                    position: "relative",
                  }}
                >
                  <span style={{ visibility: isSubmitting ? "hidden" : "visible" }}>
                    Iniciar sesión
                  </span>
                  {isSubmitting && (
                    <CircularProgress
                      size={16}
                      sx={{
                        color: "var(--color-white)",
                        position: "absolute",
                      }}
                    />
                  )}
                </CustomButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
