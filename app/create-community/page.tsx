import { Separator } from "@/components/ui/separator";
import CommunityInformationForm from "./community-details-form";

export default function CommunityInformationPage() {
  return (
    <>
      <div className="flex justify-center items-center">
        <div className="flex flex-col flex-grow items-center justify-center">
          <h2 className="text-2xl font-bold tracking-tight">
            Community Details
          </h2>
          <p className="text-muted-foreground text-base">
            What is your community going to be about?
          </p>
          <div className="w-1/2">
            <Separator className="my-6 mx-30" />
          </div>
          <div className="w-1/2">
            <CommunityInformationForm />
          </div>
        </div>
      </div>
    </>
  );
}
