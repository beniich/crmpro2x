import { cn } from "@/lib/utils";
import React from "react";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
}

export const GlassCard = ({ children, className, ...props }: GlassCardProps) => {
    return (
        <div
            className={cn(
                "bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-xl",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};
