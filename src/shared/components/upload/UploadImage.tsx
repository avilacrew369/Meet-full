import { useState } from "react"
import Image from "next/image"
import { UploadDropzone } from "../../utils/uploadthings"
import { twMerge } from "tailwind-merge"
import { useFormContext } from "react-hook-form"
import { CommunityInput } from "@/src/features/communities/schema/communitySchema"
import { FormError } from "../forms"

export default function UploadImage() {
    const { formState: {errors}, setValue} = useFormContext<CommunityInput>()
    const [uploadedImage, setUploadedImage] = useState('')
  return (
    <>
         <UploadDropzone 
                    endpoint={'meetiUploader'}
                    className="ut-button:bg-green-500 hover:ut-button:bg-green-700"
                    onClientUploadComplete={(res) => {
                        setUploadedImage(res[0].ufsUrl)
                        setValue('image', res[0].ufsUrl, {shouldValidate: true})
                    }}
                    appearance={{
                        button: "bg-green-500 w-full rounded-none"
                    }}
                    config={{
                        cn: twMerge,
                        mode: 'auto'
                    }}
                />
            {errors.image && <FormError>{errors.image.message}</FormError>}
            

                   {uploadedImage && (
                                    <>
                                        <p className="text-lg">Imagen Nueva</p>
                                        <Image
                                            src={uploadedImage}
                                            alt="Imagen Publicada"
                                            width={300}
                                            height={200}
                                        />
                                    </>
                                )}
    </>
  )
}
