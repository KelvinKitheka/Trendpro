import { BrowserRouter, Routes, Route} from "react-router-dom";
import ApplicationList from "./pages/ApplicationList";
import ApplicationForm from "./pages/ApplicationForm";

export default function App() {
  return(
    <BrowserRouter>
      <Routes>
        <Route  path="/" element={<ApplicationList />}/>
        <Route path="/applications/new" element={<ApplicationForm/>}/>
      </Routes>
    </BrowserRouter>
  )
}