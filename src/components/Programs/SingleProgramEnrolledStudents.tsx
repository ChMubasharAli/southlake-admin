import { FaDownload } from "react-icons/fa";

export default function SingleProgramEnrolledStudents() {
  const data = [
    {
      customerId: 1,
      parentName: "John Doe",
      childName: "Alice Doe",
      payment: "$500",
      download: FaDownload,
    },
    {
      customerId: 2,
      parentName: "Jane Smith",
      childName: "Bob Smith",
      payment: "$300",
      download: FaDownload,
    },
    {
      customerId: 3,
      parentName: "Michael Johnson",
      childName: "Chris Johnson",
      payment: "$450",
      download: FaDownload,
    },
    {
      customerId: 4,
      parentName: "Emily White",
      childName: "Danny White",
      payment: "$550",
      download: FaDownload,
    },
    {
      customerId: 5,
      parentName: "James Brown",
      childName: "Eva Brown",
      payment: "$400",
      download: FaDownload,
    },
    {
      customerId: 6,
      parentName: "Sarah Miller",
      childName: "Frank Miller",
      payment: "$350",
      download: FaDownload,
    },
    {
      customerId: 7,
      parentName: "David Wilson",
      childName: "Grace Wilson",
      payment: "$600",
      download: FaDownload,
    },
    {
      customerId: 8,
      parentName: "Jessica Moore",
      childName: "Hannah Moore",
      payment: "$320",
      download: FaDownload,
    },
    {
      customerId: 9,
      parentName: "Thomas Taylor",
      childName: "Ian Taylor",
      payment: "$490",
      download: FaDownload,
    },
    {
      customerId: 10,
      parentName: "Laura Anderson",
      childName: "Jack Anderson",
      payment: "$530",
      download: FaDownload,
    },
  ];

  return (
    <div className="p-12 font-Montserrat">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl uppercase font-bold text-[#1A3D16] ">
          single program <br />
          Enrolled Students
        </h2>
        <button className=" px-4 py-2 text-white rounded-md w-fit button-green font-Montserrat bg-[#1A3D16] border-2 border-[#1A3D16] hover:border-[#1A3D16] hover:!text-black  font-semibold     transition-all duration-300">
          Enrolled Students
        </button>
      </div>
      <div className="p-4 ">
        <div className="overflow-x-auto shadow-lg">
          <table className="min-w-full bg-white border border-gray-300  shadow-lg ">
            <thead>
              <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left text-[#1A3D16] uppercase">
                  Customer ID
                </th>
                <th className="py-3 px-6 text-left text-[#1A3D16] uppercase">
                  Parent Name
                </th>
                <th className="py-3 px-6 text-left text-[#1A3D16] uppercase">
                  Child Name
                </th>
                <th className="py-3 px-6 text-left text-[#1A3D16] uppercase">
                  payment
                </th>
                <th className="py-3 px-6 text-center text-[#1A3D16] uppercase">
                  form
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {data.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-300 hover:bg-gray-100"
                >
                  <td className="py-3 px-6 text-left">{item.customerId}</td>
                  <td className="py-3 px-6 text-left">{item.parentName}</td>
                  <td className="py-3 px-6 text-left">{item.childName}</td>
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    {item.payment}
                  </td>
                  <td className="py-3 px-6 text-center flex items-center justify-center">
                    <item.download
                      className="text-center cursor-pointer text-[#1A3D16] hover:text-[#1A3D16]/90 "
                      size={16}
                      title="download form"
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
