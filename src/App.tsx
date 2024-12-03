import { Outlet } from "react-router-dom";
import { Sidebar } from "./components";

function App() {
  return (
    <main className="grid grid-cols-12 bg-zinc-400 min-h-screen ">
      <aside className="col-span-2 h-full ">
        <Sidebar />
      </aside>
      <section className="col-span-10 bg-white min-h-[100vh]">
        <Outlet />
      </section>
    </main>
  );
}

export default App;
