import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios
import { toast } from "react-toastify";

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
        "http://localhost:10000/api/loginAdmin",
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
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A3D16]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A3D16]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
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
