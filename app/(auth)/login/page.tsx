/* eslint-disable @next/next/no-img-element */
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton"

export default function LoginPage() {
    return (
        <div className="relative flex min-h-screen w-full bg-white dark:bg-gray-800">
            {/* Left Side - Form/Content */}
            <div className="flex w-full flex-col justify-center px-8 md:w-1/2 md:px-12 lg:w-[42%] xl:px-24">
                <div className="mb-10 lg:mb-20">
                    <h1 className="mb-2 text-3xl font-bold text-teal-300">
                        Welcome Back
                    </h1>
                    <p className="text-sm font-bold text-gray-400">
                        Enter your credentials to sign in
                    </p>
                </div>

                <div className="flex flex-col gap-6">
                    {/* 
                      Purity UI uses Email/Password inputs here. 
                      Since we use Google Sign In, we'll style it to fit the theme.
                    */}
                    <div className="flex flex-col gap-2">
                        <div className="text-sm font-normal text-gray-700 dark:text-gray-200">
                            Sign in with Google
                        </div>
                        <GoogleSignInButton />
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="h-px w-full bg-gray-200"></div>
                        <span className="text-xs text-gray-400">OR</span>
                        <div className="h-px w-full bg-gray-200"></div>
                    </div>

                    <div className="text-center">
                        <p className="font-medium text-gray-400">
                            Don't have an account?
                            <span className="ml-1 cursor-pointer font-bold text-teal-300 hover:text-teal-400">
                                Sign Up
                            </span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side - Image Overlay */}
            <div className="absolute right-0 hidden h-full w-[40vw] md:block">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: "url('https://raw.githubusercontent.com/creativetimofficial/public-assets/master/purity-ui-dashboard/purity-ui-dashboard-signin.png')",
                        borderBottomLeftRadius: "20px"
                    }}
                />
            </div>
        </div>
    )
}
