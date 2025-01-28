import { SignInSchema } from '@/schemas'; // Update to SignInSchema
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useMemo, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';


import { logIn } from '@/actions/auth'; // Change to signIn action

export const useSignIn = () => {


  const defaultValues = useMemo(
    () => ({
      email: '',
      password: ''
    }),
    []
  );

  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema), // Use SignInSchema
    defaultValues
  });

  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | undefined>('');
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState<boolean>(false);

  const clearMessages = useCallback(() => {
    setError('');
    setSuccessMessage('');
  }, []);

  const onSubmit = useCallback(
    async (values: z.infer<typeof SignInSchema>) => {
      clearMessages(); // Reset states
      setLoading(true);
      try {
        console.log('try', values);
        const signInData = await logIn({
          email: values?.email,
          password: values?.password
        });
        console.log("trial",signInData)

        if (signInData?.status !== 'success'&& signInData?.status!== undefined) {
       setError(signInData?.error || 'Sign-in failed.');
        } 
      } catch (err) {
        setError(
          'Unable to connect to the server. Please check your internet connection and try again.'
        );
      } finally {
        setLoading(false);
      }
    },
    [error, successMessage, loading]
  );

  return useMemo(
    () => ({
      form,
      error,
      successMessage,
      onSubmit,
      isPending,
      loading
    }),
    [form, error, successMessage, onSubmit, isPending, loading]
  );
};
