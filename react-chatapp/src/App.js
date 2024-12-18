import logo from './logo.svg';
import './App.css';
import {Routes, Route} from 'react-router-dom';
import About from "./pages/About";
import Login from './pages/Login';
import Create_user from "./pages/Create_user"
import LandingPage from "./pages/LandingPage"
import NotFound from './pages/404';
import Navbar from './components/Navbar';
import AccountPage from './pages/Account';
import { UserProvider } from "./UserContext";
import PrivateRoute from "./components/PrivateRoute";


function App() {
  return (
    <UserProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage></LandingPage>}></Route>
        <Route path="/About" element={<About></About>}></Route>
        <Route path="/Login" element={<Login></Login>}></Route>
        <Route path="/Create_user" element={<Create_user></Create_user>}></Route>
        <Route path="*" element={<NotFound></NotFound>}></Route>
        <Route path="/Account" element={<AccountPage></AccountPage>}></Route>
        <PrivateRoute path="/Account" element={<AccountPage></AccountPage>}></PrivateRoute>
      </Routes>
    </UserProvider>
  );
}

export default App;
