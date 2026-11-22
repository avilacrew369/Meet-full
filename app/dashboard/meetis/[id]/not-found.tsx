import Heading from '@/src/shared/components/typography/Heading'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className='py-10 text-center'>
        <Heading>No Existe ese Meeti</Heading>
        <Link href={'/dashboard/meetis'}>Volver a mis Meetis</Link>
    </div>
  )
}
