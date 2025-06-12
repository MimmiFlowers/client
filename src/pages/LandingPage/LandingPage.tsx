import Specials from '../../components/Specials/Specials';
import CollectionList from '../../components/CollectionList/CollectionList';
import './LandingPage.css';

function LandingPage() {
  return (
    <div className='Landing-page-container'>
      <Specials setting={'Favorite'} />
      <Specials setting={'Season'} />
      <CollectionList />
    </div>
  );
};

export default LandingPage;