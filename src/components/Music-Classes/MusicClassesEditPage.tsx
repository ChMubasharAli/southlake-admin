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
  description: string;
  image: string;
  slotsAvailable: string;
  amount: number;
  lessonLength: { name: string; price: string }[]; // Updated structure
  createdAt?: Date;
  updatedAt?: Date;
}

export default function MusicClassesEditPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const programData = location.state as Program;

  const [isLoading, setLoading] = useState<boolean>(false);
  const [program, setProgram] = useState<Program>({ ...programData });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const displayedProgramName = programData.programName;
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
    const updatedLessonLength = [...program.lessonLength]; // Make a copy of lessonLength
    updatedLessonLength[index][field] = value.trimStart(); // Update the specific field
    setProgram((prev) => ({
      ...prev,
      lessonLength: updatedLessonLength, // Correct the property name here
    }));
  };

  const handleAddSessionType = () => {
    setProgram((prev) => ({
      ...prev,
      lessonLength: [...prev.lessonLength, { name: "", price: "" }], // Add new session
    }));
  };

  const handleRemoveSessionType = (index: number) => {
    const updatedLessonLength = [...program.lessonLength]; // Make a copy of lessonLength
    updatedLessonLength.splice(index, 1); // Remove the session at the given index
    setProgram((prev) => ({
      ...prev,
      lessonLength: updatedLessonLength, // Correct the property name here
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
        `https://southlakebackend.onrender.com/api/updateMusicProgram/${program.id}`,
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
            <label className="font-semibold text-[#1A3D16]">
              Starting Price
            </label>
            <textarea
              className="w-full p-2 mt-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-[#1A3D16]"
              name="amount"
              value={program.amount.toString()}
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

      <div className="mt-8">
        <h3 className="text-lg font-bold text-[#1A3D16] ">Description</h3>
        <div className="space-y-4">
          {/* Class Experience (auto-resizing textarea) */}
          <div>
            <textarea
              name="description"
              value={program.description}
              onChange={handleInputChange}
              className="w-full p-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A3D16] resize-none"
              rows={3}
            />
          </div>
        </div>
      </div>

      {/* Session Type Section */}
      <div className="mt-6">
        <h3 className="text-lg font-bold text-[#1A3D16] mb-2">Session Types</h3>
        <div className="space-y-4">
          {program.lessonLength.map((session, index) => (
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
