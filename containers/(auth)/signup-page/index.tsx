// import { FormError } from '@/components/form-error';
// import { FormSuccess } from '@/components/form-success';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Plus_Jakarta_Sans } from 'next/font/google';


import { useSignUp } from './hooks/useSignUp';

// import { Checkbox } from '@/components/ui/checkbox';


import { FaSpinner } from 'react-icons/fa';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const font = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  adjustFontFallback: false,
  preload: false
});

const SignUpContainer = () => {
  const { form, error, successMessage, onSubmit, isPending, loading } =
    useSignUp();

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 px-4 sm:px-16 w-full"
        >
          <div className="flex flex-col items-center justify-center gap-2 px-4 text-center sm:px-16">
            <h3 className="text-xl font-semibold dark:text-zinc-50">Sign Up</h3>
            <p className="text-sm text-gray-500 dark:text-zinc-400">
              Create an account with your email and password
            </p>
          </div>
          <div className="flex flex-col gap-2 ">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="bg-white">
                  <FormLabel
                    className={cn(
                      'text-signupLabel text-sm font-semibold',
                      font.className
                    )}
                  >
                    Full Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="rounded-[6px] pl-4 h-10 w-full" // Adjusted width
                      disabled={isPending}
                      placeholder="Enter Full Name"
                      type="text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="bg-white">
                  <FormLabel
                    className={cn(
                      'text-signupLabel text-sm font-semibold',
                      font.className
                    )}
                  >
                    Email Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="rounded-[6px] pl-4 h-10 w-full" // Adjusted width
                      disabled={isPending}
                      placeholder="Enter Email Address"
                      type="text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    className={cn(
                      'text-signupLabel text-sm font-semibold',
                      font.className
                    )}
                  >
                    Create Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="rounded-[6px] pl-4 h-10 w-full" // Adjusted width
                      disabled={isPending}
                      placeholder="Enter Password"
                      type="password"
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="max-h-[4px]">
            {' '}
            {/* Fixed height for error messages */}
            {/* <FormError message={error} />
            <FormSuccess message={successMessage} /> */}
          </div>

          <Button
            type="submit"
            className="bg-signupPrimary rounded-[8px] h-10 3xl:w-[462px] 3xl:h-[48px] w-full text-sm font-semibold"
            disabled={isPending}
          >
            sign up
            {loading && <FaSpinner className="animate-spin ml-2" />}
          </Button>
          <p className="text-center text-sm text-gray-600 mt-4 dark:text-zinc-400">
            {'Already have an account? '}
            <Link
              href="/signin"
              className="font-semibold text-gray-800 hover:underline dark:text-zinc-200"
            >
              Sign in
            </Link>
            {' instead.'}
          </p>
        </form>
      </Form>
    </>
  );
};

export default SignUpContainer;
