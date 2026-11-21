import Heading from '@/src/shared/components/typography/Heading'
import Link from 'next/link'

export default function notFound() {
  return (
    <div className='py-10 text-center'>
        <Heading>Perfil no Encontrado</Heading>
        <Link href={'/'}>Ir Al Inicio</Link>

    </div>
  )
}