"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUserProfileStore } from "@/app/store/userProfileStore";
import { toast } from "@/hooks/use-toast";

const profileFormSchema = z.object({
  username: z
    .string()
    .min(5, { message: "Username must be at least 5 characters long" })
    .max(30, { message: "Username cannot be longer than 30 characters" }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileForm() {
  const userProfile = useUserProfileStore((state) => state.userProfile);
  const userUsername = userProfile?.username;

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    mode: "onChange",
  });

  async function onSubmit(data: ProfileFormValues) {
    const updatedUserProfile = { ...userProfile };
    console.log(JSON.stringify(updatedUserProfile));

    (Object.keys(data) as Array<keyof ProfileFormValues>).forEach((key) => {
      if (key in updatedUserProfile) {
        updatedUserProfile[key] = data[key];
      }
    });

    const res = await fetch(`/api/users/${userProfile?._id}/profile`, {
      method: "PUT",
      body: JSON.stringify(updatedUserProfile),
    });

    if (res.ok) {
      const result = await res.json();
      console.log("Profile updated:", result.data);
    } else {
      console.error("Failed to update profile:", res.statusText);
    }
  }

  useEffect(() => {
    if (userUsername) {
      form.reset({ username: userUsername });
    }
  }, [userUsername, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="username" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button>Update Profile</Button>
      </form>
    </Form>
  );
}
