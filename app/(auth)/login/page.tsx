/* eslint-disable @next/next/no-img-element */
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton"

export default function LoginPage() {
    return (
        <div className="relative flex min-h-screen w-full bg-white dark:bg-gray-800 font-sans overflow-hidden">
            {/* Left Side - Content */}
            <div className="flex w-full flex-col justify-center px-8 md:w-1/2 md:px-12 lg:w-[42%] xl:px-24 z-10">

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
                                <GoogleSignInButton />
                            </div>
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
