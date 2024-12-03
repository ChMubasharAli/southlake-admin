import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

interface Program {
  id: number;
  programName: string;
  ages: string;
  location: string;
  dates: string;
  capacity: string;
  time: string;
  discounts: string;
  classExperience: string;
  cancellationPolicy: string;
  image: string;
  slotsAvailable: string;
  price: number;
  numberOfHours: { hours: string; price: string }[]; // Updated structure
  createdAt?: Date;
  updatedAt?: Date;
}

export default function OnlinePrivateTutoringEditPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const programData = location.state as Program;

  const displayedProgramName = programData.programName;

  const [isLoading, setLoading] = useState<boolean>(false);
  const [program, setProgram] = useState<Program>({ ...programData });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProgram((prev) => ({
      ...prev,
      [name]: value,
    }));
    const textarea = e.target;
    textarea.style.height = "auto"; // Reset height
    textarea.style.height = `${textarea.scrollHeight}px`; // Adjust height dynamically
  };

  const handleSessionTypeChange = (
    index: number,
    field: "hours" | "price",
    value: string
  ) => {
    const updatedSessionTypes = [...program.numberOfHours];
    updatedSessionTypes[index][field] = value;
    setProgram((prev) => ({
      ...prev,
      sessionType: updatedSessionTypes,
    }));
  };

  const handleAddSessionType = () => {
    setProgram((prev) => ({
      ...prev,
      numberOfHours: [...prev.numberOfHours, { hours: "", price: "" }],
    }));
  };

  const handleRemoveSessionType = (index: number) => {
    const updatedSessionTypes = [...program.numberOfHours];
    updatedSessionTypes.splice(index, 1);
    setProgram((prev) => ({
      ...prev,
      numberOfHours: updatedSessionTypes, // Correct update
    }));
  };

  const handleImageUpload = async (): Promise<string> => {
    if (!imageFile) return program.image;

    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", "southlake");

    try {
      setLoading(true);
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/dhrfgf2dz/upload`,
        formData
      );
      return response.data.secure_url;
    } catch (error) {
      setLoading(false);
      console.error("Image upload failed:", error);
      toast.error("Image upload failed. Please try again.");
      return program.image;
    }
  };

  const handleSave = async () => {
    const imageUrl = await handleImageUpload();
    const updatedProgram = {
      ...program,
      image: imageUrl,
    };
    try {
      setLoading(true);
      await axios.put(
        `https://southlakebackend.onrender.com/api/updatePrivateAndTestPrep/${program.id}`,
        updatedProgram
      );
      toast.success("Program updated successfully!");
      navigate(-1);
    } catch (error) {
      setLoading(false);
      console.error("Failed to update program:", error);
      toast.error("Failed to update the program. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-12 flex flex-col gap-12 font-Montserrat">
      <h1 className="text-3xl font-bold text-[#1A3D16] mb-4 uppercase">
        {displayedProgramName}
      </h1>

      <div className="flex items-start space-x-8">
        <div className="w-[450px] h-[350px] bg-red-300 rounded-md">
          <img
            className="h-full w-full object-cover rounded-md"
            src={program.image}
            alt="Program"
          />
          <input
            type="file"
            onChange={(e) =>
              setImageFile(e.target.files ? e.target.files[0] : null)
            }
            className="mt-2"
          />
        </div>

        <div className="flex-1">
          <div className="mb-4">
            <label className="font-semibold text-[#1A3D16]">Program Name</label>
            <textarea
              className="w-full p-2 mt-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-[#1A3D16]"
              name="programName"
              value={program.programName}
              rows={1}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label className="font-semibold text-[#1A3D16]">Price</label>
            <textarea
              className="w-full p-2 mt-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-[#1A3D16]"
              name="price"
              value={program.price.toString()}
              rows={1}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label className="font-semibold text-[#1A3D16]">
              Slots Available
            </label>
            <textarea
              className="w-full p-2 mt-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-[#1A3D16]"
              name="slotsAvailable"
              value={program.slotsAvailable}
              rows={1}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-bold text-[#1A3D16] mb-2">Details</h3>
        <div className="grid grid-cols-2 gap-6 text-sm">
          {[
            { label: "Ages", name: "ages" },
            { label: "Location", name: "location" },
            { label: "Dates", name: "dates" },
            { label: "Capacity", name: "capacity" },
            { label: "Time", name: "time" },
            { label: "Discounts", name: "discounts" },
          ].map((field) => (
            <div key={field.name}>
              <label className="font-semibold text-[#1A3D16]">
                {field.label}
              </label>
              <textarea
                className="w-full p-2 mt-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-[#1A3D16]"
                name={field.name}
                value={(program as any)[field.name]}
                rows={1}
                onChange={handleInputChange}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-bold text-[#1A3D16] mb-4">Description</h3>
        <div className="space-y-4">
          <div>
            <label className="font-semibold text-[#1A3D16]">
              Class Experience
            </label>
            <textarea
              className="w-full p-2 mt-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-[#1A3D16]"
              name="classExperience"
              value={program.classExperience}
              rows={3}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="font-semibold text-[#1A3D16]">
              Cancellation Policy
            </label>
            <textarea
              className="w-full p-2 mt-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-[#1A3D16]"
              name="cancellationPolicy"
              value={program.cancellationPolicy}
              rows={3}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>

      {/* Session Type Section */}
      <div className="mt-6">
        <h3 className="text-lg font-bold text-[#1A3D16] mb-2">Session Types</h3>
        <div className="space-y-4">
          {program.numberOfHours.map((session, index) => (
            <div key={index} className="flex items-center space-x-4">
              <input
                type="text"
                placeholder="Session Name"
                className="w-1/2 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A3D16]"
                value={session.hours}
                onChange={(e) =>
                  handleSessionTypeChange(index, "hours", e.target.value)
                }
              />
              <input
                type="text"
                placeholder="Session Price"
                className="w-1/2 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A3D16]"
                value={session.price}
                onChange={(e) =>
                  handleSessionTypeChange(index, "price", e.target.value)
                }
              />
              <button
                className="px-4 py-2 text-white bg-red-500 rounded-md"
                onClick={() => handleRemoveSessionType(index)}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            className="px-4 py-2 text-white bg-blue-500 rounded-md"
            onClick={handleAddSessionType}
          >
            Add Product
          </button>
        </div>
      </div>

      <button
        className="px-4 py-2 self-end text-white rounded-md w-fit button-green font-Montserrat bg-[#1A3D16] border-2 border-[#1A3D16] hover:border-[#1A3D16] hover:!text-black font-semibold transition-all duration-300"
        onClick={handleSave}
      >
        {isLoading ? "Updating..." : "Save Data"}
      </button>
    </div>
  );
}
