import { div } from "framer-motion/client";
import React from "react";

const Slider = () => {
  return (
    <div className="w-full h-[80vh] mt-10 flex justify-center items-center">
      <div className="relative w-full h-[80vh] bg-slate-800 overflow-hidden">
        <input
          className="hidden peer/slider1 checkbox"
          type="radio"
          name="slider"
          id="slider1"
          defaultChecked
        />
        <input
          className="hidden peer/slider2 checkbox"
          type="radio"
          name="slider"
          id="slider2"
        />
        <input
          className="overflow-hidden peer/slider3 checkbox"
          type="radio"
          name="slider"
          id="slider3"
        />
  
        <div
          className="relative w-screen h-full flex transition-all duration-500 ease-in-out peer-checked/slider1:-left-0 peer-checked/slider2:-left-[100vw] peer-checked/slider3:-left-[200vw]"
        >
            <div className="relative w-full h-full flex">
            <img src="imagen_2025-05-28_191223371.jpg" className="relative w-full h-full flex object-cover object-center"/>
            </div>
          <div className="relative w-full h-full flex bg-amber-500">
            <img src="882eb8b0d9cbcc5b5f5a76e8dddd66bd.jpg" className="relative w-full h-full flex object-cover object-center"/>
          </div>
          <div className="relative w-full h-full flex bg-emerald-500">
            <img src="fondo5.png" className="relative w-full h-full flex object-cover object-center"/>
          </div>
        </div>
  
        <div
          className="absolute w-full flex justify-center gap-2 bottom-12 peer-[&_label:nth-of-type(1)]/slider1:peer-checked/slider1:opacity-100 peer-[&_label:nth-of-type(1)]/slider1:peer-checked/slider1:w-10 peer-[&_label:nth-of-type(2)]/slider2:peer-checked/slider2:opacity-100 peer-[&_label:nth-of-type(2)]/slider2:peer-checked/slider2:w-10 peer-[&_label:nth-of-type(3)]/slider3:peer-checked/slider3:opacity-100 peer-[&_label:nth-of-type(3)]/slider3:peer-checked/slider3:w-10"
        >
          <label

className="block w-5 h-5 bg-white cursor-pointer opacity-50 z-10 transition-all duration-300 ease-in-out hover:scale-125 hover:opacity-100 border-2 border-black"
            htmlFor="slider1"
          ></label>
          <label
            className="block w-5 h-5 bg-white cursor-pointer opacity-50 z-10 transition-all duration-300 ease-in-out hover:scale-125 hover:opacity-100 border-2 border-black"
            htmlFor="slider2"
          ></label>
          <label
            className="block w-5 h-5 bg-white cursor-pointer opacity-50 z-10 transition-all duration-300 ease-in-out hover:scale-125 hover:opacity-100 border-2 border-black"
            htmlFor="slider3"
          ></label>
        </div>
      </div>
    </div>
    );
};

export default Slider;
