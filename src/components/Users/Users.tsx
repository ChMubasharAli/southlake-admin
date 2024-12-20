import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx"; // Import xlsx library
import { Loader, Modal, Button, ScrollArea } from "@mantine/core";

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

const Users: React.FC = () => {
  const [data, setData] = useState<StudentData[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedStudent, setSelectedStudent] = useState<ProgramData | null>(
    null
  );
  const [modalOpened, setModalOpened] = useState<boolean>(false);

  // Fetching data from the backend API
  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(
        "https://southlakebackend.onrender.com/api/getAllRegistrationsData"
      );
      setData(response.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Utility function to handle empty fields
  const getFieldValue = (value: string | undefined | object) => {
    if (typeof value === "object") {
      return JSON.stringify(value); // This will print the object as a string, or you can customize this behavior
    }
    return value || "N/A";
  };

  // This format key fucntion will use for the Modal that will shwo after clicking the detail button in the table and that modal will show user data
  const formatKey = (key: string) => {
    return key
      .replace(/([A-Z])/g, " $1") // Add space before uppercase letters
      .replace(/(\d)([A-Za-z])/g, "$1 $2") // Add space between number and letter
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize each word
  };

  // Generate PDF for a specific program data
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

      const autoTableInfo = (doc as any).lastAutoTable;
      if (autoTableInfo) {
        yOffset = autoTableInfo.finalY + 10;
      }
    };

    const formatKey = (key: string) => {
      return key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase())
        .replace(/\b\w/g, (char) => char.toUpperCase());
    };

    programData.forEach((item, index) => {
      doc.text(`${index + 1}st Student Detail:`, 10, yOffset);
      yOffset += 10;
      const programDataArray = Object.entries(item).map(([key, value]) => ({
        key,
        value: getFieldValue(value),
      }));
      generateTable(programDataArray);
    });

    doc.save(`${programName}_Registration_${registrationId}.pdf`);
  };

  // Handling Excel export
  const handleExportExcel = () => {
    const dataToExport = data.flatMap((student) => {
      const allPrograms = [
        ...student.AfterSchoolProgramForms,
        ...student.MusciProgramForms,
        ...(student.OnlineTutoringForms || []), // Ensure it's an array
        ...student.PrivateAndTestPrepForms,
        ...student.SingleProgramForms,
        ...student.CampForms,
      ];

      return allPrograms.map((program) => ({
        "Registration ID": student.registrationId,
        "Parent Name": `${student.parentFirstName} ${student.parentLastName}`,
        Child1Name:
          program.child1FirstName && program.child1LastName
            ? `${program.child1FirstName} ${program.child1LastName}`
            : program.firstStudentFirstName && program.firstStudentLastName
            ? `${program.firstStudentFirstName} ${program.firstStudentLastName}`
            : program.camperFirstName && program.camperLastName
            ? `${program.camperFirstName} ${program.camperLastName}`
            : program.StudentFirstName && program.StudentLastName
            ? `${program.StudentFirstName} ${program.StudentLastName}`
            : "",
        Child2Name:
          program.child2FirstName && program.child2LastName
            ? `${program.child2FirstName} ${program.child2LastName}`
            : program.firstStudentFirstName && program.firstStudentLastName
            ? `${program.firstStudentFirstName} ${program.firstStudentLastName}`
            : program.camperFirstName && program.camperLastName
            ? `${program.camperFirstName} ${program.camperLastName}`
            : program.StudentFirstName && program.StudentLastName
            ? `${program.StudentFirstName} ${program.StudentLastName}`
            : "",
        Amount: `$${program.amount}`,
      }));
    });

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Users");

    XLSX.writeFile(wb, "user_data.xlsx");
  };

  // Filtering data based on search query
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

  // Open modal with student details
  const openModal = (student: ProgramData) => {
    setSelectedStudent(student);
    setModalOpened(true);
  };

  // Show loading spinner if data is empty
  if (data.length <= 0) {
    return (
      <div className="h-[100%] flex items-center justify-center">
        <Loader color="#1A3D16" size="lg" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-full mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#1A3D16]">
          All Transactions Details
        </h2>
        <button
          onClick={handleExportExcel}
          className="px-4 py-2 bg-[#1A3D16] text-white rounded-lg"
        >
          Download Excel
        </button>
      </div>
      <div className="max-w-full mx-auto bg-white">
        <div className="rounded-lg shadow-lg">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Registration ID"
            className="w-full p-3 mb-6 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

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
                First Child Name
              </th>

              <th className="py-3 px-6 text-left text-[#1A3D16] uppercase">
                Amount
              </th>
              <th className="py-3 px-6 text-left text-[#1A3D16] uppercase text-center">
                Details
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((student) =>
              [
                ...student.AfterSchoolProgramForms,
                ...student.MusciProgramForms,
                ...(student.OnlineTutoringForms || []), // Ensure it's an array
                ...student.PrivateAndTestPrepForms,
                ...student.SingleProgramForms,
                ...student.CampForms,
              ].map((program, index) => (
                <tr
                  key={`${student.registrationId}-${index}`}
                  className="border-b border-gray-300 hover:bg-gray-100"
                >
                  <td className="py-3 px-6 text-left">
                    {student.registrationId}
                  </td>
                  <td className="py-3 px-6 text-left">
                    {student.parentFirstName} {student.parentLastName}
                  </td>
                  <td className="py-3 px-6 text-left">
                    {program.child1FirstName && program.child1LastName
                      ? program.child1FirstName + " " + program.child1LastName
                      : program.firstStudentFirstName &&
                        program.firstStudentLastName
                      ? program.firstStudentFirstName +
                        " " +
                        program.firstStudentLastName
                      : program.camperFirstName && program.camperLastName
                      ? program.camperFirstName + " " + program.camperLastName
                      : program.StudentFirstName && program.StudentLastName
                      ? program.StudentFirstName + " " + program.StudentLastName
                      : ""}
                  </td>

                  <td className="py-3 px-6 text-left">
                    ${program.amountPaidByUser || 0}
                  </td>
                  <td className="py-3 px-6 text-center">
                    <span
                      onClick={() => openModal(program)}
                      className="cursor-pointer text-blue-500 hover:text-blue-600"
                    >
                      View Details
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for full student details */}
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title="Student Details"
        size="xl"
        radius={"md"}
        scrollAreaComponent={ScrollArea.Autosize}
      >
        <div className="w-full">
          {selectedStudent && (
            <>
              <table className=" w-full border border-gray-300  shadow-lg">
                <thead>
                  <tr className="bg-gray-200 text-gray-700 uppercase  text-sm leading-normal">
                    <th className="py-3 px-6 text-left text-[#1A3D16]">
                      Properties
                    </th>
                    <th className=" py-3 px-6 text-left text-[#1A3D16]">
                      Value
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(selectedStudent).map(([key, value]) => (
                    <tr
                      key={key}
                      className="border-b border-gray-300 hover:bg-gray-100"
                    >
                      <td className="py-3 px-6 text-left">{formatKey(key)}</td>
                      <td className="py-3 px-6 text-left">
                        {getFieldValue(value)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-end mt-4">
                <Button
                  onClick={() =>
                    handleDownload(
                      selectedStudent.registrationId,
                      "Students Details",
                      [selectedStudent]
                    )
                  }
                >
                  Download PDF
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Users;
