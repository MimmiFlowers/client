const TituleBlock = () => {
  return (
    <div className="relative w-full h-[80vh] overflow-hidden items-center justify-center flex">
      <img
        className="absolute w-full h-full object-cover blur-xs"
        src="src/assets/images/bannerMock.jpg"
        alt="welcome banner"
      />
      <p className="absolute text-white font-semibold text-8xl z-10 uppercase drop-shadow-lg">
        Welcome!
      </p>
    </div>
  );
};

export default TituleBlock;
