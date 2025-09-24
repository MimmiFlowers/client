import TituleBlock from "../../components/TituleBlock/TituleBlock";
import Specials from "../../components/Specials/Specials";
import CollectionList from "../../components/CollectionList/CollectionList";

const LandingPage = () => {
    return (
        <div className="flex h-full w-full flex-col items-center justify-center">
            <TituleBlock />
            <Specials key={"Favorite"} setting={"Favorite"} />
            <Specials key={"Season"} setting={"Season"} />
            <CollectionList />
        </div>
    );
};

export default LandingPage;
