"use client";
import React from "react";
import dynamic from "next/dynamic";

const Excalidraw = dynamic(
    async () => {
        const lib = await import("@excalidraw/excalidraw");
        return lib.Excalidraw;
    },
    {
        ssr: false,
        loading: () => <div className="animate-pulse bg-muted rounded-xl h-full w-full" />
    }
);

interface ExcalidrawDiagramProps {
    elements?: any[];
    initialData?: any;
}

const ExcalidrawDiagram: React.FC<ExcalidrawDiagramProps> = ({ elements, initialData }) => {
    return (
        <div className="w-full h-[400px] rounded-2xl overflow-hidden border border-black/5 dark:border-white/5 shadow-2xl bg-white">
            <Excalidraw
                initialData={{
                    elements: elements || initialData?.elements || [],
                    appState: {
                        viewBackgroundColor: "transparent",
                        ...initialData?.appState
                    },
                    scrollToContent: true,
                }}
                viewModeEnabled={true}
            />
        </div>
    );
};

export default ExcalidrawDiagram;
