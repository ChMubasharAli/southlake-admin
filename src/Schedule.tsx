import React, { useEffect, useState } from "react";
import axios from "axios";
import { Loader } from "@mantine/core";

// Define the type for the data structure
interface StudentData {
  id: number;
  studentName: string;
  parentPhoneNumber: string;
  createdAt: string;
  updatedAt: string;
}

const Schedule: React.FC = () => {
  const [data, setData] = useState<StudentData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingDelete, setLoadingDelete] = useState<number | null>(null); // To track which item is being deleted

  // Fetch data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<StudentData[]>(
          "https://southlakebackend.onrender.com/api/getSchedule" // Replace with your actual API endpoint
        );
        setData(response.data);
        setLoading(false);
      } catch (err) {
        setError("Error fetching data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle delete request
  const handleDelete = async (id: number) => {
    try {
      setLoadingDelete(id); // Start loading for the specific item
      await axios.delete(
        `https://southlakebackend.onrender.com/api/deleteSchedule/${id}` // Replace with your actual API delete endpoint
      );
      setData(data.filter((item) => item.id !== id)); // Remove the deleted item from the UI
      setLoadingDelete(null); // Reset the delete loading state
    } catch (err) {
      setError("Error deleting data");
      setLoadingDelete(null); // Reset the delete loading state if an error occurs
    }
  };

  if (loading)
    return (
      <div className="h-[50%] flex items-center justify-center">
        <Loader color="#1A3D16" size="lg" />
      </div>
    );
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Students Data Table</h2>
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
        <thead>
          <tr className="border-b bg-gray-100">
            <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">
              No#
            </th>
            <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">
              Student Name
            </th>
            <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">
              Parent Phone Number
            </th>
            <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">
              Created At
            </th>
            <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={item.id} className="border-b">
              <td className="py-2 px-4 text-sm text-gray-700">{index + 1}</td>
              <td className="py-2 px-4 text-sm text-gray-700">
                {item.studentName}
              </td>
              <td className="py-2 px-4 text-sm text-gray-700">
                {item.parentPhoneNumber}
              </td>
              <td className="py-2 px-4 text-sm text-gray-700">
                {new Date(item.createdAt).toLocaleString()}
              </td>
              <td className="py-2 px-4 text-sm text-gray-700">
                <button
                  onClick={() => handleDelete(item.id)}
                  disabled={loadingDelete === item.id} // Disable button while deleting
                  className={`px-4 py-1 ${
                    loadingDelete === item.id ? "bg-gray-500" : "bg-red-500"
                  } text-white rounded hover:bg-red-600 focus:outline-none`}
                >
                  {loadingDelete === item.id ? "Deleting..." : "Delete"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Schedule;
