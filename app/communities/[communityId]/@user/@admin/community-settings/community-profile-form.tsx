"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useCommunityStore } from "@/app/store/communityStore";

const communityInformationSchema = z.object({
  name: z.string().min(1, "Community name is required"),
  description: z.string().min(1, "Community description is required"),
  image: z.string().url("Please enter a valid URL"),
});

type CommunityInformationValues = z.infer<typeof communityInformationSchema>;

export default function CommunityInformationForm() {
  const [imagePreview, setImagePreview] = useState("");
  const router = useRouter();
  const communityData = useCommunityStore((state) => state.communityData);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
  });

  const form = useForm<CommunityInformationValues>({
    resolver: zodResolver(communityInformationSchema),
    mode: "onChange",
    defaultValues: formData,
  });

  useEffect(() => {
    if (communityData) {
      const updatedValues = {
        name: communityData.name || "",
        description: communityData.description || "",
        image: communityData.image || "",
      };
      setImagePreview(updatedValues.image);
      form.reset(updatedValues);
    }
  }, [communityData]);

  const handleImageUrlChange = (url: string) => {
    setImagePreview(url);
  };

  const onSubmit = (values: CommunityInformationValues) => {
    console.log("Submitting data!");
    if (
      values.name !== formData.name ||
      values.description !== formData.description ||
      values.image !== formData.image
    ) {
      setFormData(values);
    }
  };

  return (
    <div className="pb-4">
      <Form {...form}>
        <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Community Name</FormLabel>
                <FormControl>
                  <Input placeholder="The Brotherhood of Steel" {...field} />
                </FormControl>
                <FormDescription>
                  This is pretty self explanatory.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Community Description</FormLabel>
                <FormControl>
                  <Input
                    placeholder="A brief description of your community"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Keep it short and succinct, about 1 sentence or so.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Community Image URL</FormLabel>
                {imagePreview && (
                  <div className="mb-4 overflow-hidden rounded-lg border border-gray-200">
                    <img
                      src={imagePreview}
                      alt="Community preview"
                      className="h-96 w-full object-cover"
                      onError={() => setImagePreview("")}
                    />
                  </div>
                )}
                <FormControl>
                  <Input
                    placeholder="https://example.com/image.jpg"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      handleImageUrlChange(e.target.value);
                    }}
                  />
                </FormControl>
                <FormDescription>
                  Enter the URL of your community image.
                </FormDescription>
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
