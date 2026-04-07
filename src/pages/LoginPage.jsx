import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Loader } from "../components/ui/Loader";
import { login as loginApi } from "../services/api";
import { useAuth } from "../hooks/useAuth";

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await loginApi(formData);
        const { access_token, refresh_token } = response.data;
        localStorage.setItem("refresh_token", refresh_token);
        // Call auth context login so user state is populated
        login({
          token: access_token,
          email: formData.email,
        });
        setLoading(false);
        navigate("/dashboard");
      } catch (error) {
        setErrors({ general: error.response?.data?.detail || "Login failed. Please check your credentials." });
        setLoading(false);
      }
    } else {
      setErrors(newErrors);
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-[#1E293B] mb-3 transition-colors duration-300">Welcome back</h1>
        <p className="text-[#475569] transition-colors duration-300">Please enter your details to sign in.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {errors.general && (
          <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium border border-red-100">
            {errors.general}
          </div>
        )}
        <Input
          label="Email Address"
          type="email"
          placeholder="you@company.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          error={errors.email}
          className="bg-[#F0F5FF] border-[#D6E4FF] focus:bg-[#E6EEFF] transition-all"
        />
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-[#1E293B] ml-1">Password</label>
          </div>
          <Input
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            error={errors.password}
            className="bg-[#F0F5FF] border-[#D6E4FF] focus:bg-[#E6EEFF] transition-all"
          />
        </div>

        <Button type="submit" className="w-full h-12 text-lg font-bold shadow-lg shadow-primary/20" disabled={loading}>
          {loading ? <Loader className="h-5 w-5 border-white" /> : "Sign In"}
        </Button>
      </form>

      <div className="mt-10 text-center">
        <p className="text-[#475569] transition-colors duration-300">
          Don't have an account?{" "}
          <Link to="/register" className="font-bold text-primary hover:underline transition-colors duration-300">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
