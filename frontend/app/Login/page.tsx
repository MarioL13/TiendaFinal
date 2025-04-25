'use client';

import Login from "@/components/Login";
import Head from "next/head";

export default function PageLogin() { 
  return (
    <>
      <Head>
        <title>Iniciar Sesión</title>
        <meta name="description" content="Página de inicio de sesión para acceder a la plataforma." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <Login />
      </div>
    </>
  );
}
