import * as z from "zod";
import { auth } from "@/lib/auth";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const uploadthing = createUploadthing();

export const ourFileRouter = {
  imageUploader: uploadthing({
    image: {
      maxFileSize: "16MB",
      maxFileCount: 1,
    },
  })
    .input(
      z.object({
        url: z.string().min(1, "Url is required!").trim(),
      }),
    )
    .middleware(async ({ req }) => {
      const session = await auth.api.getSession({
        headers: req.headers,
      });

      if (!session?.user) throw new UploadThingError("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.ufsUrl);
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
