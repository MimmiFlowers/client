import { Link } from "react-router";

const NotFoundPage = () => {
    return (
        <div className="mx-auto max-w-xl px-6 py-12 text-center">
            <h1 className="mb-4 text-6xl font-bold text-gray-300">404</h1>
            <h2 className="mb-4 text-2xl font-semibold text-gray-800">
                Page Not Found
            </h2>
            <p className="mb-6 text-gray-600">
                The page you are looking for does not exist or has been moved.
            </p>
            <Link
                to="/"
                className="rounded-lg bg-green-600 px-6 py-3 text-white hover:bg-green-700"
            >
                Go to Homepage
            </Link>
        </div>
    );
};

export default NotFoundPage;
