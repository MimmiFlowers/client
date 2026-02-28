import bannerMock from "../../assets/images/bannerMock.jpg";

const TituleBlock = () => {
    return (
        <div className="relative flex h-[80vh] w-full items-center justify-center overflow-hidden">
            <img
                className="absolute h-full w-full object-cover blur-xs"
                src={bannerMock}
                alt="welcome banner"
            />
            <p className="absolute z-10 text-8xl font-semibold text-white uppercase drop-shadow-lg">
                Welcome!
            </p>
        </div>
    );
};

export default TituleBlock;
