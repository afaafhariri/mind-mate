"use client";
import Image from "next/image";

export default function Loading() {
    return (
        <div className="fixed inset-1 z-[9999] flex flex-col items-center justify-center bg-background/90 text-foreground">
            <h2 className="text-xl font-semibold mb-4 animate-pulse">Mind Mate.</h2>
            <div className="w-[100px] h-[100px] animate-pulse">
                <Image
                    src="/meditation-round-svgrepo-com.svg"
                    alt="Loading"
                    width={100}
                    height={100}
                    className="filter"
                    style={{
                        filter: 'brightness(0) saturate(100%) invert(var(--foreground-invert, 0))'
                    }}
                    priority
                />
            </div>
        </div>
    )
}