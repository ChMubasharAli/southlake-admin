import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import { Loader } from "@mantine/core";
import { FaDownload } from "react-icons/fa";

interface AfterSchoolProgramForm {
  registrationId: number;
  expiryDate: string;
  parentFirstName: string;
  parentLastName: string;
  AfterSchoolProgramForms: Array<Record<string, any>>; // Nested array for additional data
}

const EnrolledStudents: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [data, setData] = useState<AfterSchoolProgramForm[]>([]);
  const [filteredData, setFilteredData] = useState<AfterSchoolProgramForm[]>(
    []
  );

  // Fetch Data
  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(
        "https://southlakebackend.onrender.com/api/getAfterSchoolParent"
      );
      if (response.data) {
        setData(response.data);
        setFilteredData(response.data);
      } else {
        console.error("No data found in the response.");
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  }, []);

  // Initial Data Load
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filter Logic
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredData(data);
    } else {
      const lowercasedQuery = searchQuery.toLowerCase();
      setFilteredData(
        data.filter(
          (form) =>
            form.registrationId.toString().includes(lowercasedQuery) ||
            form.parentFirstName.toLowerCase().includes(lowercasedQuery) ||
            form.parentLastName.toLowerCase().includes(lowercasedQuery)
        )
      );
    }
  }, [searchQuery, data]);

  // PDF Generation
  const handleDownload = (registrationId: number) => {
    const formData = data.find(
      (form) => form.registrationId === registrationId
    );

    if (!formData) {
      console.error("No data found for this registration ID.");
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("After School Program Details", 10, 10);
    doc.setFontSize(12);

    let yOffset = 20; // Starting vertical position

    const addContent = (key: string, value: any) => {
      const formattedKey = key.replace(/([A-Z])/g, " $1"); // Split camelCase keys
      const formattedValue = value || "N/A";
      const lineHeight = 10;

      if (yOffset + lineHeight > 280) {
        // Check if content exceeds page height
        doc.addPage();
        yOffset = 10; // Reset vertical position for new page
      }

      doc.text(`${formattedKey}: ${formattedValue}`, 10, yOffset);
      yOffset += lineHeight;
    };

    for (const [key, value] of Object.entries(formData)) {
      if (key === "AfterSchoolProgramForms") {
        if (value.length > 0) {
          doc.text("After School Program Forms Data:", 10, yOffset);
          yOffset += 10;

          value.forEach((item: Record<string, any>, index: number) => {
            doc.text(`Form ${index + 1}:`, 10, yOffset);
            yOffset += 10;

            for (const [itemKey, itemValue] of Object.entries(item)) {
              addContent(itemKey, itemValue);
            }
          });
        } else {
          addContent(key, "No forms available");
        }
      } else {
        addContent(key, value);
      }
    }

    doc.save(`Registration_${formData.registrationId}.pdf`);
  };

  return (
    <div className="p-6 lg:max-w-[80%] mx-auto ">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#1A3D16] ">
          After School Program and Enrichment <br />
          Enrolled Students
        </h2>
      </div>
      <div className="  bg-white p-8 rounded-lg shadow-lg">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by Registration ID or Name"
          className="w-full p-3 mb-6 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <table className="min-w-full bg-white border border-gray-300 shadow-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left text-[#1A3D16] uppercase">
                Registration ID
              </th>
              <th className="py-3 px-6 text-left text-[#1A3D16] uppercase">
                Parent First Name
              </th>
              <th className="py-3 px-6 text-left text-[#1A3D16] uppercase">
                Parent Last Name
              </th>
              <th className="py-3 px-6 text-left text-[#1A3D16] uppercase">
                Program BOUGHT
              </th>
              <th className="py-3 px-6 text-left text-[#1A3D16] uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {filteredData.length > 0 ? (
              filteredData.map((form) => (
                <tr
                  key={form.registrationId}
                  className="border-b border-gray-300 hover:bg-gray-100"
                >
                  <td className="py-3 px-6 text-left">{form.registrationId}</td>
                  <td className="py-3 px-6 text-left">
                    {form.parentFirstName}
                  </td>
                  <td className="py-3 px-6 text-left">{form.parentLastName}</td>
                  <td className="py-3 px-6 text-left">
                    {form.AfterSchoolProgramForms.length}
                  </td>

                  <td className="py-3 px-6 text-center flex">
                    <FaDownload
                      onClick={() => handleDownload(form.registrationId)}
                      className="cursor-pointer text-[#1A3D16] hover:text-[#1A3D16]/90"
                      size={16}
                      title="Download PDF"
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-600">
                  <Loader color="#1A3D16" size="lg" />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EnrolledStudents;
