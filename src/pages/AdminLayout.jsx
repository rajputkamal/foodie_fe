import { Outlet } from "react-router-dom";
import { Topbar } from "../components/Topbar";
import { Sidebar } from "../components/Sidebar";

export default function AdminLayout() {
  return (
    <>
      <style>{css}</style>
      <div style={layout.shell}>
        <Sidebar />
        <div style={layout.main}>
          <Topbar />
          <div style={layout.content}>
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}


const layout = {
  shell: {
    display: "flex",
    minHeight: "100vh",
    background: "#f9fafb",
    fontFamily: "'Inter', sans-serif",
  },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
    overflow: "hidden",
  },
  content: {
    flex: 1,
    overflowY: "auto",
    padding: "0",
  },
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter', sans-serif; background: #f9fafb; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 4px; }
  a { text-decoration: none; }
`;
