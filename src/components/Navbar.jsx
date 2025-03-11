import React from 'react';
import logo from "../assets/logo.svg";



const Navbar = () => {
  return (
    <nav className="flex justify-center">
        <div className="w-full max-w-7xl px-4 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <img src={logo} alt="Logo" className="w-11 h-11" /> 
        <div>
          <h1 onClick={() => window.location.href = "/"} className="cursor-pointer text-xl md:text-2xl font-extrabold text-customBlue">
            BandBooster
          </h1>
          <p className="text-sm text-blue-600">Boost Your Band Score</p>
        </div>
      </div>

      {/* در صورت توسعه */}

      {/* <nav className="space-x-10 hidden md:flex">
        <a href="/about" className="transition delay-90 text-black hover:text-blue-600 font-medium">About</a>
        <a href="/services" className="transition delay-90 text-black hover:text-blue-600 font-medium">Services</a>
        <a href="https://nima-nilchian.github.io/" className="transition delay-90 text-black hover:text-blue-600 font-medium">Contact</a>
      </nav>


      <div className="flex">
        <button className="flex items-center bg-transparent border border-white px-4 py-2 rounded-md hover:bg-white transition delay-90">
           <img src="/defs/assets/profile.svg" alt="Login" className="w-8 h-8 pr-2" />
           Login
        </button>

        <button className="bg-blue-500 px-4 py-2 rounded-md hover:bg-blue-600 hover:text-white transition">
          Sign Up
        </button>
      </div> */}


      </div>
    </nav>
  );
};

export default Navbar;
