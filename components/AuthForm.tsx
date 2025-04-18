"use client";

import { z } from "zod";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { auth } from "@/firebase/client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { signIn, signUp } from "@/lib/actions/auth.action";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import FormField from "./FormField";

// Schema validation for the form
const authFormSchema = (type: FormType) => {
    return z.object({
        name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
        email: z.string().email(),
        password: z.string().min(3),
    });
};

const AuthForm = ({ type }: { type: FormType }) => {
    const router = useRouter();

    const formSchema = authFormSchema(type);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            console.log("Form submitted", data);

            if (type === "sign-up") {
                const { name, email, password } = data;

                const userCredential = await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );

                console.log('User created', userCredential);

                const result = await signUp({
                    uid: userCredential.user.uid,
                    name: name!,
                    email,
                });

                if (!result.success) {
                    toast.error(result.message);
                    return;
                }

                toast.success("Account created successfully. Please sign in.");
                router.push("/sign-in");
            } else {
                const { email, password } = data;

                const userCredential = await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                );

                console.log('Signed in user:', userCredential);

                const idToken = await userCredential.user.getIdToken();
                if (!idToken) {
                    toast.error("Sign in Failed. Please try again.");
                    return;
                }

                await signIn({
                    email,
                    idToken,
                });

                toast.success("Signed in successfully.");
                router.push("/");
            }
        } catch (error) {
            console.log("Error during sign-up/sign-in:", error);
            toast.error(`There was an error: ${error.message || error}`);
        }
    };

    const isSignIn = type === "sign-in";

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="card-border lg:min-w-[566px] w-full max-w-md">
                <div className="flex flex-col gap-6 card py-14 px-10">
                    <div className="flex flex-row gap-2 justify-center items-center">
                        <Image src="/logo.svg" alt="logo" height={32} width={38} />
                        <h2 className="text-primary-100 text-xl font-semibold">PrepWise</h2>
                    </div>

                    <h3 className="text-center text-lg font-medium">
                        Practice job interviews with AI
                    </h3>

                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="w-full space-y-6 mt-4"
                        >
                            {!isSignIn && (
                                <FormField
                                    control={form.control}
                                    name="name"
                                    label="Name"
                                    placeholder="Your Name"
                                    type="text"
                                />
                            )}

                            <FormField
                                control={form.control}
                                name="email"
                                label="Email"
                                placeholder="Your email address"
                                type="email"
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                label="Password"
                                placeholder="Enter your password"
                                type="password"
                            />

                            <Button className="w-full btn cursor-pointer hover:bg-blue-500 focus:ring-2 focus:ring-blue-500" type="submit">
                                {isSignIn ? "Sign In" : "Create an Account"}
                            </Button>
                        </form>
                    </Form>

                    <p className="text-center text-sm">
                        {isSignIn ? "No account yet?" : "Have an account already?"}
                        <Link
                            href={!isSignIn ? "/sign-in" : "/sign-up"}
                            className="font-bold text-user-primary ml-1"
                        >
                            {!isSignIn ? "Sign In" : "Sign Up"}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthForm;
