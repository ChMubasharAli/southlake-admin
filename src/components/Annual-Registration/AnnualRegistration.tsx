import { useEffect, useState } from "react";
import { FaDownload } from "react-icons/fa";
import jsPDF from "jspdf";
import axios from "axios";
import { Loader } from "@mantine/core";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx"; // Import xlsx library

interface Student {
  id: number;
  parentFirstName: string;
  parentLastName: string;
  firstName: string;
  lastName: string;
  address: string;
  zipCode: number;
  country: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  amount: string;
  registrationId: number;
  createdAt: string;
  updatedAt: string;
  expiryDate: string;
}

export default function AnnualRegistration() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Fetch students data from API
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get<Student[]>(
          "https://southlakebackend.onrender.com/api/getAllRegistrations"
        );
        setStudents(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching students:", error);
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  // Filter students based on search term (registrationId)
  const filteredStudents = students.filter((student) =>
    student.registrationId.toString().includes(searchTerm)
  );

  // Handle PDF generation and download
  const handleDownload = (student: Student) => {
    const doc = new jsPDF();

    // Title for the PDF
    doc.setFontSize(18);
    doc.text("Enrolled Student Details", 10, 10);
    doc.setFontSize(12);

    let yOffset = 20; // Starting vertical position

    const formatKey = (key: string) => {
      return key
        .replace(/([A-Z])/g, " $1") // Split camelCase
        .replace(/^./, (str) => str.toUpperCase()) // Capitalize the first letter
        .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize all words
    };

    // Generate Table
    const generateTable = (data: any[]) => {
      const tableHeaders = ["Field", "Value"];
      const tableData = data.map((item: Record<string, any>) => {
        return [formatKey(item.key), item.value || "N/A"];
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

      // Update yOffset after the table
      const autoTableInfo = (doc as any).lastAutoTable;
      if (autoTableInfo) {
        yOffset = autoTableInfo.finalY + 10;
      }
    };

    // Add table for detailed data
    const studentDataArray = [
      {
        key: "Parent Name",
        value: `${student.parentFirstName} ${student.parentLastName}`,
      },
      { key: "Child Name", value: `${student.firstName} ${student.lastName}` },
      { key: "Address", value: student.address },
      { key: "City", value: student.city },
      { key: "State", value: student.state },
      { key: "Country", value: student.country },
      { key: "Zip Code", value: student.zipCode.toString() },
      { key: "Phone", value: student.phone },
      { key: "Email", value: student.email },
      { key: "Payment Amount", value: `$${student.amount}` },
      { key: "Registration ID", value: student.registrationId.toString() },
      {
        key: "Expiry Date",
        value: new Date(student.expiryDate).toLocaleDateString(),
      },
    ];

    generateTable(studentDataArray);

    // Save PDF
    doc.save(`${student.firstName}_${student.lastName}_Details.pdf`);
  };

  // Handle Excel export
  const handleExportExcel = () => {
    const dataToExport = filteredStudents.map((student) => ({
      "Registration ID": student.registrationId,
      "Parent Name": `${student.parentFirstName} ${student.parentLastName}`,
      "Child Name": `${student.firstName} ${student.lastName}`,
      Payment: `$${student.amount}`,
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Students");

    // Export the data to an Excel file
    XLSX.writeFile(wb, "students_data.xlsx");
  };

  if (loading) {
    return (
      <div className="h-[100%] flex items-center justify-center">
        <Loader color="#1A3D16" size="lg" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:max-w-[80%] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#1A3D16]">Enrolled Students</h2>
        {/* Excel Download Button */}
        <button
          onClick={handleExportExcel}
          className="px-4 py-2 bg-[#1A3D16] text-white rounded-lg"
        >
          Download Excel
        </button>
      </div>
      <div className="bg-white p-8 rounded-lg shadow-lg">
        {/* Search Input Field */}
        <input
          type="text"
          placeholder="Search by Registration ID"
          className="w-full mb-4 px-4 py-4 border border-gray-300 rounded-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="overflow-x-auto shadow-lg">
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
                  Child Name
                </th>
                <th className="py-3 px-6 text-left text-[#1A3D16] uppercase">
                  Payment
                </th>
                <th className="py-3 px-6 text-center text-[#1A3D16] uppercase">
                  Download
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {filteredStudents.map((student) => (
                <tr
                  key={student.id}
                  className="border-b border-gray-300 hover:bg-gray-100"
                >
                  <td className="py-3 px-6 text-left">
                    {student.registrationId}
                  </td>
                  <td className="py-3 px-6 text-left">
                    {student.parentFirstName} {student.parentLastName}
                  </td>
                  <td className="py-3 px-6 text-left">
                    {student.firstName} {student.lastName}
                  </td>
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    ${student.amount}
                  </td>
                  <td className="py-3 px-6 text-center flex items-center justify-center">
                    <FaDownload
                      className="cursor-pointer text-[#1A3D16] hover:text-[#1A3D16]/90"
                      size={16}
                      title="Download PDF"
                      onClick={() => handleDownload(student)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
