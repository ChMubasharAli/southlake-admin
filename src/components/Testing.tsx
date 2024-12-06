import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import { FaDownload } from "react-icons/fa";

interface ProgramData {
  [key: string]: any;
}

interface StudentData {
  parentFirstName: string;
  parentLastName: string;
  registrationId: number;
  amount: string;
  AfterSchoolProgramForms: ProgramData[];
  MusciProgramForms: ProgramData[];
  OnlineTutoringForms: ProgramData[];
  PrivateAndTestPrepForms: ProgramData[];
  SingleProgramForms: ProgramData[];
  CampForms: ProgramData[];
}

const EnrolledStudents: React.FC = () => {
  const [data, setData] = useState<StudentData[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(
        "https://southlakebackend.onrender.com/api/allUserPaymentHitory"
      );
      setData(response.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDownload = (
    registrationId: number,
    programName: string,
    programData: ProgramData[]
  ) => {
    if (programData?.length === 0) return;

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`${programName} Details`, 10, 10);
    doc.setFontSize(12);

    doc.text(`Registration ID: ${registrationId}`, 10, 20);

    let yOffset = 30;
    programData.forEach((item, index) => {
      doc.text(`Entry ${index + 1}:`, 10, yOffset);
      yOffset += 10;
      Object.entries(item).forEach(([key, value]) => {
        doc.text(`${key}: ${value}`, 10, yOffset);
        yOffset += 10;
        if (yOffset > 270) {
          doc.addPage();
          yOffset = 10;
        }
      });
    });

    doc.save(`${programName}_Registration_${registrationId}.pdf`);
  };

  // Filter data based on the search query
  const filteredData = data.filter(
    (student) =>
      student.parentFirstName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      student.parentLastName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      student.registrationId.toString().includes(searchQuery)
  );

  return (
    <div className="p-6 max-w-full mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#1A3D16] ">Pyments Details</h2>
      </div>
      <div className="max-w-full mx-auto bg-white ">
        {/* Search Input */}
        <div className="rounded-lg shadow-lg">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Parent Name or Registration ID"
            className="w-full p-3 mb-6 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Table for Displaying Enrolled Students */}
        <table className="min-w-full bg-white border border-gray-300 shadow-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left text-[#1A3D16] uppercase">
                Registration ID
              </th>
              <th className="py-3 px-6 text-left text-[#1A3D16] uppercase">
                Parent Name
              </th>
              <th className="py-3 px-6 text-left text-[#1A3D16] uppercase">
                Amount
              </th>
              <th className="py-3 px-6 text-left text-[#1A3D16] uppercase">
                After School Program
              </th>
              <th className="py-3 px-6 text-left text-[#1A3D16] uppercase">
                Music Program
              </th>
              <th className="py-3 px-6 text-left text-[#1A3D16] uppercase">
                Online Tutoring
              </th>
              <th className="py-3 px-6 text-left text-[#1A3D16] uppercase">
                Private & Test Prep
              </th>
              <th className="py-3 px-6 text-left text-[#1A3D16] uppercase">
                Single Program
              </th>
              <th className="py-3 px-6 text-left text-[#1A3D16] uppercase">
                Camp Forms
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((student) => (
              <tr
                key={student.registrationId}
                className="border-b border-gray-300 hover:bg-gray-100"
              >
                <td className="py-3 px-6 text-left">
                  {student.registrationId}
                </td>
                <td className="py-3 px-6 text-left">
                  {student.parentFirstName} {student.parentLastName}
                </td>
                <td className="py-3 px-6 text-left ">${student.amount}</td>
                <td className="py-3 px-6 text-center ">
                  {(student.AfterSchoolProgramForms?.length || 0) > 0 && (
                    <FaDownload
                      onClick={() =>
                        handleDownload(
                          student.registrationId,
                          "After School Program",
                          student.AfterSchoolProgramForms || []
                        )
                      }
                      size={16}
                      title="Download PDF"
                      className="cursor-pointer text-[#1A3D16] hover:text-[#1A3D16]/90"
                    />
                  )}
                </td>
                <td className="py-3 px-6 text-center ">
                  {(student.MusciProgramForms?.length || 0) > 0 && (
                    <FaDownload
                      onClick={() =>
                        handleDownload(
                          student.registrationId,
                          "Music Program",
                          student.MusciProgramForms || []
                        )
                      }
                      size={16}
                      title="Download PDF"
                      className="cursor-pointer text-[#1A3D16] hover:text-[#1A3D16]/90"
                    />
                  )}
                </td>
                <td className="py-3 px-6 text-center ">
                  {(student.OnlineTutoringForms?.length || 0) > 0 && (
                    <FaDownload
                      onClick={() =>
                        handleDownload(
                          student.registrationId,
                          "Online Tutoring",
                          student.OnlineTutoringForms || []
                        )
                      }
                      size={16}
                      title="Download PDF"
                      className="cursor-pointer text-[#1A3D16] hover:text-[#1A3D16]/90"
                    />
                  )}
                </td>
                <td className="py-3 px-6 text-center ">
                  {(student.PrivateAndTestPrepForms?.length || 0) > 0 && (
                    <FaDownload
                      onClick={() =>
                        handleDownload(
                          student.registrationId,
                          "Private & Test Prep",
                          student.PrivateAndTestPrepForms || []
                        )
                      }
                      size={16}
                      title="Download PDF"
                      className="cursor-pointer text-[#1A3D16] hover:text-[#1A3D16]/90"
                    />
                  )}
                </td>
                <td className="py-3 px-6 text-center ">
                  {(student.SingleProgramForms?.length || 0) > 0 && (
                    <FaDownload
                      onClick={() =>
                        handleDownload(
                          student.registrationId,
                          "Single Program",
                          student.SingleProgramForms || []
                        )
                      }
                      size={16}
                      title="Download PDF"
                      className="cursor-pointer text-[#1A3D16] hover:text-[#1A3D16]/90"
                    />
                  )}
                </td>
                <td className="py-3 px-6 text-center ">
                  {(student.CampForms?.length || 0) > 0 && (
                    <FaDownload
                      onClick={() =>
                        handleDownload(
                          student.registrationId,
                          "Camp Forms",
                          student.CampForms || []
                        )
                      }
                      size={16}
                      title="Download PDF"
                      className="cursor-pointer text-[#1A3D16] hover:text-[#1A3D16]/90"
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EnrolledStudents;
