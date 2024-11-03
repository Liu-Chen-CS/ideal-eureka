import "./App.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Navbar from "./components/appComponents/navbar/navbar";
import RegionList from "./pages/regionList/RegionList";
import AddRegion from "./pages/addRegion/AddRegion";

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <div className="routes">
          <Routes>
            <Route path="/regions" element={<RegionList/>}></Route>
            <Route path="/regions/new" element={<AddRegion mode="create"/>}></Route>
            <Route path="/regions/edit/:regionId" element={<AddRegion mode="edit"/>}></Route>
            <Route path="/regions/copy/:regionId" element={<AddRegion mode="copy"/>}></Route>
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
