const CommunityItem = ({ community }) => (
  <div className="community-card">
    <h2>{community.name}</h2>
    <p>{community.description}</p>
    {/* Additional details can be added here */}
  </div>
);

export default CommunityItem;