"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image"; 
import { Button } from "@/components/ui/button";
import logo from "../../public/logo.png";
import Link from "next/link";
import { Github, Twitter, Youtube } from "lucide-react";
import Cookies from "js-cookie";

export default function Login() {
  const [identifier, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // State to show error messages if any
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!identifier || !password) {
        setError("Please fill in both fields");
        setLoading(false);
        return;
      }

      const res = await fetch("http://localhost:1337/api/auth/local", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier,
          password,
        }),
      });

      const data = await res.json();

      if (!data.error) {
        console.log("Login successful");
        console.log("data", data);

        // Store the JWT in a cookie
        Cookies.set("jwt", data.jwt, { expires: 7, secure: true, sameSite: "strict" });
        Cookies.set("isAuthenticated", "true", { expires: 7, secure: true, sameSite: "strict" });

        router.push("/chat");
      } else {
        setError(data.error.message);
      }
    } catch (error) {
      setError("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen flex flex-col">
        {/* Header */}
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
              href="/signup"
              className="bg-[#7C3AED] text-white px-4 py-2 rounded-lg hover:bg-[#6D28D9] transition-colors"
            >
              SignUp
            </Link>
          </div>

          <button className="md:hidden">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </nav>

        {/* Login Form */}
        <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
          <div className="flex justify-center flex-col items-center">
            <Image src={logo} alt="star logo" width={50} height={50} />
            <h2 className="mt-6 text-center text-2xl leading-9 tracking-tight text-gray-900 dark:text-white">
              Log in to your account
            </h2>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
            <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
              <form className="space-y-6" onSubmit={handleLogin}>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Email address
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={identifier}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Password
                  </label>
                  <div className="mt-2">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                    />
                    <label
                      htmlFor="remember-me"
                      className="ml-3 block text-sm leading-6 text-gray-900"
                    >
                      Remember me
                    </label>
                  </div>
                </div>

                <div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex w-full border border-black justify-center rounded-md bg-black px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-white transition-colors hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                  >
                    Log in
                  </Button>
                  <p className="text-red-600 text-center text-[16px] my-4">
                    {error && error}
                  </p>
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
