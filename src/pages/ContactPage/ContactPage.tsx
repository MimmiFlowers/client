const ContactPage = () => {
    return (
        <div className="mx-auto max-w-3xl px-6 py-12">
            <h1 className="mb-6 text-3xl font-bold">Contact Us</h1>
            <div className="space-y-4 text-lg text-gray-700">
                <p>
                    <span className="font-semibold">Address:</span> Rågsved,
                    Stockholm
                </p>
                <p>
                    <span className="font-semibold">Email:</span>{" "}
                    <a
                        href="mailto:info@mimmiflowers.se"
                        className="text-green-600 hover:underline"
                    >
                        info@mimmiflowers.se
                    </a>
                </p>
                <p>
                    <span className="font-semibold">Phone:</span>{" "}
                    <a
                        href="tel:+46000000000"
                        className="text-green-600 hover:underline"
                    >
                        +46 (0) 00 000 00 00
                    </a>
                </p>
                <p>
                    <span className="font-semibold">Opening hours:</span>{" "}
                    Mon&ndash;Fri 08:00&ndash;18:00, Sat 10:00&ndash;16:00
                </p>
            </div>
        </div>
    );
};

export default ContactPage;
