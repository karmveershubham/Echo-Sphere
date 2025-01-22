"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import logo from '../../public/logo.png'
import { Github, Twitter, Youtube } from "lucide-react";
import Cookies from "js-cookie";


export default function RegisterPage() {
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // For validation error messages
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {

        if (!username || !email || !password ) {
            setError("Please fill in all fields");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters long");
            return;
        }

        const res = await fetch('http://localhost:1337/api/auth/local/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                email,
                password,
            }),
        });
        
        const data = await res.json();
        console.log(data);
        
        if (!data.error) {
            console.log("Registeration successful")
            // Store the JWT token (e.g., in localStorage or React context)
            console.log("data", data);
            Cookies.set("jwt", data.jwt, { expires: 7, secure: true, sameSite: "strict" });
            Cookies.set("isAuthenticated", "true", { expires: 7, secure: true, sameSite: "strict" });
            router.push("/chat");
        } else {
            setError(data.error.message);
        }
        } catch (error) {
            setError('An error occurred.');
        } finally {
            setLoading(false);
        }
  };

  return (
    <>
      <div className="min-h-screen flex flex-col">
        {/* Navigation */}
        <nav className="flex items-center justify-between p-4 md:p-6">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={logo}
              alt="EchoSphere Logo"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <span className="text-xl font-semibold">EchoSphere</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/features" className="text-gray-600 hover:text-gray-900">
              Features
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-gray-900">
              Contact
            </Link>
            <Link href="/privacy" className="text-gray-600 hover:text-gray-900">
              Privacy
            </Link>
            <Link
              href="/login"
              className="bg-[#7C3AED] text-white px-4 py-2 rounded-lg hover:bg-[#6D28D9] transition-colors"
            >
              Login
            </Link>
          </div>

          <button className="md:hidden">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </nav>

        <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
          <div className="flex justify-center flex-col items-center">
            <Image src={logo} alt="star logo" width={50} height={50} />
            <h2 className="mt-6 text-center text-2xl leading-9 tracking-tight text-gray-900 dark:text-white">
              Register your account
            </h2>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
            <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
              <form className="space-y-6" onSubmit={handleRegister}>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                    Name
                  </label>
                  <div className="mt-2">
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setName(e.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                    Email address
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                    Password
                  </label>
                  <div className="mt-2">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div>
                  <Button
                    type="submit"  disabled={loading}
                    className="flex w-full border border-black justify-center rounded-md bg-black px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-white transition-colors hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                  >
                    Register
                  </Button>
                  <p className="text-red-600 text-center text-[16px] my-4">{error && error}</p>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="p-4 md:p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600">© 2025 Echo Sphere, Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="https://github.com" className="text-gray-600 hover:text-gray-900">
              <Github className="w-6 h-6" />
              <span className="sr-only">GitHub</span>
            </Link>
            <Link href="https://twitter.com" className="text-gray-600 hover:text-gray-900">
              <Twitter className="w-6 h-6" />
              <span className="sr-only">Twitter</span>
            </Link>
            <Link href="https://youtube.com" className="text-gray-600 hover:text-gray-900">
              <Youtube className="w-6 h-6" />
              <span className="sr-only">YouTube</span>
            </Link>
          </div>
        </footer>
      </div>
    </>
  );
}
