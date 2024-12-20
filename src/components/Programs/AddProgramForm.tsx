import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { toast } from "react-toastify";

interface AddProgramFormProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormDataType {
  programName: string;
  ages: string;
  location: string;
  dates: string;
  capacity: string;
  time: string;
  discounts: string;
  classExperience: string;
  cancellationPolicy: string;
  image: string | null; // Image URL from Cloudinary
  slotsAvailable: string;
  price: number;
  dateTo: string;
  dateFrom: string;
}

const AddProgramForm: React.FC<AddProgramFormProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<FormDataType>({
    programName: "",
    ages: "",
    location: "",
    dates: "",
    capacity: "",
    time: "",
    discounts: "",
    classExperience: "",
    cancellationPolicy: "",
    image: null,
    slotsAvailable: "",
    price: 0,
    dateTo: "",
    dateFrom: "",
  });

  const [imageSelected, setImageSelected] = useState<File | null>(null);
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormDataType, string>>
  >({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;

    if (name === "image" && files && files.length > 0) {
      const selectedFile = files[0];
      setImageSelected(selectedFile);
      setFormData((prevData) => ({
        ...prevData,
        image: selectedFile.name, // Temporary value for validation
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        image: "", // Clear error when a file is selected
      }));
      return;
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "price" ? parseFloat(value) : value, // Ensure price is a number
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "", // Clear specific field error
    }));
  };

  const handleImageUpload = async (): Promise<string | null> => {
    if (!imageSelected) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        image: "Please select an image to upload.",
      }));
      return null;
    }

    try {
      const cloudName = "dhrfgf2dz";
      const uploadPreset = "southlake";

      const cloudinaryFormData = new FormData();
      cloudinaryFormData.append("file", imageSelected);
      cloudinaryFormData.append("upload_preset", uploadPreset);

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
        cloudinaryFormData
      );

      return response.data.secure_url;
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      setErrors((prevErrors) => ({
        ...prevErrors,
        image: "Error uploading image. Please try again.",
      }));
      return null;
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const newErrors: Partial<Record<keyof FormDataType, string>> = {};
    Object.keys(formData).forEach((key) => {
      const fieldKey = key as keyof FormDataType;
      if (!formData[fieldKey] || (fieldKey === "image" && !imageSelected)) {
        newErrors[fieldKey] = ` required`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    const imageUrl = await handleImageUpload();
    if (!imageUrl) {
      setIsLoading(false);
      return;
    }

    const finalFormData = { ...formData, image: imageUrl };

    try {
      const response = await axios.post(
        "https://southlakebackend.onrender.com/api/createSingleProgram",
        finalFormData
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

        <h2 className="text-xl font-bold text-[#1A3D16] mb-6">
          Add New Program
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div>
            <label htmlFor="programName" className="text-xs">
              Program Name
            </label>
            <input
              type="text"
              name="programName"
              value={formData.programName}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
                errors.programName
                  ? "border-red-500"
                  : "focus:ring-2 focus:ring-[#1A3D16]"
              }`}
            />
            {errors.programName && (
              <p className="text-red-500 text-sm mt-1">{errors.programName}</p>
            )}
          </div>
          <div>
            <label htmlFor="slotsAvailable" className="text-xs">
              Slots Available
            </label>
            <input
              type="number"
              name="slotsAvailable"
              value={formData.slotsAvailable}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
                errors.slotsAvailable
                  ? "border-red-500"
                  : "focus:ring-2 focus:ring-[#1A3D16]"
              }`}
            />
            {errors.slotsAvailable && (
              <p className="text-red-500 text-sm mt-1">
                {errors.slotsAvailable}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="price" className="text-xs">
              Program Price
            </label>
            <input
              type="number"
              name="price"
              value={formData.price === 0 ? "" : formData.price}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
                errors.price
                  ? "border-red-500"
                  : "focus:ring-2 focus:ring-[#1A3D16]"
              }`}
            />
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">{errors.price}</p>
            )}
          </div>
          <div>
            <label htmlFor="ages" className="text-xs">
              Ages
            </label>
            <input
              type="text"
              name="ages"
              value={formData.ages}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
                errors.ages
                  ? "border-red-500"
                  : "focus:ring-2 focus:ring-[#1A3D16]"
              }`}
            />
            {errors.ages && (
              <p className="text-red-500 text-sm mt-1">{errors.ages}</p>
            )}
          </div>
          <div>
            <label htmlFor="location" className="text-xs">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
                errors.location
                  ? "border-red-500"
                  : "focus:ring-2 focus:ring-[#1A3D16]"
              }`}
            />
            {errors.location && (
              <p className="text-red-500 text-sm mt-1">{errors.location}</p>
            )}
          </div>
          <div>
            <label htmlFor="dates" className="text-xs">
              Days
            </label>
            <input
              type="text"
              name="dates"
              value={formData.dates}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
                errors.dates
                  ? "border-red-500"
                  : "focus:ring-2 focus:ring-[#1A3D16]"
              }`}
            />
            {errors.dates && (
              <p className="text-red-500 text-sm mt-1">{errors.dates}</p>
            )}
          </div>

          <div>
            <label htmlFor="dateTo" className="text-xs">
              Start Date
            </label>
            <input
              type="date"
              name="dateFrom"
              value={formData.dateFrom}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
                errors.dates
                  ? "border-red-500"
                  : "focus:ring-2 focus:ring-[#1A3D16]"
              }`}
            />
            {errors.dateFrom && (
              <p className="text-red-500 text-sm mt-1">{errors.dateFrom}</p>
            )}
          </div>

          <div>
            <label htmlFor="dateTo" className="text-xs">
              End Date
            </label>
            <input
              type="date"
              name="dateTo"
              value={formData.dateTo}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
                errors.dates
                  ? "border-red-500"
                  : "focus:ring-2 focus:ring-[#1A3D16]"
              }`}
            />
            {errors.dateTo && (
              <p className="text-red-500 text-sm mt-1">{errors.dateTo}</p>
            )}
          </div>

          <div>
            <label htmlFor="capacity" className="text-xs">
              Capacity
            </label>
            <input
              type="text"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
                errors.dates
                  ? "border-red-500"
                  : "focus:ring-2 focus:ring-[#1A3D16]"
              }`}
            />
            {errors.capacity && (
              <p className="text-red-500 text-sm mt-1">{errors.capacity}</p>
            )}
          </div>

          <div>
            <label htmlFor="time" className="text-xs">
              Time
            </label>
            <input
              type="text"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
                errors.time
                  ? "border-red-500"
                  : "focus:ring-2 focus:ring-[#1A3D16]"
              }`}
            />
            {errors.time && (
              <p className="text-red-500 text-sm mt-1">{errors.time}</p>
            )}
          </div>
          <div>
            <label htmlFor="discounts" className="text-xs">
              Discounts
            </label>
            <input
              type="text"
              name="discounts"
              value={formData.discounts}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
                errors.discounts
                  ? "border-red-500"
                  : "focus:ring-2 focus:ring-[#1A3D16]"
              }`}
            />
            {errors.discounts && (
              <p className="text-red-500 text-sm mt-1">{errors.discounts}</p>
            )}
          </div>
          <div>
            <label htmlFor="classExperience" className="text-xs">
              Class Experience
            </label>
            <input
              type="text"
              name="classExperience"
              value={formData.classExperience}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
                errors.classExperience
                  ? "border-red-500"
                  : "focus:ring-2 focus:ring-[#1A3D16]"
              }`}
            />
            {errors.classExperience && (
              <p className="text-red-500 text-sm mt-1">
                {errors.classExperience}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="time" className="text-xs">
              Cancellation Policy
            </label>
            <input
              type="text"
              name="cancellationPolicy"
              value={formData.cancellationPolicy}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
                errors.cancellationPolicy
                  ? "border-red-500"
                  : "focus:ring-2 focus:ring-[#1A3D16]"
              }`}
            />
            {errors.cancellationPolicy && (
              <p className="text-red-500 text-sm mt-1">
                {errors.cancellationPolicy}
              </p>
            )}
          </div>

          <div className="col-span-1 md:col-span-2">
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className={`w-full text-[#1A3D16] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#1A3D16] file:text-white hover:file:bg-[#1A3D16]/90 ${
                errors.image ? "border-red-500" : ""
              }`}
            />
            {errors.image && (
              <p className="text-red-500 text-sm mt-1">{errors.image}</p>
            )}
          </div>
        </form>

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
            onClick={handleSubmit}
            disabled={isLoading}
            className={`px-4 py-2 rounded-lg ${
              isLoading
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-[#1A3D16] text-white hover:bg-[#1A3D16]/90"
            }`}
          >
            {isLoading ? "Loading..." : "Add Program"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProgramForm;
