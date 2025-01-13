"use client";
import { useCommunityStore } from "@/app/store/communityStore";
import { useUserProfileStore } from "@/app/store/userProfileStore";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const generalSettingsFormSchema = z.object({
  leaderboard_enable: z.boolean() || null,
  leaderboard_streaks: z.boolean() || null,
  private: z.boolean() || null,
});

interface generalSettingsInterface {
  leaderboard: { enabled: boolean; showStreaks: boolean };
  privacy: { isPrivate: boolean };
}

type GeneralSettingsValues = z.infer<typeof generalSettingsFormSchema>;

export default function GeneralSettingsForm() {
  const communitySettingsData = (
    useCommunityStore((state) => state.communityData) as unknown as {
      settings: generalSettingsInterface;
    } | null
  )?.settings;

  const userId = useUserProfileStore((state) => state.userProfile)?._id;
  const communityName = useCommunityStore((state) => state.communityData)?.name;
  const communityId = useCommunityStore((state) => state.communityData)?._id;

  const [formData, setFormData] = useState({
    leaderboard_enable: true,
    leaderboard_streaks: true,
    private: false,
  });

  const mutation = useMutation({ mutationFn: updateGeneralSettings });

  useEffect(() => {
    if (communitySettingsData) {
      setFormData({
        leaderboard_enable: communitySettingsData?.leaderboard?.enabled,
        leaderboard_streaks: communitySettingsData?.leaderboard?.showStreaks,
        private: communitySettingsData?.privacy?.isPrivate || false,
      });
    }
  }, [communitySettingsData]);

  const form = useForm<GeneralSettingsValues>({
    resolver: zodResolver(generalSettingsFormSchema),
    mode: "onChange",
    defaultValues: formData,
  });

  if (communitySettingsData) {
    console.log("Community Settings: ", communitySettingsData);
  }

  function updateGeneralSettings(values: GeneralSettingsValues) {
    console.log("Updating data!");
    return fetch(`/api/communities/${communityId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        updateData: {
          name: communityName,
          settings: {
            privacy: {
              isPrivate: values.private,
            },
            leaderboard: {
              enabled: values.leaderboard_enable,
            },
          },
        },
        adminId: userId,
      }),
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorResponse = await response.json();
          throw new Error(`Error: ${errorResponse.error}`);
        }
        return response.json();
        console.log("Updated!");
      })
      .catch((error) => {
        console.error("Error joining community via invite:", error.message);
        throw error;
      });
  }

  const onSubmit = (values: GeneralSettingsValues) => {
    console.log("Submitting data!");
    if (
      values.leaderboard_enable !== formData.leaderboard_enable ||
      values.leaderboard_streaks !== formData.leaderboard_streaks ||
      values.private !== formData.private
    ) {
      setFormData(values);
      console.log("matating");
      mutation.mutate(values);
    }
  };

  return (
    <div className="pb-4">
      <Form {...form}>
        <form className="" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="leaderboard_enable"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Enable Leaderboard</FormLabel>
                  <FormDescription>
                    You can choose whether you want the leaderboard to be
                    displayed or not.
                  </FormDescription>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="leaderboard_streaks"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Enable Streaks</FormLabel>
                  <FormDescription>
                    You can choose whether you want streaks to be enabled or
                    not.
                  </FormDescription>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="private"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Private</FormLabel>
                  <FormDescription>
                    You can choose whether you want your community to be visible
                    in the community search page.
                  </FormDescription>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end py-4">
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
