import ProgressiveStepper from "./components/stepper";

interface createCommunityLayoutProps {
  children: React.ReactNode;
}

export default function CreateCommunityLayout({
  children,
}: createCommunityLayoutProps) {
  return (
    <>
      <header className="sticky top-0 z-10 bg-white">
        <ProgressiveStepper />
      </header>
      {children}
    </>
  );
}
