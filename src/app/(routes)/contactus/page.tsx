"use client";

import { useState } from "react";

export default function Contact() {
    const [form, setForm] = useState({ name: "", email: "", message: "" });

    const handleChange = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        alert("Thank you for contacting us! We will get back to you soon.");
    };

    return (
        <main className="min-h-screen bg-gray-50 py-16 px-6">
            <div className="max-w-xl mx-auto bg-white p-10 rounded-2xl shadow-md">
                <h1 className="text-3xl font-bold mb-6 text-gray-900">Contact Us</h1>

                <p className="text-lg text-gray-700 mb-8">
                    Have questions, feedback, or suggestions? We’d love to hear from you.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-4 py-2 focus:ring focus:ring-blue-200"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-4 py-2 focus:ring focus:ring-blue-200"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Message</label>
                        <textarea
                            name="message"
                            value={form.message}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-4 py-2 h-32 resize-none focus:ring focus:ring-blue-200"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        Send Message
                    </button>
                </form>
            </div>
        </main>
    );
}
