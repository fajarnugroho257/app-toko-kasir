import Login from "./page/Login";
import Dashboard from "./page/Dashboard";
import Splash from "./Splash";
import { Route, Routes } from "react-router-dom";
import AuthRoute from "./utilities/AuthRoute";

import Header from "./components/Header";
import Footer from "./components/Footer";
import { useLocation } from "react-router-dom";

function App() {
  const location = useLocation();
  const uri = location.pathname;
  return (
    <div className="h-screen">
      <div className={`${uri === "/login" ? "hidden" : ""}  h-[7%]`}>
        <Header pageName="Pembelian" />
      </div>
      <Routes>
        <Route
          path="/login"
          element={<AuthRoute element={<Login />} isPrivate={false} />}
        />
        <Route
          path="/"
          element={<AuthRoute element={<Splash />} isPrivate={false} />}
        />
        {/* route yang di authentikasi */}
        <Route
          path="/dashboard"
          element={<AuthRoute element={<Dashboard />} isPrivate={true} />}
        />
      </Routes>
      <div className={`${uri === "/login" ? "hidden" : ""} h-[7%]`}>
        <Footer />
      </div>
    </div>
  );
}

export default App;
