import { NavLink } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  const handleLogout = () => {
    // Clear the auth token from localStorage
    localStorage.removeItem("auth_token");

    // Redirect to the login page
    navigate("/login");
  };
  const menuItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "After School", path: "/after-school" },
    { name: "Enrichment Classes", path: "/programs" },
    { name: "Online Private", path: "/private" },
    { name: "In Person Tutoring", path: "/person-private-tutoring" },
    { name: "Music Classes", path: "/music-classes" },
    { name: "Southlake Camps", path: "/southlake-camps" },
    { name: "Annual Registration", path: "/annual-registration" },
    { name: "Users", path: "/users" },
    { name: "Transactions", path: "/payment" },
    { name: "Contact Us", path: "/contact" },
    { name: "Schedule", path: "/schedule" },
  ];
  return (
    <div className=" bg-white border-r-2 border-r-black min-h-screen sticky top-0 left-0 font-Montserrat  px-4">
      <div className="flex justify-center items-center py-4 md:h-[100px]  2xl:h-[200px]">
        <img src={logo} alt="Logo" className="w-[40%]" />
      </div>
      <ul className=" flex flex-col md:min-h-[calc(100dvh-100px)] 2xl:min-h-[calc(100dvh-200px)]   items-center  mx-auto 2xl:max-w-[80%] space-y-4 2xl:space-y-8 py-4">
        {menuItems.map((item) => (
          <li key={item.name} className="w-full ">
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `block w-full py-2 text-center rounded-lg ${
                  isActive
                    ? "bg-[#1A3D16] underline underline-offset-4 text-white font-bold" // Active styles
                    : "bg-[#1A3D16]  text-white " // Default styles
                }`
              }
            >
              {item.name}
            </NavLink>
          </li>
        ))}
        <button
          onClick={handleLogout}
          className="w-full cursor-pointer  block  py-2 text-center rounded-lg bg-[#1A3D16]  text-white "
        >
          Logout
        </button>
      </ul>
    </div>
  );
}
