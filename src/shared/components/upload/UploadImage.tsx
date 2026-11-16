import { useState } from "react"
import Image from "next/image"
import { UploadDropzone } from "../../utils/uploadthings"
import { twMerge } from "tailwind-merge"
import { useFormContext } from "react-hook-form"
import { CommunityInput } from "@/src/features/communities/schema/communitySchema"
import { FormError } from "../forms"
import { MeetiInput } from "@/src/features/meetis/schema/meetiSchema"

type Props = {
    uploadedImageLabel: string
}

export default function UploadImage({uploadedImageLabel}: Props) {
    const { formState: {errors}, setValue, clearErrors, getValues } = useFormContext<CommunityInput | MeetiInput>()
    const [uploadedImage, setUploadedImage] = useState('')
    const [uploadError, setUploadError] = useState('')
    const currentImage = getValues('image') ? getValues('image') : null
  return (
    <>
         <UploadDropzone 
                    endpoint={'meetiUploader'}
                    className="ut-button:bg-green-500 hover:ut-button:bg-green-700"
                    onClientUploadComplete={(res) => {
                        setUploadedImage(res[0].ufsUrl)
                        setValue('image', res[0].ufsUrl, {shouldValidate: true})
                        clearErrors('image')
                        setUploadError('')
                    }}
                    onUploadError={(error) => {
                        console.error('Upload error:', error.code, error.message, error.cause)
                        setUploadError(error.message)
                    }}
                    appearance={{
                        button: "bg-green-500 w-full rounded-none"
                    }}
                    config={{
                        cn: twMerge,
                        mode: 'auto'
                    }}
                />
            {uploadError && <FormError>{uploadError}</FormError>}
            {errors.image &&<FormError>{errors.image.message}</FormError>}
            

                   {uploadedImage && (
                                    <>
                                        <p className="text-lg">{uploadedImageLabel}</p>
                                        <Image
                                            src={uploadedImage}
                                            alt="Imagen Publicada"
                                            width={300}
                                            height={200}
                                            className="h-auto"
                                            loading="eager"
                                        />
                                    </>
                                )}
                    {currentImage && !uploadedImage && (
                            <>
                                        <p className="text-lg">Imagen Actual</p>
                                        <Image
                                            src={currentImage}
                                            alt="Imagen Publicada"
                                            width={300}
                                            height={200}
                                            className="h-auto"
                                            loading="eager"
                                        />
                                    </>
                    )}
    </>
  )
}
