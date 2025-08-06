import TituleBlock from "../../components/TituleBlock/TituleBlock";
import Specials from "../../components/Specials/Specials";
import CollectionList from "../../components/CollectionList/CollectionList";

const LandingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <TituleBlock />
      <Specials setting={"Favorite"} />
      <Specials setting={"Season"} />
      <CollectionList />
    </div>
  );
};

export default LandingPage;
