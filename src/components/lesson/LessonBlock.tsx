import Image from "next/image";
import { type LessonContentBlock } from "@/types/learning";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

interface LessonBlockProps {
    block: LessonContentBlock;
    className?: string;
}

export function LessonBlock({ block, className }: LessonBlockProps) {
    switch (block.block_type) {
        case "text":
            return (
                <div className={cn("prose dark:prose-invert max-w-none", className)}>
                    <ReactMarkdown>{block.content}</ReactMarkdown>
                </div>
            );

        case "image":
            return (
                <div className={cn("relative w-full aspect-video rounded-lg overflow-hidden", className)}>
                    <Image
                        src={block.content}
                        alt="Lesson image"
                        fill
                        className="object-cover"
                    />
                </div>
            );

        case "video":
            return (
                <div className={cn("relative w-full aspect-video rounded-lg overflow-hidden", className)}>
                    <iframe
                        src={block.content}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </div>
            );

        case "example":
            return (
                <div className={cn("bg-muted p-4 rounded-lg", className)}>
                    <ReactMarkdown>{block.content}</ReactMarkdown>
                </div>
            );

        case "interactive":
            // You can implement custom interactive components here
            return (
                <div className={cn("p-4 border rounded-lg", className)}>
                    {block.content}
                </div>
            );

        default:
            return null;
    }
} 