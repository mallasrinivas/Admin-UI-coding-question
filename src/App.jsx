import "./App.css";
import Table from "./components/Table";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <div>
        <h1>Admin UI</h1>
        <Table />
        <ToastContainer autoClose={1000} />
      </div>
    </>
  );
}

export default App;
