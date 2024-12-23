import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

interface Program {
  id: number;
  programName: string;
  description: string;
  slotsAvailable: string;
  slotsComplete: string;
  price: number;
  image: string;
  sessionType: { name: string; price: string }[]; // Updated structure
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
    field: "name" | "price",
    value: string
  ) => {
    const updatedSessionTypes = [...program.sessionType];
    updatedSessionTypes[index][field] = value;
    setProgram((prev) => ({
      ...prev,
      sessionType: updatedSessionTypes,
    }));
  };

  const handleAddSessionType = () => {
    setProgram((prev) => ({
      ...prev,
      sessionType: [...prev.sessionType, { name: "", price: "" }],
    }));
  };

  const handleRemoveSessionType = (index: number) => {
    const updatedSessionTypes = [...program.sessionType];
    updatedSessionTypes.splice(index, 1);
    setProgram((prev) => ({
      ...prev,
      sessionType: updatedSessionTypes,
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
        `https://southlakebackend.onrender.com/api//updateOnlinePrivateTutoring/${program.id}`,
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
          {/* Program Name Editable  */}
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
          {/* Program Price  */}
          <div className="mb-4">
            <label className="font-semibold text-[#1A3D16]">
              Starting Price
            </label>
            <textarea
              className="w-full p-2 mt-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-[#1A3D16]"
              name="price"
              value={program.price.toString()}
              rows={1}
              onChange={handleInputChange}
            />
          </div>
          {/* Slots Available  */}
          <div className="mb-4">
            <label className="font-semibold text-[#1A3D16]">
              Slots Available
            </label>
            <textarea
              className="w-full p-2 mt-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-[#1A3D16]"
              name="slotsAvailable"
              value={program.slotsAvailable.toString()}
              rows={1}
              onChange={handleInputChange}
            />
          </div>
          {/* Program Price  */}
          <div className="mb-4">
            <label className="font-semibold text-[#1A3D16]">
              Slots Completed
            </label>
            <textarea
              className="w-full p-2 mt-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-[#1A3D16]"
              name="slotsComplete"
              value={program.slotsComplete.toString()}
              rows={1}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>

      {/* Session Type Section */}
      <div className="mt-6">
        {/* Program Description  */}
        <div className="mb-4">
          <label className="font-semibold text-[#1A3D16]">Description</label>
          <textarea
            className="w-full p-2 mt-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-[#1A3D16]"
            name="description"
            value={program.description}
            rows={3}
            onChange={handleInputChange}
          />
        </div>
        <h3 className="text-lg font-bold text-[#1A3D16] mb-2">Session Types</h3>
        <div className="space-y-4">
          {program.sessionType.map((session, index) => (
            <div key={index} className="flex items-center space-x-4">
              <input
                type="text"
                placeholder="Session Name"
                className="w-1/2 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A3D16]"
                value={session.name}
                onChange={(e) =>
                  handleSessionTypeChange(index, "name", e.target.value)
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
            Add Session
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
