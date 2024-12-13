import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

interface Program {
  id: number;
  image: string;
  campTitle: string;
  campSubTitle: string;
  week1: string;
  week2: string;
  time: string;
  cost: string;
  minimumEnrollment: string;
  ageRequirement: string;
  description: string;
}

export default function SouthlakeCampEditPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const programData = location.state as Program;

  const displayedProgramName = programData.campTitle;

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
        `https://southlakebackend.onrender.com/api/editCamp/${program.id}`,
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
            <label className="font-semibold text-[#1A3D16]">Camp Name</label>
            <textarea
              className="w-full p-2 mt-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-[#1A3D16]"
              name="campTitle"
              value={program.campTitle}
              rows={1}
              onChange={handleInputChange}
            />
          </div>

          {/* Week 1  */}
          <div className="mb-4">
            <label className="font-semibold text-[#1A3D16]">Week 1:</label>
            <textarea
              className="w-full p-2 mt-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-[#1A3D16]"
              name="week1"
              value={program.week1}
              rows={1}
              onChange={handleInputChange}
            />
          </div>

          {/* Week 2  */}
          <div className="mb-4">
            <label className="font-semibold text-[#1A3D16]">Week 2:</label>
            <textarea
              className="w-full p-2 mt-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-[#1A3D16]"
              name="week2"
              value={program.week2}
              rows={1}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-bold text-[#1A3D16] mb-2">More Details</h3>
        <div className="grid grid-cols-2 gap-6 text-sm">
          {/* Time  */}
          <div className="mb-4">
            <label className="font-semibold text-[#1A3D16]">Time</label>
            <textarea
              className="w-full p-2 mt-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-[#1A3D16]"
              name="time"
              value={program.time}
              onChange={handleInputChange}
            />
          </div>
          {/* Cost  */}
          <div className="mb-4">
            <label className="font-semibold text-[#1A3D16]">Cost</label>
            <textarea
              className="w-full p-2 mt-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-[#1A3D16]"
              name="cost"
              value={program.cost}
              onChange={handleInputChange}
            />
          </div>
          {/* Minimum Enrollment  */}
          <div className="mb-4">
            <label className="font-semibold text-[#1A3D16]">
              Minimun Enrollment
            </label>
            <textarea
              className="w-full p-2 mt-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-[#1A3D16]"
              name="minimumEnrollment"
              value={program.minimumEnrollment}
              onChange={handleInputChange}
            />
          </div>
          {/* Age Requirement  */}
          <div className="mb-4">
            <label className="font-semibold text-[#1A3D16]">
              Age Requirement
            </label>
            <textarea
              className="w-full p-2 mt-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-[#1A3D16]"
              name="ageRequirement"
              value={program.ageRequirement}
              onChange={handleInputChange}
            />
          </div>
          {/* Description  */}
          <div className="mb-4 col-span-2">
            <label className="font-semibold text-[#1A3D16]">Description</label>
            <textarea
              className="w-full p-2 mt-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-[#1A3D16]"
              name="description"
              value={program.description}
              rows={3}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>

      <button
        disabled={isLoading}
        className="px-4 py-2 self-end text-white rounded-md w-fit button-green font-Montserrat bg-[#1A3D16] border-2 border-[#1A3D16] hover:border-[#1A3D16] hover:!text-black font-semibold transition-all duration-300"
        onClick={handleSave}
      >
        {isLoading ? "Updating..." : "Save Data"}
      </button>
    </div>
  );
}
