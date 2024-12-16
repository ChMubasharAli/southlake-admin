import { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Loader } from "@mantine/core";

// Define the type for a program
interface Program {
  id: number;
  programName: string;
  amount: number;
}

export default function AfterSchool() {
  const navigate = useNavigate();
  const [programs, setPrograms] = useState<Program[]>([]); // State to store programs data

  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  // Fetch programs data from the backend using axios
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await axios.get<Program[]>(
          "https://southlakebackend.onrender.com/api/getAllMusicPrograms"
        );
        setPrograms(response.data); // Update state with fetched data
        setLoading(false);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || "Failed to fetch programs");
        } else {
          setError("An unexpected error occurred");
        }
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  // Navigate to Enrolled Student Page
  const gotoEnrolledStudentPage = () => {
    navigate("/music-classes-enrolled-students");
  };

  return (
    <div className="p-12 font-Montserrat">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#1A3D16] uppercase ">
          Music Classes
        </h2>
        -
        <div className="flex gap-8 items-center">
          <button
            onClick={gotoEnrolledStudentPage}
            className="px-4 py-2 text-white rounded-md w-fit button-green font-Montserrat bg-[#1A3D16] border-2 border-[#1A3D16] hover:border-[#1A3D16] hover:!text-black font-semibold transition-all duration-300"
          >
            Enrolled Students
          </button>
        </div>
      </div>

      {/* Show loading spinner or error message */}
      {loading && (
        <div className=" h-[50vh] flex items-center justify-center ">
          <Loader color="#1A3D16" size="lg" />
        </div>
      )}
      {error && <p className="text-red-500">{error}</p>}

      {/* Render programs only when data is available */}
      {!loading && !error && (
        <div className="space-y-4">
          {programs.map((program, index) => (
            <div
              key={program.id}
              className="flex items-center justify-between p-4 bg-gray-200 rounded-lg shadow"
            >
              <div className="flex items-center space-x-4">
                <span className="text-xl font-bold text-[#1A3D16]">
                  {index + 1}.
                </span>
                <span className="text-lg font-semibold text-[#1A3D16] uppercase">
                  {program.programName}
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-xl font-bold text-[#1A3D16]">
                  ${program.amount}
                </span>
                <button
                  onClick={() =>
                    navigate("/music-classes-edit-page", { state: program })
                  }
                  className="flex items-center px-3 py-2 bg-[#1A3D16] text-white rounded hover:bg-[#1A3D16]/90"
                >
                  <FaEdit className="mr-2" size={16} />
                  EDIT
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
