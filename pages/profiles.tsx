
import { NextPageContext } from 'next';
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useCallback } from "react";

const images = [
  '/images/default-blue.png',
  '/images/default-red.png',
  '/images/default-slate.png',
  '/images/default-green.png'
]

interface UserCardProps {
  name: string;
}

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/auth',
        permanent: false,
      }
    }
  }

  return {
    props: {}
  }
}

const UserCard: React.FC<UserCardProps> = ({ name }) => {
  // const imgSrc = images[Math.floor(Math.random() * 4)];
  const imgSrc = images[1];
  return (
    <div className='group flex-row w-44 mx-auto'>
      <div 
        className='w-44 h-44 rounded-md 
          flex item-center border-2 
          border-transparent 
          group-hover:cursor-pointer 
          group-hover:border-white 
          overflow-hidden'
      >
        <img draggable={false} src={imgSrc} alt="Profile" />
      </div>
      <div 
        className='
          mt-4
          text-gray-400
          text-2xl
          text-center
          group-hover:text-white'
      >
        {name}
      </div>
    </div>
  );
}

const Profiles = () => {

  const router = useRouter();

  const selectProfile = useCallback(() => {
    router.push('/');
  }, [router]);

  return (
    <div className='flex items-center h-full justify-center'>
      <div className='flex flex-col'>
        <h1 className='text-3xl md:text6xl text-white text-center'>Ai đang xem phim</h1>
        <div className='flex items-center justify-between gap-8 mt-10'>
          <div onClick={() => selectProfile()}>
            <UserCard name="dd"/> 
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profiles;