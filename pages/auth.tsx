import { useCallback, useState } from "react";
import { NextPageContext } from 'next';
import { signIn, getSession} from "next-auth/react";
import { useRouter } from "next/router";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa"; 
import axios from "axios";

import Input from "@/components/Input";

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);

  if (session) {
    return {
      redirect: {
        destination: '/profiles',
        permanent: false,
      }
    }
  }

  return {
    props: {}
  }
}

const Auth = () => {

  const router = useRouter();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [variant, setVariant] = useState('login');

  const toggleVariant = useCallback(() => {
    setVariant((currentVariant) => currentVariant == 'login' ? 'register': 'login');
  }, []);

  // const login = useCallback(async () => {
  //   await axios.post('/api/signin', {
  //     email, password
  //   }).then(response => {

  //     if (response.status === 200){
  //       console.log("Đăng nhập thành công", response.data);
  //       router.push('/profiles');
  //     }
  //   })
  //   .catch(error => {
  //     console.log("Bắt lỗi" , error.response.data );
  //   });

  // }, [email, password, router]);

  const login = useCallback(async () => {
    try {
      const status = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl: '/'
      });

      if (status?.ok) {
        router.push('/profiles');
      }
      
    }catch (error ){
      console.log(error);
    }
  }, [email, password, router]);

  const register = useCallback(async () => {
    await axios.post('/api/register', {
      email,
      name, 
      password
    }).then(response => {

      if (response.status === 200){
        console.log("đăng ký thành công acc:", response.data);
      }
    })
    .catch(error => {
      console.log("Bắt lỗi" , error.response.data );
    });
  }, [email, name, password, login]);


  return (
    <div className="relative h-full w-full bg-[url('/images/hero.jpg')] bg-no-repeat bg-center bg-fixed bg-cover">
      <div className="bg-black w-full h-full lg:bg-opacity-50">
        <nav className="px-12 py-5">
          <img src="/images/logo.png" alt="logo" className="h-12" />
        </nav>
        <div className="flex justify-center">
          <div className="bg-black bg-opacity-70 px-16 py-16 self-center mt-2 lg:w-2/5 lg:max-w-md rounded-md w-full ">
            <h2 className="text-white text-4xl mb-8 font-semibold ">
              {variant == 'login' ? 'Đăng nhập' : 'Đăng ký'}
            </h2>
            <div className="flex flex-col gap-4">
              {variant == 'register' && (
                <Input
                  label="Tài khoản"
                  onChange={(ev: any) => setName(ev.target.value)}
                  id="name"
                  type="text"
                  value={name}
                />
              ) }
              <Input
                label="Email"
                onChange={(ev: any) => setEmail(ev.target.value)}
                id="email"
                type="email"
                value={email}
              />
              <Input
                label="Mật khẩu"
                onChange={(ev: any) => setPassword(ev.target.value)}
                id="password"
                type="password"
                value={password}
              />
            </div>
            <button 
              className="bg-red-600 py-3 text-white rounded-md w-full mt-10 hover:bg-red-700 transition"
              onClick={variant === 'login' ? login : register}>
              {variant === 'login' ? 'Đăng nhập' : 'Đăng ký'}
            </button>

            <div className="flex flex-row items-center gap-4 mt-8 justify-center">
              <div
                className=" w-10 h-10 bg-white rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition">
                <FcGoogle size={30} />
              </div>
              <div
                className=" w-10 h-10 bg-white rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition">
                <FaGithub size={30} />
              </div>
            </div>

            <p className="text-neutral-500 mt-12">
              {variant === 'login' ? 'Lần đầu dùng NetFlix? | ' : 'Đã có tài khoản rồi? | '}
                <span onClick={toggleVariant} className="text-while ml-1 hover:underline cursor-pointer">
                {variant === 'login' ? 'Tạo tài khoản' : 'Đăng nhập'}
                </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;