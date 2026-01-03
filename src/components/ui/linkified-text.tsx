import React from 'react';

interface LinkifiedTextProps {
    text: string;
    className?: string;
}

export const LinkifiedText: React.FC<LinkifiedTextProps> = ({ text, className }) => {
    if (!text) return null;

    // Regex specifically designed for:
    // 1. http:// or https:// URLs
    // 2. URLs starting with www.
    // 3. Naked domains with common TLDs (com, org, net, info, biz, edu, gov, so)
    // Explaining the regex:
    // (https?:\/\/[^\s]+) -> Matches http/https links
    // | -> OR
    // (www\.[^\s]+\.[^\s]{2,}) -> Matches www. links
    // | -> OR
    // ([a-zA-Z0-9-]+\.(?:com|org|net|info|biz|edu|gov|so)(?:\/[^\s]*)?) -> Matches naked domains with specific TLDs
    const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+\.[^\s]{2,})|([a-zA-Z0-9-]+\.(?:com|org|net|info|biz|edu|gov|so)(?:\/[^\s]*)?)/gi;

    const parts = text.split(urlRegex);

    return (
        <span className={className}>
            {parts.map((part, i) => {
                if (!part) return null;

                // Check if the part matches any of our capture groups
                const isUrl = urlRegex.test(part);
                // Reset regex state because of 'g' flag
                urlRegex.lastIndex = 0;

                if (isUrl) {
                    let href = part;
                    if (!href.match(/^https?:\/\//i)) {
                        href = `https://${href}`;
                    }

                    return (
                        <a
                            key={i}
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline cursor-pointer"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {part}
                        </a>
                    );
                }

                return <span key={i}>{part}</span>;
            })}
        </span>
    );
};
