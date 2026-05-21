import { BrowserRouter, Routes, Route} from "react-router-dom";
import ApplicationList from "./pages/ApplicationList";

export default function App() {
  return(
    <BrowserRouter>
      <Routes>
        <Route  path="/" element={<ApplicationList />}/>
      </Routes>
    </BrowserRouter>
  )
}