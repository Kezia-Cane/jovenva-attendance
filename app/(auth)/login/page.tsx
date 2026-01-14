/* eslint-disable @next/next/no-img-element */
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton"

export default function LoginPage() {
    return (
        <div className="relative flex min-h-screen w-full bg-white dark:bg-gray-800 font-sans overflow-hidden">
            {/* Left Side - Content */}
            <div className="flex w-full flex-col justify-between px-8 md:w-1/2 md:px-12 lg:w-[42%] xl:px-24 pt-24 pb-12 z-10">

                <div className="flex flex-col flex-1 justify-center">
                    <div className="mb-8 lg:mb-16">
                        <h1 className="mb-2 text-3xl font-bold text-teal-300">
                            Welcome Back
                        </h1>
                        <p className="text-sm font-bold text-gray-400">
                            Enter your email and password to sign in
                        </p>
                    </div>

                    <div className="flex flex-col gap-6">
                        {/* 
                          Authentication Provider
                          Styled to match the clean Purity look.
                        */}
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                    Sign in with
                                </label>
                                <GoogleSignInButton />
                            </div>
                        </div>

                        <div className="flex items-center gap-2 my-2">
                            <div className="h-px w-full bg-gray-200"></div>
                            <span className="text-xs text-gray-400 uppercase">or</span>
                            <div className="h-px w-full bg-gray-200"></div>
                        </div>

                        <div className="text-center">
                            <p className="font-medium text-gray-400 text-sm">
                                Don't have an account?
                                <span className="ml-1 cursor-pointer font-bold text-teal-300 hover:text-teal-400">
                                    Sign Up
                                </span>
                            </p>
                        </div>
                    </div>
                </div>



            </div>

            {/* Right Side - Image Overlay */}
            <div className="absolute top-0 right-0 hidden h-full w-[50vw] md:block pl-20 pb-4">
                <div
                    className="h-full w-full bg-cover bg-center bg-no-repeat relative"
                    style={{
                        backgroundImage: "url('/signInImage.png')",
                        backgroundSize: 'cover',
                        borderBottomLeftRadius: "25px"
                    }}
                >
                    {/* Gradient overlay for text readability if needed, but Purity usually has clean image */}
                </div>
            </div>
        </div>
    )
}
