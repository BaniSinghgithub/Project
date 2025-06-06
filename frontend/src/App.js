import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import SignUp from "./components/signUp";

function App() {

  return (
    <div className="main">
      <ToastContainer />
      <SignUp />
    </div>
  );
}

export default App;
