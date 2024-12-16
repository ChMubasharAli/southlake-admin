import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Loader } from "@mantine/core";
import { FaDownload } from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx"; // Import xlsx library

interface MusciProgramForm {
  registrationId: number;
  parentFirstName: string;
  parentLastName: string;
  MusciProgramForms: Array<Record<string, any>>; // Nested array for additional data
}

const MusicClassesEnrolledStudents: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [data, setData] = useState<MusciProgramForm[]>([]);
  const [filteredData, setFilteredData] = useState<MusciProgramForm[]>([]);

  // Fetch Data
  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(
        "https://southlakebackend.onrender.com/api/getMusicParent"
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

  // Excel Download Function
  const handleExcelDownload = () => {
    const excelData = filteredData.map((form) => ({
      "Registration ID": form.registrationId || " ",
      "Parent First Name": form.parentFirstName || " ",
      "Parent Last Name": form.parentLastName || " ",
      "Program Bought": form.MusciProgramForms.length || " ",
    }));

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Enrolled Students");
    XLSX.writeFile(wb, "Enrolled_Students.xlsx");
  };

  // Generate Pdf Download (Excluding AfterSchoolProgramForms)
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
    doc.text("Music Classes Form Details", 10, 10);
    doc.setFontSize(12);

    let yOffset = 20; // Starting vertical position

    const formatKey = (key: string) => {
      return key
        .replace(/([A-Z])/g, " $1") // Split camelCase
        .replace(/^./, (str) => str.toUpperCase()) // Capitalize the first letter
        .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize all words
    };

    const generateTable = (data: any[]) => {
      const tableHeaders = ["Field", "Value"];
      const tableData = data.map((item: Record<string, any>) => {
        if (Array.isArray(item.value)) {
          return [
            formatKey(item.key),
            item.value
              .map((subItem: any) => {
                if (typeof subItem === "object") {
                  return Object.entries(subItem)
                    .map(([subKey, subValue]) => `${subKey}: ${subValue}`)
                    .join(", ");
                }
                return subItem;
              })
              .join(", "), // Join array elements into a single string
          ];
        } else {
          return [formatKey(item.key), item.value || "N/A"];
        }
      });

      autoTable(doc, {
        head: [tableHeaders],
        body: tableData,
        startY: yOffset,
        theme: "grid",
        headStyles: {
          fillColor: [26, 61, 22],
          textColor: [255, 255, 255],
          fontSize: 10,
        },
        bodyStyles: { fontSize: 10 },
        margin: { top: 10 },
        styles: { cellPadding: 5, fontSize: 10 },
      });

      const autoTableInfo = (doc as any).lastAutoTable;
      if (autoTableInfo) {
        yOffset = autoTableInfo.finalY + 10;
      }
    };

    for (const [key, value] of Object.entries(formData)) {
      if (key === "MusciProgramForms") {
        if (Array.isArray(value)) {
          value.forEach((item: Record<string, any>, index: number) => {
            doc.text(`Program ${index + 1}:`, 10, yOffset);
            yOffset += 10;

            const formDataArray = Object.entries(item).map(
              ([itemKey, itemValue]) => ({
                key: itemKey,
                value: itemValue,
              })
            );

            generateTable(formDataArray);
          });
        } else {
          generateTable([{ key, value: "No forms available" }]);
        }
      } else {
        const dataArray = [{ key, value }];
        generateTable(dataArray);
      }
    }

    doc.save(`Registration_${formData.registrationId}.pdf`);
  };

  return (
    <div className="p-6 lg:max-w-[80%] mx-auto ">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#1A3D16] ">
          Music Classes Enrolled Students
        </h2>
        {/* Excel Download Button */}
        <button
          onClick={handleExcelDownload}
          className="px-4 py-2 text-white rounded-md w-fit button-green font-Montserrat bg-[#1A3D16] border-2 border-[#1A3D16] hover:border-[#1A3D16] hover:!text-black font-semibold transition-all duration-300"
        >
          Download Excel
        </button>
      </div>
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by Registration ID"
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
              <th className="py-3 px-6 text-center text-[#1A3D16] uppercase">
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
                    {form.MusciProgramForms.length}
                  </td>
                  <td className="py-3 px-6 text-center flex justify-center">
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

export default MusicClassesEnrolledStudents;
