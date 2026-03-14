"use client";

import * as React from "react";
import { RiSunLine, RiMoonLine } from "react-icons/ri";
import { Button } from "@/components/ui/button";

export function ModeToggle() {
    const [theme, setTheme] = React.useState<"light" | "dark">("light");

    React.useEffect(() => {
        const isDarkMode = document.documentElement.classList.contains("dark");
        setTheme(isDarkMode ? "dark" : "light");
    }, []);

    React.useEffect(() => {
        const root = document.documentElement;
        if (theme === "dark") {
            root.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            root.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    };

    return (
        <Button
            variant="link"
            size="icon"
            onClick={toggleTheme}
            /* hover:bg-transparent removes the background gray/hover effect */
            className="relative flex items-center justify-center hover:bg-transparent"
        >
            {/* Sun Icon: Hidden in dark mode using display classes instead of animations */}
            <RiSunLine className="h-[1.2rem] w-[1.2rem] dark:hidden" />

            {/* Moon Icon: Shown only in dark mode */}
            <RiMoonLine className="hidden h-[1.2rem] w-[1.2rem] dark:block" />

            <span className="sr-only">Toggle theme</span>
        </Button>
    );
}
