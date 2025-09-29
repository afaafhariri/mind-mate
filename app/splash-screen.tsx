"use client";

import {useState, useEffect} from "react";
import Loading from "./loading";

export default function SplashScreen() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return <Loading />;
    }
}