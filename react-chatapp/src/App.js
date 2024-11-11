import logo from './logo.svg';
import './App.css';
import {Routes, Route} from 'react-router-dom';
import About from "./pages/About";


function App() {
  return (
    <Routes>
      <Route path="/About" element={<About></About>}>

      </Route>
    </Routes>
  );
}

export default App;
