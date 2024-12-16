import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios
import { toast } from "react-toastify";
import { PasswordInput, TextInput } from "@mantine/core";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Check if the user is already authenticated via localStorage
  const isAuthenticated = !!localStorage.getItem("auth_token");

  // If already authenticated, redirect to the dashboard
  if (isAuthenticated) {
    navigate("/dashboard");
    return null; // Prevent rendering the login page
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      // Sending login request using axios
      const response = await axios.post(
        "https://southlakebackend.onrender.com/api/loginAdmin",
        {
          email,
          password,
        }
      );

      // Check if the response is successful
      if (response.status === 200) {
        setLoading(false);
        // Store the token in localStorage
        localStorage.setItem("auth_token", response.data.token);
        toast.success(response.data.message);
        navigate("/dashboard"); // Redirect after successful login
      }
    } catch (error: any) {
      setLoading(false);
      // Handle error (e.g., invalid credentials)
      if (error.response && error.response.data) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An error occurred during login");
      }
    }
  };

  return (
    <div className=" font-Montserrat flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-[#1A3D16] mb-6">
          Login
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <TextInput
              withAsterisk
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your Email"
            />
          </div>
          <div className="mb-6">
            <PasswordInput
              label="Password"
              withAsterisk
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            disabled={loading}
            type="submit"
            className="w-full cursor-pointer  block  py-2 text-center rounded-lg bg-[#1A3D16]  text-white"
          >
            {loading ? "Processing..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
