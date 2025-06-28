import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
    className?: string;
    priority?: boolean;
    loading?: "lazy" | "eager";
    sizes?: string;
    width?: number;
    height?: number;
}

export function Logo({
    className,
    priority = false,
    loading = "lazy",
    sizes = "(max-width: 640px) 120px, (max-width: 768px) 140px, (max-width: 1024px) 160px, 200px",
    width = 200,
    height = 60
}: LogoProps) {
    return (
        <Image
            src="/logo.png"
            alt="Garaad"
            width={width}
            height={height}
            className={cn(
                "h-12 w-auto sm:h-14 md:h-16 lg:h-20 max-w-[160px] sm:max-w-[180px] md:max-w-[200px] transition-all duration-300 object-contain",
                className
            )}
            priority={priority}
            loading={loading}
            sizes={sizes}
        />
    );
}

export default Logo; 