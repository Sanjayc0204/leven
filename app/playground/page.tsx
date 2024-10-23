import LargeCommunityCard from "@/components/ui/community-card-lg";

export default function PlaygroundPage() {
  return (
    <div>
      <h1>Component Playground</h1>
      <div className="flex flex-wrap justify-center gap-4">
        <LargeCommunityCard
          imgUrl={"/images/placeholder.svg"}
          communityName={"Community Name"}
          communityDescription={"Community Description"}
          _id={"123"}
        />
        <LargeCommunityCard
          imgUrl={"/images/placeholder.svg"}
          communityName={"Community Name"}
          communityDescription={"Community Description"}
          _id={"123"}
        />
        <LargeCommunityCard
          imgUrl={"/images/placeholder.svg"}
          communityName={"Community Name"}
          communityDescription={"Community Description"}
          _id={"123"}
        />
      </div>
    </div>
  );
}
