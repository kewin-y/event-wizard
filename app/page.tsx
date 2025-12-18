"use client";

import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
// import Link from "next/link"; <- Used to navigate through routes in nextjs
import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";
// import Image from "next/image";

export default function Home() {
    return (
        <>
            <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md p-4 border-b border-slate-200 dark:border-slate-700 flex flex-row justify-between items-center shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-3"></div>
                    <h1 className="font-semibold text-slate-800 dark:text-slate-200">
                        Event Wizard
                    </h1>
                </div>
                <SignOutButton />
            </header>
            <main className="p-8 flex flex-col gap-8">
                <Content />
            </main>
        </>
    );
}

function SignOutButton() {
    // Convex Thing
    const { isAuthenticated } = useConvexAuth();
    // Convex Thing
    const { signOut } = useAuthActions();
    // Nextjs Thing
    const router = useRouter();

    return (
        <>
            {isAuthenticated && (
                <button
                    className="bg-slate-600 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
                    onClick={async () => {
                        await signOut();
                        router.push("signin");
                    }}
                    // Used to be
                    // onClick={() =>
                    //     void signOut().then(() => {
                    //         router.push("signin");
                    //     })
                    // }
                >
                    Sign out
                </button>
            )}
        </>
    );
}

function Content() {
    // Convex Thing
    const { viewer, numbers } =
        useQuery(api.myFunctions.listNumbers, {
            count: 10,
        }) ?? {};

    // Convex Thing
    // addNumber is a function that modifies the database
    const addNumber = useMutation(api.myFunctions.addNumber);

    if (viewer === undefined || numbers === undefined) {
        return (
            <div className="mx-auto">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                    <div
                        className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                        className="w-2 h-2 bg-slate-600 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                    ></div>
                    <p className="ml-2 text-slate-600 dark:text-slate-400">
                        Loading...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 max-w-lg mx-auto">
            <div>
                <h2 className="font-bold text-xl text-slate-800 dark:text-slate-200">
                    Welcome {viewer ?? "Anonymous"}!
                </h2>
            </div>

            <div className="flex flex-col gap-4">
                <button
                    className="bg-slate-700 hover:bg-slate-800 dark:bg-slate-600 dark:hover:bg-slate-500 text-white text-sm font-medium px-6 py-3 rounded-lg cursor-pointer transition-all duration-200 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                    onClick={() => {
                        void addNumber({
                            value: Math.floor(Math.random() * 10),
                        });
                    }}
                >
                    + Generate random number
                </button>
                <div className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl p-4 shadow-sm">
                    <p className="font-semibold text-slate-800 dark:text-slate-200 mb-2">
                        Newest Numbers
                    </p>
                    <p className="text-slate-700 dark:text-slate-300 font-mono text-lg">
                        {numbers?.length === 0
                            ? "Click the button to generate a number!"
                            : (numbers?.join(", ") ?? "...")}
                    </p>
                </div>
            </div>
        </div>
    );
}
