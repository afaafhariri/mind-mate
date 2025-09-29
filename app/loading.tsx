"use client";
import Image from "next/image";

export default function Loading() {
    return (
        <div className="fixed inset-1 z-[9999] flex flex-col items-center justify-center bg-white/80">
            <h2 className="text-xl font-semibold mb-4">Loading...</h2>
            <Image
                src="/web-app-manifest-512x512.png"
                alt="Loading"
                width={100}
                height={100}
                className="animate-spin"
            />
        </div>
    )
}