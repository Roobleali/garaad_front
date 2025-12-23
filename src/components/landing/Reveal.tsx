"use client";

import { ReactNode } from "react";

interface RevealProps {
    children: ReactNode;
    width?: "fit-content" | "100%";
}

export const Reveal = ({ children, width = "100%" }: RevealProps) => {
    return (
        <div style={{ position: "relative", width }}>
            {children}
        </div>
    );
};
