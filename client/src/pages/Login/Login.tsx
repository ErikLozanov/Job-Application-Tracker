import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLogin } from "../../hooks/useAuth";

const Login = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const { mutate: login, isPending, isError, error } = useLogin();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        login(formData);
    };

    return (
        <div className="min-h-screen flex">
            <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-white px-8 py-12 lg:px-24">
                <div className="w-full max-w-sm">
                    <Link
                        to="/"
                        className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-8 block"
                    >
                        JobTracker
                    </Link>

                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        Welcome back
                    </h2>
                    <p className="text-gray-500 mb-8">
                        Please enter your details to sign in.
                    </p>

                    {isError && (
                        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 text-sm rounded-r">
                            {(error as any)?.response?.data?.message ||
                                "Login failed"}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                required
                                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                required
                                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="flex justify-end mb-2">
                            <Link
                                to="/forgot-password"
                                className="text-sm font-medium text-blue-600 hover:underline"
                            >
                                Forgot password?
                            </Link>
                        </div>
                        <button
                            type="submit"
                            disabled={isPending}
                            className={`w-full py-3 px-4 rounded-lg text-white font-bold shadow-lg transform transition-all duration-200 
                bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:-translate-y-0.5
                ${isPending ? "opacity-70 cursor-not-allowed" : ""}`}
                        >
                            {isPending ? "Signing in..." : "Sign in"}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-gray-500">
                        Don't have an account?{" "}
                        <Link
                            to="/register"
                            className="font-semibold text-blue-600 hover:text-blue-500 hover:underline"
                        >
                            Create free account
                        </Link>
                    </p>
                </div>
            </div>

            <div className="hidden md:flex md:w-1/2 bg-gray-900 relative overflow-hidden items-center justify-center p-12">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-900 to-purple-900 opacity-90" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />

                <div className="relative z-10 text-white max-w-lg text-center">
                    <h2 className="text-4xl font-bold mb-6">
                        Master your job search.
                    </h2>
                    <p className="text-lg text-blue-100 leading-relaxed">
                        "The secret to getting ahead is getting started. Track
                        every application, ace every interview, and land your
                        dream job."
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
