import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './Dashboard';
import Login from './Login';
import Register from './Register';
import { ToastContainer } from 'react-toastify';
import Appheader from './Appheader';
import Home from'./Home';
import HotelDetail from './HotelDetail';
import Booking from './Booking';

function App() {
  return (
    <div className="App">
      <ToastContainer theme='colored' position='top-center'></ToastContainer>
      <BrowserRouter>
      <Appheader></Appheader>
      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/register' element={<Register/>}></Route>
        <Route path="/hotel/:id" element={<HotelDetail />} />
        <Route path="/book/:id" element={<Booking />} />
        <Route path='/Dashboard' element={<Dashboard/>}></Route>
      </Routes>
      
      </BrowserRouter>
      
    </div>
  );
}

export default App;