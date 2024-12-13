import { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Loader } from "@mantine/core";

// Define the type for a program
interface Program {
  id: number;
  programName: string;
  price: number;
}

interface ProgramResponse {
  0: Program[]; // First element is an array of Programs
  1: Program; // Second element is a single Program object
}

export default function InPersonPrivateTutoring() {
  const navigate = useNavigate();
  const [programs, setPrograms] = useState<Program[]>([]); // State to store programs data

  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  // Fetch programs data from the backend using axios
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        // Fetching the data using the correct type (ProgramResponse)
        const response = await axios.get<ProgramResponse>(
          "https://southlakebackend.onrender.com/api/getAllPrivateAndTestPrep"
        );

        // Combine both parts of the response
        const combinedData = [
          ...response.data[0], // First array of programs
          response.data[1], // Second single program object (wrap in an array)
        ];

        setPrograms(combinedData); // Update state with the combined data
        setLoading(false);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          setError("Failed to fetch programs");
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
    navigate("/enrolled-students");
  };

  return (
    <div className="p-12 font-Montserrat">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#1A3D16] uppercase ">
          Inperson Private Tutoring
        </h2>
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
                  {program?.programName || "Prpgram Name"}
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-xl font-bold text-[#1A3D16]">
                  ${program.price}
                </span>
                <button
                  onClick={() => {
                    if (program.id === 18) {
                      navigate("/person-private-tutoring-lesson-edit-page", {
                        state: program,
                      });
                    } else {
                      navigate("/person-private-tutoring-edit-page", {
                        state: program,
                      });
                    }
                  }}
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
