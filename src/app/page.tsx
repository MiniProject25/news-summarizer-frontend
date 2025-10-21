'use client'

import { useState } from "react"
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast"
import { Eye, EyeOff } from 'lucide-react'; // Using icons for a cleaner look
import SwitchModalButton from "@/components/ModalSliderButton";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [pwd, setPw] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [activeMode, setActiveMode] = useState("login");
  const router = useRouter()

  const login = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/user/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, password: pwd }),
      credentials: "include",
    });

    const data = await response.json();
    console.log("JWT received: " + data.token)

    if (data.token) {
      toast.success("Successfully Logged in!")
      setTimeout(() => {
        router.replace("/Home")
      }, 1000)
    } else {
      toast.error("Error while logging in. Try Again");
    }
  }

  const signup = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/user/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, password: pwd }),
      })

      const data = await response.json();

      if (data.message == "Successfully Registered") {
        toast.success("Successfully created an account");
        console.log("User created: ", data.newUser);
        setEmail("");
        setPw("");
        setActiveMode("login");
      }
      else {
        setActiveMode("signup");
        setEmail("");
        setPw("")
        toast.error("Error while creating an account");
      }

    } catch (error) {
      console.error("Error while signing up. Try again later.");
    }
  }

  return (
    <div className="bg-slate-100 min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-lg space-y-6">
        <div className="flex justify-around space-x-4 mb-4">
          {/* <button
            type="button"
            className="cursor-pointer px-5 py-2 rounded-lg font-semibold text-slate-700 border border-slate-300 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
            onClick={() => setActiveMode("login")}
          >
            Login
          </button>
          <button
            type="button"
            className="cursor-pointer px-5 py-2 rounded-lg font-semibold text-slate-700 border border-slate-300 hover:bg-slate-200 hover:text-slate-900 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
            onClick={() => setActiveMode("signup")}
          >
            Signup
          </button> */}
          <SwitchModalButton mode={activeMode} setActive={setActiveMode} />
        </div>

        {/* ## Header Section ## */}
        <div className="text-center">
          {activeMode == "signup" ? (
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Create an account</h1>
              <p className="text-slate-500 mt-2 text-sm">Please enter your details.</p>
            </div>
          ) : (
            <div className="text-center">
              <h1 className="text-3xl font-bold text-slate-800">Login to your account</h1>
              <p className="text-slate-500 mt-2 text-sm">Welcome back! Please enter your details.</p>
            </div>
          )}
        </div>

        {activeMode == "signup" ? (
          <div>
            {/* ## Form Section ## */}
            <form onSubmit={(e) => { e.preventDefault(); signup(); }} className="space-y-6">
              {/* Email Input */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm text-slate-700 font-semibold">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your Email Address"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 transition-shadow"
                />
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label htmlFor="pwd" className="text-sm text-slate-700 font-semibold">Password</label>
                <div className="relative">
                  <input
                    id="pwd"
                    type={showPass ? "text" : "password"}
                    value={pwd}
                    onChange={(e) => setPw(e.target.value)}
                    placeholder="Enter your password"
                    className="[&::-ms-reveal]:hidden w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 transition-shadow"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-slate-700"
                  >
                    {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  className="w-full py-2 px-4 bg-slate-800 text-white font-semibold rounded-lg hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors"
                >
                  Sign Up
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div>
            {/* ## Form Section ## */}
            <form onSubmit={(e) => { e.preventDefault(); login(); }} className="space-y-6">
              {/* Email Input */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm text-slate-700 font-semibold">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your Email Address"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 transition-shadow"
                />
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label htmlFor="pwd" className="text-sm text-slate-700 font-semibold">Password</label>
                <div className="relative">
                  <input
                    id="pwd"
                    type={showPass ? "text" : "password"}
                    value={pwd}
                    onChange={(e) => setPw(e.target.value)}
                    placeholder="Enter your password"
                    className="[&::-ms-reveal]:hidden w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 transition-shadow"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-slate-700"
                  >
                    {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  className="w-full py-2 px-4 bg-slate-800 text-white font-semibold rounded-lg hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors"
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
      <Toaster position="top-center" />
    </div>
  )
}
