import { useTranslation } from "react-i18next";
import TituleBlock from "../../components/TituleBlock/TituleBlock";
import Specials from "../../components/Specials/Specials";
import CollectionList from "../../components/CollectionList/CollectionList";

const LandingPage = () => {
    const { t } = useTranslation();

    return (
        <div className="flex w-full flex-col items-center">
            <title>{t("seo.home_title")}</title>
            <TituleBlock />

            {/* Product sections */}
            <Specials key={"Favorite"} setting={"Favorite"} />
            <Specials key={"Season"} setting={"Season"} />

            {/* Collections */}
            <CollectionList />

            {/* Bottom spacer handled by Footer mt-16 */}
        </div>
    );
};

export default LandingPage;
