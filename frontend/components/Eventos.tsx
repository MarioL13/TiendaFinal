'use client'; // Añade esto si estás usando App Router en Next.js y necesitas interacción con el componente.

import Image from 'next/image';

interface CardProps {
  title: string;
  description: string;
  imageSrc: string;
  rating: number;
}

import React, { useState } from 'react';

const Card: React.FC<CardProps> = ({ title, description, imageSrc, rating }) => {
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  return (
    <div className="relative flex w-full max-w-[26rem] flex-col rounded-xl bg-white bg-clip-border text-gray-700 shadow-lg mt-8 ml-10">
      <div className="relative mx-4 mt-4 overflow-hidden text-white shadow-lg rounded-xl bg-blue-gray-500 bg-clip-border shadow-blue-gray-500/40">
        <Image
          src={imageSrc}
          alt={title}
          width={416} 
          height={234} 
          className="relative w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 w-full h-full bg-gradient-to-tr from-transparent via-transparent to-black/60"></div>
        <button
          className={`!absolute top-4 right-4 h-8 max-h-[32px] w-8 max-w-[32px] select-none rounded-full text-center align-middle font-sans text-xs font-medium uppercase transition-all ${
            isFavorite ? 'bg-red-500/10 text-red-500' : 'text-red-500 hover:bg-red-500/10 active:bg-red-500/30'
          }`}
          type="button"
          onClick={(e) => {
            e.stopPropagation?.();
            setIsFavorite((prev) => !prev);
          }}
        >
          <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill={isFavorite ? 'red' : 'none'}
              stroke="currentColor"
              strokeWidth={1.5}
              className="w-6 h-6"
            >
              <path
          d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z"
          fill={isFavorite ? 'red' : 'none'}
              />
            </svg>
          </span>
        </button>
      </div>
      <div className="p-6">
        <h5 className="block font-sans text-xl antialiased font-medium leading-snug tracking-normal text-blue-gray-900">
          {title}
        </h5>
        <p className="block font-sans text-base antialiased font-light leading-relaxed text-gray-700">
          {description}
        </p>
        <div className="flex items-center gap-1.5 mt-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="-mt-0.5 h-5 w-5 text-yellow-700"
          >
            <path
              fillRule="evenodd"
              d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
              clipRule="evenodd"
            ></path>
          </svg>
          {rating}
        </div>
      </div>
      <div className="p-6 pt-3">
        <button
          className="block w-full select-none rounded-lg bg-gray-900 py-3.5 px-7 text-center align-middle font-sans text-sm font-bold uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20"
          type="button"
        >
          Apuntarse
        </button>
      </div>
    </div>
  );
};

const CardComponent = () => {
  return (
    <div className="flex flex-wrap justify-center gap-6">
      <Card
        title="Wooden House, Florida"
        description="Enter a freshly updated and thoughtfully furnished peaceful home surrounded by ancient trees, stone walls, and open meadows."
        imageSrc="/fondo2v2.png"
        rating={5.0}
      />
      <Card
        title="Modern Apartment, New York"
        description="Experience the vibrant city life in a modern apartment with stunning views and luxurious amenities."
        imageSrc="/fondo2v2.png"
        rating={4.8}
      />
    </div>
  );
};

export default CardComponent;