export default function AboutUs() {
    return (
        <main className="min-h-screen bg-gray-50 py-16 px-6">
            <div className="max-w-3xl mx-auto bg-white p-10 rounded-2xl shadow-md">
                <h1 className="text-3xl font-bold mb-6 text-gray-900">About Us</h1>

                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                    Welcome to <span className="font-semibold">News-Aggreg</span> — a fast, clean, and unbiased
                    news aggregation platform designed for readers who want real information, not clutter.
                </p>

                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                    We fetch news from trusted global sources, summarise them using advanced AI models, and present them
                    in a simple format that's quick to read and easy to navigate.
                </p>

                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                    Our goal is to help you stay informed without getting overwhelmed.
                </p>

                <h2 className="text-2xl font-semibold mt-10 mb-4 text-gray-900">What We Offer</h2>
                <ul className="list-disc pl-5 text-gray-700 space-y-2">
                    <li>Clean and clutter-free design</li>
                    <li>Summarized news from reliable sources</li>
                    <li>Category-based filtering</li>
                    <li>Fast search for any article</li>
                    <li>Balanced news from multiple viewpoints</li>
                </ul>

                <p className="text-lg text-gray-700 leading-relaxed mt-10">
                    We are constantly improving the platform based on user feedback.
                    Thank you for being a part of our journey.
                </p>
            </div>
        </main>
    );
}
