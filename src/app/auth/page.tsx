'use client';

import NextImage from 'next/image';

export default function AuthPage() {
  return (
    <div className="flex justify-center flex-col gap-8 items-center min-h-screen">
      <div className='text-gray-200 flex flex-col gap-2 justify-center items-center'>
        <NextImage
          src="/billing.svg"
          alt="logo"
          className="w-16 h-16"
          width={40}
          height={40}
        />
        <h1 className='text-sm md:text-2xl font-bold ml-2'>
          Inventario fácil
        </h1>
      </div>
      <form className="max-w-sm mx-auto">
        <div className="mb-5">
          <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-200 dark:text-white">Tu email</label>
          <input type="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@flowbite.com" required />
        </div>
        <div className="mb-5">
          <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-200 dark:text-white">Tu contraseña</label>
          <input type="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
        </div>
        <button type="submit" className="text-white bg-gray-900 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          Iniciar sesión
        </button>
      </form>
    </div>
  );
}
