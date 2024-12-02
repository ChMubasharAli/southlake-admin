import { Outlet } from "react-router-dom";
import { Sidebar } from "./components";

function App() {
  return (
    <main className="grid grid-cols-12 bg-zinc-400 ">
      <aside className="col-span-2">
        <Sidebar />
      </aside>
      <section className="col-span-10 bg-white">
        <Outlet />
      </section>
    </main>
  );
}

export default App;
