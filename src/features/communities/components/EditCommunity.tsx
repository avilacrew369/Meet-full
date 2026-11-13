"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormProvider, useForm } from "react-hook-form"
import { Form, FormSubmit } from "@/src/shared/components/forms"
import { SelectCommunity } from "../types/community.types"
import toast from "react-hot-toast"
import { redirect } from "next/navigation"
import { CommunityInput, CommunitySchema } from "../schema/communitySchema"
import CommunityForm from "./CommunitieForm"
import { editCommunityAction } from "../actions/community-actions"

type Props = {
    community: SelectCommunity
}

export default function EditCommunity({community} : Props) {
    const {id, name, description, image} = community
     const methods =  useForm({
            resolver: zodResolver(CommunitySchema),
            mode: 'all',
            defaultValues: {
               name,
               description,
               image
               
            }
        })

        const onSubmit = async(data: CommunityInput) => {
           const { error, success} = await editCommunityAction(data, id)
            if(error) toast.error(error)
            if(success) {
                toast.success(success)
                redirect('/dashboard/communities')
            }
        
        }
  return (
    <FormProvider {...methods}  >
        <Form
            onSubmit={(methods.handleSubmit(onSubmit))}
        >
            <CommunityForm />
            <FormSubmit value={'Guardar Cambios'} />
        </Form>
    </FormProvider>
  )
}