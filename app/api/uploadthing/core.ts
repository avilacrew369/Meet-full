import { auth } from "@/lib/auth";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
  meetiUploader: f({
    image: {
      maxFileSize: "1MB",
      maxFileCount: 1,
    }
  })
    .middleware(async ({ req }) => {
      // Este código se ejecuta antes de subir el archivo
      // Pass req.headers directly — avoids next/headers which triggers the
      // nextCookies plugin's cookies().set() call outside a valid write scope,
      // which would throw and produce a 400.
      const session = await auth.api.getSession({ headers: req.headers });
      console.log('Upload middleware session:', session);
      // Prevenir que usuarios no autenticados no suban imágenes
      if (!session) throw new UploadThingError("Unauthorized");

      // Lo que se retorna aquí estará disponibe en onUploadComplete en `metadata`
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // Este código se ejecuta en el servidor una vez que se sube el archivo
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.ufsUrl);

      // Lo que se retorna aquí estará disponibe en `onClientUploadComplete` callback
      return { 
        uploadedBy: metadata.userId
       };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;