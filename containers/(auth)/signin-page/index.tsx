'use client';

// import { FormError } from '@/components/form-error';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useSignIn } from './hooks/useSignIn';

const SignInContainer = () => {
  const { form, error, successMessage, onSubmit, isPending } = useSignIn();

  return (
    <div className="max-w-[460px] mx-auto">
      {/* Logo */}
      <div className="flex">
        <img src="images/logo.svg" alt="PV RUGS" className="h-8" />
      </div>

      {/* Welcome message with adjusted spacing */}
      <div className="flex  mt-5">
        <h1 >Welcome back!</h1>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm text-[#111827] font-medium">
                  Email Address
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="Enter your email"
                    type="email"
               
             
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
              <FormItem className="space-y-2 mt-5">
                <FormLabel className="text-sm text-[#111827] font-medium">
                  Password
                </FormLabel>
                <FormControl>
                  <Input
             
             
            
                    {...field}
                    disabled={isPending}
                    placeholder="Enter your password"
                    type="password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-between pt-4 mt-4">
            <a
              href="/forgot-password"
              className="text-sm text-[#4B5563] hover:underline"
            >
              Forgot Password?
            </a>
            <button
              type="submit"
              disabled={isPending}
              className=" px-3 py-2 bg-white border border-[#D1D5DB] rounded-lg text-base focus:ring-1 focus:ring-[#D1D5DB] focus:border-[#D1D5DB]"
              style={{
                backgroundColor: '#000000',
                color: '#ffffff' // Added explicit white color
              }}
            >
              Sign In
            </button>
          </div>
          {/* {error && 

            <FormError message={error} />
          } */}
          {/* <FormSuccess message={successMessage} /> */}

          {/* Promotional Banner */}
          <div className=" p-4 mt-4 bg-orange-50 text-warning-text rounded-lg">
            ✓ To support you during the pandemic super pro features are free
            until March 31st.
          </div>
        </form>
      </Form>
    </div>
  );
};

export default SignInContainer;
