import React from "react";
import Image from "next/image";

interface RichTextNode {
    type?: string;
    text?: string;
    level?: number;
    children?: RichTextNode[];
}

export function RenderRichText({ content }: { content: RichTextNode[] }) {
    if (!content || !Array.isArray(content)) return null;

    return (
        <div className="space-y-4 text-foreground/90 leading-relaxed">
            {content.map((block, index) => {
                if (block.type === "heading") {
                    const headingText = block.children?.map((c) => c.text).join("") || "";
                    if (!headingText.trim()) return null;

                    if (block.level === 1) {
                        return <h1 key={index} className="text-3xl md:text-4xl font-bold mt-8 mb-4 text-foreground">{headingText}</h1>;
                    }
                    if (block.level === 2) {
                        return <h2 key={index} className="text-2xl md:text-3xl font-bold mt-7 mb-3 text-foreground">{headingText}</h2>;
                    }
                    return <h3 key={index} className="text-xl md:text-2xl font-bold mt-6 mb-2 text-foreground">{headingText}</h3>;
                }

                if (block.type === "paragraph") {
                    const textContent = block.children?.map((c) => c.text).join("") || "";
                    if (!textContent.trim()) return null;

                    return (
                        <p key={index} className="text-base md:text-lg text-foreground/80 leading-relaxed font-normal">
                            {textContent}
                        </p>
                    );
                }

                return null;
            })}
        </div>
    );
}
