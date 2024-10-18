import CommunityItem from './CommunityItem';

const CommunityList = ({ communities }) => {
  if (!communities.length) {
    return <p>No communities found.</p>;
  }

  return (
    <div className="community-list">
      {communities.map((community) => (
        <CommunityItem key={community._id} community={community} />
      ))}
    </div>
  );
};

export default CommunityList;