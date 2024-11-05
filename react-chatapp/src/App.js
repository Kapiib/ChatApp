import logo from './logo.svg';
import './App.css';
import {Routes, Route} from 'react-router-dom';
import About from "./pages/about";
import About from "./pages/about";

function App() {
  return (
    <Routes>
      <Route path="/About" element={<About></About>}>

      </Route>
    </Routes>
  );
}

export default App;
