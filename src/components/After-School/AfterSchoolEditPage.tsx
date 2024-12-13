import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Input } from "@mantine/core";

// Program interface (for types)
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
  dateFrom: string;
  dateTo: string;
}

export default function AfterSchoolEditPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const programData = location.state as Program;

  const displayedProgramName = programData.programName;

  const [program, setProgram] = useState<Program>({ ...programData });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProgram((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Adjust textarea height if needed
    if (e.target instanceof HTMLTextAreaElement) {
      const textarea = e.target;
      textarea.style.height = "auto"; // Reset height
      textarea.style.height = `${textarea.scrollHeight}px`; // Adjust height dynamically
    }
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
        `https://southlakebackend.onrender.com/api/updateAfterSchoolProgram/${program.id}`,
        updatedProgram
      );
      toast.success("Program updated successfully!");
      navigate(-1);
    } catch (error) {
      setLoading(false);
      console.error("Failed to update program:", error);
      toast.error("Failed to update the program. Please try again.");
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
            <Input
              className="w-full  mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A3D16]"
              name="programName"
              value={program.programName}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label className="font-semibold text-[#1A3D16]">Price</label>
            <Input
              className="w-full  mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A3D16]"
              name="price"
              value={program.price.toString()}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label className="font-semibold text-[#1A3D16]">
              Slots Available
            </label>
            <Input
              className="w-full  mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A3D16]"
              name="slotsAvailable"
              value={program.slotsAvailable}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label className="font-semibold text-[#1A3D16]">Capacity</label>
            <Input
              className="w-full  mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A3D16]"
              name="capacity"
              value={program.capacity}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-bold text-[#1A3D16] mb-2">Details</h3>
        <div className="grid grid-cols-2 gap-6 text-sm">
          {/* Dates Sections Date From and DATE TO  */}
          <div>
            <label className="font-semibold text-[#1A3D16]">Date From</label>
            <Input
              className="w-full  mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A3D16]"
              name="dateFrom"
              type="date"
              value={program.dateFrom}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label className="font-semibold text-[#1A3D16]">Date To</label>
            <Input
              className="w-full  mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A3D16]"
              name="dateTo"
              type="date"
              value={program.dateTo}
              onChange={handleInputChange}
            />
          </div>

          {[
            { label: "Ages", name: "ages" },
            { label: "Location", name: "location" },
            { label: "Time", name: "time" },
            { label: "Days", name: "dates" },
            { label: "Discounts", name: "discounts" },
          ].map((field) => (
            <div key={field.name}>
              <label className="font-semibold text-[#1A3D16]">
                {field.label}
              </label>
              <Input
                className="w-full mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A3D16]"
                name={field.name}
                value={(program as any)[field.name]}
                onChange={handleInputChange}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-bold text-[#1A3D16] mb-4">Description</h3>
        <div className="space-y-4">
          {/* Class Experience (auto-resizing textarea) */}
          <div>
            <label className="font-semibold text-[#1A3D16]">
              Class Experience
            </label>
            <textarea
              name="classExperience"
              value={program.classExperience}
              onChange={handleInputChange}
              className="w-full p-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A3D16] resize-none"
              rows={3}
            />
          </div>

          {/* Cancellation Policy (auto-resizing textarea) */}
          <div>
            <label className="font-semibold text-[#1A3D16]">
              Cancellation Policy
            </label>
            <textarea
              name="cancellationPolicy"
              value={program.cancellationPolicy}
              onChange={handleInputChange}
              className="w-full p-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A3D16] resize-none"
              rows={3}
            />
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          disabled={loading}
          onClick={handleSave}
          className="py-2 px-4 bg-[#1A3D16] text-white rounded-md"
        >
          {loading ? "Loading..." : "Save Program"}
        </button>
      </div>
    </div>
  );
}
