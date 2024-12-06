import { useEffect, useState } from "react";
import { FaDownload } from "react-icons/fa";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { Loader } from "@mantine/core";

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

  // Handle PDF generation and download
  const handleDownload = (student: Student) => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text("Enrolled Student Details", 14, 20);

    // Add student details
    const userDetails = [
      ["Parent Name", `${student.parentFirstName} ${student.parentLastName}`],
      ["Child Name", `${student.firstName} ${student.lastName}`],
      ["Address", student.address],
      ["City", student.city],
      ["State", student.state],
      ["Country", student.country],
      ["Zip Code", student.zipCode.toString()],
      ["Phone", student.phone],
      ["Email", student.email],
      ["Payment Amount", `$${student.amount}`],
      ["Registration ID", student.registrationId.toString()],
      ["Expiry Date", new Date(student.expiryDate).toLocaleDateString()],
    ];

    userDetails.forEach(([key, value], index) => {
      doc.setFontSize(12);
      doc.text(`${key}: ${value}`, 14, 30 + index * 10);
    });

    // Add footer
    doc.setFontSize(10);
    doc.text(
      "Generated on: " + new Date().toLocaleString(),
      14,
      doc.internal.pageSize.height - 10
    );

    // Save PDF
    doc.save(`${student.firstName}_${student.lastName}_Details.pdf`);
  };

  if (loading) {
    return (
      <div className=" h-[100%] flex items-center justify-center ">
        <Loader color="#1A3D16" size="lg" />
      </div>
    );
  }

  return (
    <div className="p-12 font-Montserrat">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#1A3D16] ">
          Enrolled Students
        </h2>
      </div>
      <div className="p-4">
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
              {students.map((student) => (
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
                  <td className="py-3 px-6 text-center  flex items-center justify-center">
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
