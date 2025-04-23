'use client'

import { useRouter } from 'next/navigation'

const Login = () => {   
  const router = useRouter()
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="max-w-[720px] mx-auto">
        <div className="block mb-4 mx-auto border-b border-slate-300 pb-2 max-w-[360px]">
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.material-tailwind.com/docs/html/card"
            className="block w-full px-4 py-2 text-center text-slate-700 transition-all"
          >
          </a>
        </div>

        <div className="relative flex flex-col text-gray-900 bg-white shadow-md w-96 rounded-xl p-6">
          <div className="relative grid mx-4 mb-4 -mt-6 overflow-hidden text-white shadow-lg h-28 place-items-center rounded-xl bg-gradient-to-tr from-gray-900 to-gray-800">
            <h3 className="block font-sans text-3xl font-semibold text-white">Sign In</h3>
          </div>

          <div className="flex flex-col gap-4">
            <div className="relative h-11 w-full">
              <input className="w-full h-full px-3 py-3 border rounded-md text-sm outline-none border-gray-300 focus:border-gray-900" placeholder="Email" />
            </div>

            <div className="relative h-11 w-full">
              <input className="w-full h-full px-3 py-3 border rounded-md text-sm outline-none border-gray-300 focus:border-gray-900" type="password" placeholder="Password" />
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" id="rememberMe" className="w-5 h-5 text-gray-900" />
              <label htmlFor="rememberMe" className="text-gray-700">Remember Me</label>
            </div>
          </div>

          <div className="mt-6">
            <button className="block w-full bg-gray-900 text-white py-3 rounded-lg shadow-md hover:opacity-90">
              Sign In
            </button>
            <p className="flex justify-center mt-6 text-sm">
              Don't have an account?
              <a href="#" onClick={() => router.push('/Registrarte')} className="ml-1 font-bold text-gray-900 cursor-poiter">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
