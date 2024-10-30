import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./breadcrumb";
import { usePathname } from "next/navigation";
import { Button } from "./button";
import { signIn, useSession } from "next-auth/react";
import { AvatarIcon } from "./navbar";

export default function CommunityHeader() {
  const pathName = usePathname();
  const pathSegments = pathName.split("/").filter(Boolean);
  const { data: session, status } = useSession();
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <Breadcrumb>
        <BreadcrumbList>
          {pathSegments.map((segment, index) => {
            const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
            return (
              <BreadcrumbItem key={href}>
                {index === pathSegments.length - 1 ? (
                  <BreadcrumbPage>{segment}</BreadcrumbPage>
                ) : (
                  <>
                    <BreadcrumbLink href={href}>{segment}</BreadcrumbLink>
                    <BreadcrumbSeparator />
                  </>
                )}
              </BreadcrumbItem>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
      <div className="ml-auto flex justify-center">
        {status === "authenticated" ? (
          <AvatarIcon img={session.user.image} />
        ) : status === "loading" ? (
          ""
        ) : (
          <Button
            className="group inline-flex h-9 w-max items-center text-white justify-center rounded-md bg-black px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-800 hover:text-gray-100 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
            onClick={() => signIn("google")}
          >
            Log In
          </Button>
        )}
      </div>
    </header>
  );
}
