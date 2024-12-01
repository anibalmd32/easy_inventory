'use client';
import NextImage from 'next/image';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Spinner from '@/components/shared/Spinner/Spinner';
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';

export default function AuthPage() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    setLoading(true);
    setErrorMessage(null);

    const formData = new FormData(event.target);
    const response = await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirect: false,
    });

    if (response?.error) {
      setErrorMessage(response.error);
    } else {
      const tokenResponse = await fetch('/api/auth/session');
      const session = await tokenResponse.json();

      if (session?.user?.isEmployee) {
        router.push('/billing');
      } else {
        router.push('/');
      }
    }
    setLoading(false);
  };
  return (
    <div className="flex justify-center flex-col gap-8 items-center min-h-screen min-w-full">
      <div className="text-gray-200 flex flex-col gap-2 justify-center items-center">
        <NextImage
          src="/logo.png"
          alt="logo"
          className="w-16 h-16 rounded-full"
          width={40}
          height={40}
        />
        <h1 className="text-sm md:text-2xl font-bold ml-2">
          Inversiones Jeicar, C.A.
        </h1>
      </div>
      <div className="w-[500px] mx-auto bg-gray-900 rounded-lg px-5 py-8 flex flex-col gap-5">
        <form className="w-[400px] mx-auto" onSubmit={handleSubmit}>
          <div className="mb-5">
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-200 dark:text-white w-full"
            >
              Tu correo
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="nombre@inventario.com"
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
          <div className="flex justify-center gap-2">
            <button
              type="submit"
              className="text-white bg-gray-800 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mx-auto flex items-center gap-2"
            >
              <span>Iniciar sesión</span>
              {loading && <Spinner />}
            </button>
          </div>
        </form>
      </div>

      <ProgressBar
        height="4px"
        color="#fff"
        options={{ showSpinner: false }}
        shallowRouting
      />
    </div>
  );
}
