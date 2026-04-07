import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Loader } from "../components/ui/Loader";
import { register } from "../services/api";

export function RegisterPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [strength, setStrength] = useState("");

  useEffect(() => {
    const calculateStrength = (pass) => {
      if (!pass) return "";
      if (pass.length < 6) return "Weak";
      if (pass.length <= 10) return "Medium";
      if (pass.length > 10 && /\d/.test(pass)) return "Strong";
      return "Medium";
    };
    setStrength(calculateStrength(formData.password));
  }, [formData.password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length === 0) {
      try {
        await register({
          email: formData.email,
          password: formData.password
        });
        setLoading(false);
        navigate("/login");
      } catch (error) {
        setErrors({ general: error.response?.data?.detail || "Registration failed. Please try again." });
        setLoading(false);
      }
    } else {
      setErrors(newErrors);
      setLoading(false);
    }
  };

  const strengthColor = {
    "Weak": "text-red-500",
    "Medium": "text-yellow-500",
    "Strong": "text-green-500"
  }[strength] || "text-gray-400";

  return (
    <div className="w-full">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-[#1E293B] mb-3 transition-colors duration-300">Create an account</h1>
        <p className="text-[#475569] transition-colors duration-300">Start analyzing your decisions today.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {errors.general && (
          <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium border border-red-100">
            {errors.general}
          </div>
        )}
        <Input
          label="Full Name"
          type="text"
          placeholder="John Doe"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          error={errors.name}
          className="bg-[#F0F5FF] border-[#D6E4FF] focus:bg-[#E6EEFF] transition-all"
        />
        <Input
          label="Email Address"
          type="email"
          placeholder="you@company.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          error={errors.email}
          className="bg-[#F0F5FF] border-[#D6E4FF] focus:bg-[#E6EEFF] transition-all"
        />
        <div className="space-y-2">
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            error={errors.password}
            className="bg-[#F0F5FF] border-[#D6E4FF] focus:bg-[#E6EEFF] transition-all"
          />
          {formData.password && (
            <p className={`text-xs font-bold ${strengthColor} ml-1`}>
              Password Strength: {strength}
            </p>
          )}
        </div>
        <Input
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          error={errors.confirmPassword}
          className="bg-[#F0F5FF] border-[#D6E4FF] focus:bg-[#E6EEFF] transition-all"
        />
        
        <div className="flex items-start gap-2 pt-2">
          <input type="checkbox" id="terms" className="mt-1 rounded border-[#D6E4FF] text-primary focus:ring-primary/20 transition-colors duration-300" required />
          <label htmlFor="terms" className="text-xs text-[#475569] leading-relaxed transition-colors duration-300">
            I agree to the <Link to="/terms" className="text-primary font-bold hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-primary font-bold hover:underline">Privacy Policy</Link>
          </label>
        </div>

        <Button type="submit" className="w-full h-12 text-lg font-bold shadow-lg shadow-primary/20" disabled={loading}>
          {loading ? <Loader className="h-5 w-5 border-white" /> : "Create Account"}
        </Button>
      </form>

      <div className="mt-6">
        <button className="w-full flex items-center justify-center gap-2 border border-[#D6E4FF] rounded-full px-4 py-3 bg-[#F0F5FF] text-[#1E293B] font-bold hover:bg-[#E6EEFF] transition-all shadow-sm">
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
          Continue with Google
        </button>
      </div>

      <div className="mt-8 text-center">
        <p className="text-[#475569] transition-colors duration-300">
          Already have an account?{" "}
          <Link to="/login" className="font-bold text-primary hover:underline transition-colors duration-300">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
