// import { useState } from 'react'
// import { Navigate } from 'react-router-dom';
import './App.css';
import Board from './components/Board';
import Navbar from './components/Navbar';
import 'react-toastify/dist/ReactToastify.min.css';

function App() {
  return (
    <>
      <div className="App">
        <Navbar />
        <div className="px-16">
          <Board />
        </div>
      </div>
    </>
  );
}

export default App;
