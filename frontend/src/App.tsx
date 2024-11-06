import "./App.css";
import {Route, BrowserRouter as Router, Routes, Navigate} from "react-router-dom";
import Navbar from "./components/appComponents/navbar/navbar";
import RegionList from "./pages/regionList/RegionList";
import AddRegion from "./pages/addRegion/AddRegion";
import {ModalProvider} from "./hooks/ModalContext";

function App() {
    return (
        <ModalProvider>
            <div className="App">
                <Router>
                    <Navbar/>
                    <div className="routes">
                        <Routes>
                            <Route path="/" element={<Navigate to="/regions"/>}></Route>
                            <Route path="/regions" element={<RegionList/>}></Route>
                            <Route path="/regions/new" element={<AddRegion mode="create"/>}></Route>
                            <Route path="/regions/edit/:regionId" element={<AddRegion mode="edit"/>}></Route>
                            <Route path="/regions/copy/:regionId" element={<AddRegion mode="copy"/>}></Route>
                        </Routes>
                    </div>
                </Router>
            </div>
        </ModalProvider>
    );
}

export default App;
