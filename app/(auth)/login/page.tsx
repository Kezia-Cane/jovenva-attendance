/* eslint-disable @next/next/no-img-element */
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton"

export default function LoginPage() {
    return (
        <div className="relative flex min-h-screen w-full bg-white font-sans overflow-hidden">
            {/* Left Side - Content */}
            <div className="flex w-full flex-col justify-center px-8 md:w-1/2 md:px-12 lg:w-[42%] xl:px-24 z-10 bg-white">

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

            {/* Right Side - Teal Gradient & Curve */}
            <div className="absolute top-0 right-0 hidden h-full w-[50vw] md:flex flex-col justify-center items-center pl-0 pb-0 overflow-hidden rounded-bl-[50px]">
                <div className="absolute inset-0 bg-[url('/signInImage.png')] bg-cover bg-center bg-no-repeat z-0" />
                <div className="absolute inset-0 bg-teal-300/80 z-10 mix-blend-multiply" />

                {/* Chakra Logo Placeholder - Assuming user wants the aesthetic */}
                <div className="relative z-20 flex flex-col items-center">
                    {/* You can replace this with an actual SVG logo if available */}
                    <h2 className="text-4xl font-bold text-white tracking-widest flex items-center gap-2">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13 10V3L4 14H11V21L20 10H13Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        chakra
                    </h2>
                </div>
            </div>
        </div>
    )
}
