import { NextApiRequest, NextApiResponse } from 'next';
import prismadb from '@/lib/prismadb';
import {compare} from 'bcrypt';
import { useSession } from 'next-auth/react';

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
  
  try {

    if (req.method !== 'POST') {
      return res.status(405).json('Không đúng phương thức');
    }

    const { email, password } = req.body;
    
    const existingUser = await prismadb.user.findUnique({
      where: {
        email
      }
    });
    
    if (!existingUser || !existingUser.hashedPassword) {
      return res.status(422).json('Tài khoản không tồn tại');
    }

    const inCorrectPassword = compare(
      password,
      existingUser?.hashedPassword
    );

    if (!inCorrectPassword)
    {
      return res.status(422).json('Mật khẩu bị sai');
    }

    return res.status(200).json(existingUser);
  }
  catch (error) {
    return res.status(400).json('Không xác định');
  }
}