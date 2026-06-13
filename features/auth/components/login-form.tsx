"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const router = useRouter();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signInWithGitHub = async () => {
    await authClient.signIn.social(
      {
        provider: "github",
      },
      {
        onSuccess: () => {
          router.push("/");
        },
        onError: (error) => {
          toast.error("something went wrong: " + error.error.message);
        },
      }
    );
  };

  const signInWithGoogle = async () => {
    await authClient.signIn.social(
      {
        provider: "google",
      },
      {
        onSuccess: () => {
          router.push("/");
        },
        onError: (error) => {
          toast.error("something went wrong: " + error.error.message);
        },
      }
    );
  };

  const onSubmit = async (data: LoginFormValues) => {
    await authClient.signIn.email(
      {
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: () => {
          router.push("/");
        },
        onError: (error) => {
          toast.error(error.error.message);
        },
      }
    );
  };

  const isPending = form.formState.isSubmitting;

  return (
    <div className="flex flex-col gap-5">
      <div className="gradient-border rounded-xl overflow-hidden">
        <div className="bg-card/80 backdrop-blur-xl rounded-xl border border-border/40 shadow-2xl shadow-black/30">
          <div className="px-7 pt-7 pb-4 text-center border-b border-border/30">
            <h2 className="text-xl font-bold tracking-tight text-foreground">Welcome back! 👋</h2>
            <p className="text-sm text-muted-foreground/70 mt-1">Sign in to your account to continue</p>
          </div>
          <div className="p-7">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid gap-5">
                  <div className="flex flex-col gap-3">
                    <Button
                      onClick={signInWithGitHub}
                      variant="outline"
                      className="w-full gap-x-2 border-border/60 bg-muted/30 hover:bg-muted/60 hover:border-border transition-all duration-200"
                      type="button"
                      disabled={isPending}
                    >
                      <Image
                        src="/images/github.svg"
                        alt="github"
                        width={18}
                        height={18}
                        className="brightness-0 invert opacity-80"
                      />
                      <span className="text-sm">Continue with GitHub</span>
                    </Button>
                    <Button
                      onClick={signInWithGoogle}
                      variant="outline"
                      className="w-full gap-x-2 border-border/60 bg-muted/30 hover:bg-muted/60 hover:border-border transition-all duration-200"
                      type="button"
                      disabled={isPending}
                    >
                      <Image
                        src="/images/google.svg"
                        alt="google"
                        width={18}
                        height={18}
                      />
                      <span className="text-sm">Continue with Google</span>
                    </Button>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border/40" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="bg-card px-3 text-muted-foreground/60 font-medium uppercase tracking-wider">or</span>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="you@example.com"
                              className="bg-muted/30 border-border/60 focus:border-primary/60 focus:bg-background transition-all duration-200 focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground/40"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="••••••••"
                              className="bg-muted/30 border-border/60 focus:border-primary/60 focus:bg-background transition-all duration-200 focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground/40"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-md shadow-primary/20 border-0 transition-all duration-200 hover:shadow-lg hover:shadow-primary/30 font-semibold"
                      disabled={isPending}
                    >
                      {isPending ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin size-4" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                          </svg>
                          Signing in...
                        </span>
                      ) : "Sign In"}
                    </Button>
                  </div>

                  <div className="text-center text-sm text-muted-foreground/70">
                    Don&apos;t have an account?{" "}
                    <a href="/signup" className="text-primary hover:text-primary/80 font-medium underline-offset-4 hover:underline transition-colors">
                      Sign Up
                    </a>
                  </div>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
