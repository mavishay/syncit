/* eslint-disable jsx-a11y/label-has-associated-control,
 jsx-a11y/anchor-is-valid,react/jsx-props-no-spreading */
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import http from 'axios';
import { useCallback } from 'react';
import { useRouter } from 'next/router';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Layout from '../../../components/layout/layout';

const schema = yup.object().shape({
  name: yup.string().required('Required!').test('Invalid name!', (str) => (str.search(' ') > 1 && str.length > 3)),
  email: yup.string().email('Invalid email!').required('Required!'),
  password: yup.string().min(7, 'Password to short!').required('Required!'),
}).required();

function Login() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isValid } } = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
  });

  const onSubmit = useCallback(async (data) => {
    try {
      await http.post('/api/auth/register', { ...data });
      router.push('/');
    } catch (e) {
      window.alert(e?.response?.data?.message);
    }
  }, []);

  return (
    <Layout title="Login">
      <div className="h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <img className="mx-auto h-36 w-auto" src="/cal-sync-logo.png" alt="Cal sync logo" />
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Register new account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Or
              {' '}
              <Link href="/auth/login">
                <span className="font-medium text-red-600 hover:text-red-500 cursor-pointer">
                  login to existing account
                </span>
              </Link>
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="name" className="sr-only">
                  Full Name
                </label>
                <input
                  id="name"
                  {...register('name')}
                  type="text"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                  placeholder="Full name"
                />
              </div>
              <div>
                <label htmlFor="new-email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="new-email-address"
                  {...register('email')}
                  type="email"
                  autoComplete="new-email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  {...register('password')}
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                />
              </div>
              <div>
                {errors?.name && (
                  <div className="p-0 m-0 text-red-500 text-sm">
                    Name:
                    {' '}
                    {errors.name?.message}
                  </div>
                )}
                {errors?.email && (
                <div className="p-0 m-0 text-red-500 text-sm">
                  Email:
                    {' '}
                  {errors.email?.message}
                </div>
                )}
                {errors?.password && (
                  <div className="p-0 m-0 text-red-500 text-sm">
                    Password:
                    {' '}
                    {errors.password?.message}
                  </div>
                )}
              </div>
            </div>
            <div>
              <button
                disabled={!isValid}
                type="submit"
                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${!isValid ? 'bg-red-300 cursor-not-allowed' : 'hover:bg-red-700'}`}
              >
                Create new account
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default Login;
