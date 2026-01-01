"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<"form" | "otp">("form");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
    city: "",
    country: "",
    profession: "",
    maritalStatus: "",
  });
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:8080/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Signup failed");
      }

      setStep("otp");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const result = await signIn("credentials", {
      redirect: false,
      email: formData.email,
      otp,
    });

    if (result?.error) {
      setError("Invalid OTP");
    } else {
      router.push("/");
    }
  };

  if (step === "otp") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-24">
        <h1 className="text-2xl font-bold mb-4">Verify Email</h1>
        <form onSubmit={handleVerify} className="w-full max-w-md space-y-4">
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full p-2 border rounded text-black"
            required
          />
          {error && <p className="text-red-500">{error}</p>}
          <button
            type="submit"
            className="w-full p-2 bg-blue-500 text-white rounded"
          >
            Verify
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
      <form onSubmit={handleSignup} className="w-full max-w-md space-y-4">
        <div className="flex gap-4">
          <input
            name="firstName"
            placeholder="First Name"
            onChange={handleChange}
            className="w-1/2 p-2 border rounded text-black"
            required
          />
          <input
            name="lastName"
            placeholder="Last Name"
            onChange={handleChange}
            className="w-1/2 p-2 border rounded text-black"
            required
          />
        </div>
        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full p-2 border rounded text-black"
          required
        />
        <input
          name="dateOfBirth"
          type="date"
          onChange={handleChange}
          className="w-full p-2 border rounded text-black"
          required
        />
        <div className="flex gap-4">
          <input
            name="city"
            placeholder="City"
            onChange={handleChange}
            className="w-1/2 p-2 border rounded text-black"
            required
          />
          <input
            name="country"
            placeholder="Country"
            onChange={handleChange}
            className="w-1/2 p-2 border rounded text-black"
            required
          />
        </div>
        <input
          name="profession"
          placeholder="Profession"
          onChange={handleChange}
          className="w-full p-2 border rounded text-black"
          required
        />
        <select
          name="maritalStatus"
          onChange={handleChange}
          className="w-full p-2 border rounded text-black"
          required
        >
          <option value="">Select Marital Status</option>
          <option value="Single">Single</option>
          <option value="Married">Married</option>
          <option value="Divorced">Divorced</option>
          <option value="Widowed">Widowed</option>
        </select>

        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}
