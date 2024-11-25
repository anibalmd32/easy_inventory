'use client';

import NextImage from 'next/image';
import { useFormStatus } from 'react-dom';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const router = useRouter();

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const response = await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirect: false,
    });

    if (response?.error) {
      console.log('response', response);
      setErrorMessage(response.error);
    } else {
      const tokenResponse = await fetch('/api/auth/session');
      const session = await tokenResponse.json();

      if (session?.user?.isEmployee) {
        router.push('/billing'); // Redirección a callbackUrl para empleados
      } else {
        router.push('/'); // Redirección general para otros usuarios
      }
    }
  };
  return (
    <div className="flex justify-center flex-col gap-8 items-center min-h-screen">
      <div className="text-gray-200 flex flex-col gap-2 justify-center items-center">
        <NextImage
          src="/billing.svg"
          alt="logo"
          className="w-16 h-16"
          width={40}
          height={40}
        />
        <h1 className="text-sm md:text-2xl font-bold ml-2">Inventario fácil</h1>
      </div>
      <form className="max-w-sm mx-auto" onSubmit={handleSubmit}>
        <div className="mb-5">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-200 dark:text-white"
          >
            Tu email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="name@flowbite.com"
            required
          />
        </div>
        <div className="mb-5">
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-200 dark:text-white"
          >
            Tu contraseña
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-5 text-red-200">
          {errorMessage && <p>{errorMessage}</p>}
        </div>
        <LoginButton />
      </form>
    </div>
  );
}

function LoginButton() {
  const { pending } = useFormStatus();

  const handleClick = (event: any) => {
    if (pending) {
      event.preventDefault();
    }
  };

  return (
    <button
      aria-disabled={pending}
      type="submit"
      onClick={handleClick}
      className="text-white bg-gray-900 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
    >
      Iniciar sesión
    </button>
  );
}
