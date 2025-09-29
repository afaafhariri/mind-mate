"use client";

import {useState, useEffect} from "react";
import Loading from "./loading";

export default function SplashScreen({children}: Readonly<{ children: React.ReactNode; }>) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 5000);
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return <Loading />;
    }
    return <>{children}</>;
}