import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { toast } from "react-toastify";

interface AddProgramFormProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormDataType {
  parentFirstName: string;
  parentLastName: string;
  firstName: string;
  lastName: string;
  address: string;
  zipCode: string; // Changed to string for empty initialization
  country: string;
  city: string;
  state: string;
  phone: string; // Changed to string for empty initialization
  email: string;
  amount?: string; // Made amount optional and changed to string for empty initialization
  registrationId: string; // Changed to string for empty initialization
}

const AddNewUserForm: React.FC<AddProgramFormProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<FormDataType>({
    registrationId: "",
    firstName: "",
    lastName: "",
    parentFirstName: "",
    parentLastName: "",
    address: "",
    zipCode: "",
    country: "",
    city: "",
    state: "",
    phone: "",
    email: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof FormDataType, string>>
  >({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Convert values to numbers when needed
    setFormData((prevData) => ({
      ...prevData,
      [name]:
        name === "zipCode" ||
        name === "phone" ||
        name === "registrationId" ||
        name === "amount"
          ? value === ""
            ? ""
            : value // Ensure empty string is allowed for optional numeric fields
          : value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "", // Clear specific field error
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const newErrors: Partial<Record<keyof FormDataType, string>> = {};
    Object.keys(formData).forEach((key) => {
      const fieldKey = key as keyof FormDataType;
      // Skip optional fields like 'amount'
      if (fieldKey !== "amount" && !formData[fieldKey]) {
        newErrors[fieldKey] = `This field is required`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        "https://southlakebackend.onrender.com/api/createRegistrationByAdmin",
        formData
      );
      console.log("Program created successfully:", response.data);
      toast.success("Program added successfully!");
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Error submitting form data:", error);
      toast.error("Failed to add program. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[95vh] overflow-y-auto p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          &#x2715;
        </button>

        <h2 className="text-xl font-bold text-[#1A3D16] mb-6">Add New User</h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Child First Name */}
          <div>
            <label htmlFor="firstName" className="text-xs">
              Child First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
                errors.firstName
                  ? "border-red-500"
                  : "focus:ring-2 focus:ring-[#1A3D16]"
              }`}
              placeholder="Enter child's first name"
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
            )}
          </div>

          {/* Child Last Name */}
          <div>
            <label htmlFor="lastName" className="text-xs">
              Child Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
                errors.lastName
                  ? "border-red-500"
                  : "focus:ring-2 focus:ring-[#1A3D16]"
              }`}
              placeholder="Enter child's last name"
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
            )}
          </div>

          {/* Parent First Name */}
          <div>
            <label htmlFor="parentFirstName" className="text-xs">
              Parent First Name
            </label>
            <input
              type="text"
              name="parentFirstName"
              value={formData.parentFirstName}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
                errors.parentFirstName
                  ? "border-red-500"
                  : "focus:ring-2 focus:ring-[#1A3D16]"
              }`}
              placeholder="Enter parent's first name"
            />
            {errors.parentFirstName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.parentFirstName}
              </p>
            )}
          </div>

          {/* Parent Last Name */}
          <div>
            <label htmlFor="parentLastName" className="text-xs">
              Parent Last Name
            </label>
            <input
              type="text"
              name="parentLastName"
              value={formData.parentLastName}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
                errors.parentLastName
                  ? "border-red-500"
                  : "focus:ring-2 focus:ring-[#1A3D16]"
              }`}
              placeholder="Enter parent's last name"
            />
            {errors.parentLastName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.parentLastName}
              </p>
            )}
          </div>

          {/* Address */}
          <div>
            <label htmlFor="address" className="text-xs">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
                errors.address
                  ? "border-red-500"
                  : "focus:ring-2 focus:ring-[#1A3D16]"
              }`}
              placeholder="Enter address"
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">{errors.address}</p>
            )}
          </div>

          {/* Zip Code */}
          <div>
            <label htmlFor="zipCode" className="text-xs">
              Zip Code
            </label>
            <input
              type="text" // Retained text input for empty initialization
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
                errors.zipCode
                  ? "border-red-500"
                  : "focus:ring-2 focus:ring-[#1A3D16]"
              }`}
              placeholder="Enter zip code"
            />
            {errors.zipCode && (
              <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>
            )}
          </div>

          {/* Country */}
          <div>
            <label htmlFor="country" className="text-xs">
              Country
            </label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
                errors.country
                  ? "border-red-500"
                  : "focus:ring-2 focus:ring-[#1A3D16]"
              }`}
              placeholder="Enter country"
            />
            {errors.country && (
              <p className="text-red-500 text-sm mt-1">{errors.country}</p>
            )}
          </div>

          {/* City */}
          <div>
            <label htmlFor="city" className="text-xs">
              City
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
                errors.city
                  ? "border-red-500"
                  : "focus:ring-2 focus:ring-[#1A3D16]"
              }`}
              placeholder="Enter city"
            />
            {errors.city && (
              <p className="text-red-500 text-sm mt-1">{errors.city}</p>
            )}
          </div>

          {/* State */}
          <div>
            <label htmlFor="state" className="text-xs">
              State
            </label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
                errors.state
                  ? "border-red-500"
                  : "focus:ring-2 focus:ring-[#1A3D16]"
              }`}
              placeholder="Enter state"
            />
            {errors.state && (
              <p className="text-red-500 text-sm mt-1">{errors.state}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="text-xs">
              Phone
            </label>
            <input
              type="text" // Retained text input for empty initialization
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
                errors.phone
                  ? "border-red-500"
                  : "focus:ring-2 focus:ring-[#1A3D16]"
              }`}
              placeholder="Enter phone number"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="text-xs">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
                errors.email
                  ? "border-red-500"
                  : "focus:ring-2 focus:ring-[#1A3D16]"
              }`}
              placeholder="Enter email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Amount */}
          <div>
            <label htmlFor="amount" className="text-xs">
              Amount (Optional)
            </label>
            <input
              type="text" // Retained text input for empty initialization
              name="amount"
              value={formData.amount || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A3D16]"
              placeholder="Enter amount (optional)"
            />
          </div>

          {/* Registration ID */}
          <div>
            <label htmlFor="registrationId" className="text-xs">
              Registration ID
            </label>
            <input
              type="text" // Retained text input for empty initialization
              name="registrationId"
              value={formData.registrationId}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
                errors.registrationId
                  ? "border-red-500"
                  : "focus:ring-2 focus:ring-[#1A3D16]"
              }`}
              placeholder="Enter registration ID"
            />
            {errors.registrationId && (
              <p className="text-red-500 text-sm mt-1">
                {errors.registrationId}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-[#1A3D16] rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-4 py-2 rounded-lg ${
                isLoading
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-[#1A3D16] text-white hover:bg-[#1A3D16]/90"
              }`}
            >
              {isLoading ? "Loading..." : "Add User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewUserForm;
