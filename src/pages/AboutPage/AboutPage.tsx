import { Link } from "react-router";

const AboutPage = () => {
    return (
        <div className="mx-auto max-w-3xl px-6 py-12">
            <h1 className="mb-6 text-3xl font-bold">About Mimmi Flowers</h1>
            <p className="mb-4 text-lg leading-relaxed text-gray-700">
                Mimmi Flowers is a Stockholm-based florist dedicated to
                creating beautiful, hand-crafted bouquets for every occasion.
            </p>
            <p className="mb-4 text-lg leading-relaxed text-gray-700">
                Whether you are celebrating a birthday, expressing love, or
                simply brightening someone's day, our carefully curated
                arrangements are designed to bring joy.
            </p>
            <p className="text-lg leading-relaxed text-gray-700">
                We offer delivery across Stockholm and convenient pickup from
                our location in Rågsved.
            </p>
            <div className="mt-8">
                <Link
                    to="/Catalog"
                    className="rounded-lg bg-green-600 px-6 py-3 text-white hover:bg-green-700"
                >
                    Browse our catalog
                </Link>
            </div>
        </div>
    );
};

export default AboutPage;
