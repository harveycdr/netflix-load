import { NextApiRequest,NextApiResponse } from "next";
import { getServerSession } from "next-auth";

import prismadb from '@/lib/prismadb';
import { authOptions } from "@/pages/api/auth/[...nextauth]";

const serverAuth = async (req: NextApiRequest, res: NextApiResponse) => {
  
  const session = await getServerSession(req, res, authOptions);

  
  if (!session?.user?.email) {
    throw new Error('Không đăng nhập được 11');
  }
  
  const currentUser = await prismadb.user.findUnique({
    where: {
      email: session.user.email,
    }
  });

  // const currenUser = { name: "Hau Harvey", email: "harvey.hau4502@gmail.com" };
  
  if (!currentUser) {
    throw new Error('Không đăng nhập được 21');
  }
  
  return {currentUser};
};

export default serverAuth;