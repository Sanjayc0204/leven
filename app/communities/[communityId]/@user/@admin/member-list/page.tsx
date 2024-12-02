"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Search, UserX } from "lucide-react";
import { useCommunityStore } from "@/app/store/communityStore";

// Simulated server action
async function removeMember(memberId: string) {
  // In a real application, this would be a server action that removes the member from the database
  console.log(`Removing member with ID: ${memberId}`);
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
  return { success: true };
}

interface Member {
  id: string;
  name: string;
  email: string;
  joinDate: string;
}

const initialMembers: Member[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    joinDate: "2023-01-15",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    joinDate: "2023-02-20",
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    joinDate: "2023-03-10",
  },
  {
    id: "4",
    name: "Alice Brown",
    email: "alice@example.com",
    joinDate: "2023-04-05",
  },
  {
    id: "5",
    name: "Charlie Davis",
    email: "charlie@example.com",
    joinDate: "2023-05-12",
  },
];

export default function CommunityAdminDashboard() {
  const [members, setMembers] = useState(initialMembers);
  const [searchTerm, setSearchTerm] = useState("");
  const [memberToRemove, setMemberToRemove] = useState<Member | null>(null);
  const actualMembers = useCommunityStore(
    (state) => state.communityData
  )?.members;

  useEffect(() => {
    if (actualMembers) {
      setMembers(actualMembers);
      console.log("jahangir", actualMembers);
    }
  }, [actualMembers]);

  return <div>Hi</div>;

  const filteredMembers = members?.filter(
    (member) =>
      member?.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member?.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  //   const handleRemoveMember = async () => {
  //     if (memberToRemove) {
  //       const result = await removeMember(memberToRemove.id);
  //       if (result.success) {
  //         setMembers(members.filter((m) => m.id !== memberToRemove.id));
  //       }
  //       setMemberToRemove(null);
  //     }
  //   };

  //   return (
  //     <div className="container mx-auto py-10">
  //       <h1 className="text-2xl font-bold mb-6">Community Members</h1>
  //       <div className="flex items-center mb-4">
  //         <Search className="w-5 h-5 mr-2 text-gray-500" />
  //         <Input
  //           type="text"
  //           placeholder="Search members..."
  //           value={searchTerm}
  //           onChange={(e) => setSearchTerm(e.target.value)}
  //           className="max-w-sm"
  //         />
  //       </div>
  //       <div className="border rounded-lg overflow-hidden">
  //         <Table>
  //           <TableHeader>
  //             <TableRow>
  //               <TableHead>Name</TableHead>
  //               <TableHead>Email</TableHead>
  //               <TableHead>Join Date</TableHead>
  //               <TableHead>Actions</TableHead>
  //             </TableRow>
  //           </TableHeader>
  //           <TableBody>
  //             {filteredMembers.map((member) => (
  //               <TableRow key={member.id}>
  //                 <TableCell>{member.name}</TableCell>
  //                 <TableCell>{member.email}</TableCell>
  //                 <TableCell>{member.joinDate}</TableCell>
  //                 <TableCell>
  //                   <Button
  //                     variant="destructive"
  //                     size="sm"
  //                     onClick={() => setMemberToRemove(member)}
  //                   >
  //                     <UserX className="w-4 h-4 mr-2" />
  //                     Remove
  //                   </Button>
  //                 </TableCell>
  //               </TableRow>
  //             ))}
  //           </TableBody>
  //         </Table>
  //       </div>
  //       <AlertDialog
  //         open={!!memberToRemove}
  //         onOpenChange={() => setMemberToRemove(null)}
  //       >
  //         <AlertDialogContent>
  //           <AlertDialogHeader>
  //             <AlertDialogTitle>
  //               Are you sure you want to remove this member?
  //             </AlertDialogTitle>
  //             <AlertDialogDescription>
  //               This action cannot be undone. The member will lose access to the
  //               community.
  //             </AlertDialogDescription>
  //           </AlertDialogHeader>
  //           <AlertDialogFooter>
  //             <AlertDialogCancel>Cancel</AlertDialogCancel>
  //             <AlertDialogAction onClick={handleRemoveMember}>
  //               Remove Member
  //             </AlertDialogAction>
  //           </AlertDialogFooter>
  //         </AlertDialogContent>
  //       </AlertDialog>
  //     </div>
  //   );
}
