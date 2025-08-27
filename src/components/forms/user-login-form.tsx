"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { setUser } from "@/redux/features/auth/authSlice";
import { useAppDispatch } from "@/redux/hooks";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import { TApiErrorResponse } from "@/app/types/error";
import { useGetCartQuery } from "@/redux/features/cart/cartApi";

const formSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email.",
    }),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters.",
    }),
});

export function LoginForm() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [login, { isLoading }] = useLoginMutation();
    const { refetch } = useGetCartQuery();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "apponislamdev@gmail.com",
            password: "123456",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await login(values).unwrap();
            dispatch(
                setUser({
                    user: response.data.user,
                    token: response.data.accessToken,
                })
            );

            // await refetch();

            console.log(refetch());

            toast.success("Welcome back!", {
                description: "Login successful",
                duration: 2000,
            });
            router.push("/");
        } catch (error: unknown) {
            let errorMessage = "Invalid credentials";

            if (typeof error === "object" && error !== null && "data" in error) {
                const apiError = error as { data?: TApiErrorResponse };

                // Prefer the first error source message if available
                if (Array.isArray(apiError.data?.errorSources) && apiError.data.errorSources.length > 0) {
                    errorMessage = apiError.data.errorSources[0].message;
                } else if (apiError.data?.message) {
                    errorMessage = apiError.data.message;
                }
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }

            toast.error("Login failed", {
                description: errorMessage,
                duration: 2000,
            });
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-md">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="john@example.com" {...field} />
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
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Logging in...
                        </>
                    ) : (
                        "Login"
                    )}
                </Button>
            </form>
        </Form>
    );
}
