import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";

interface ImageContent {
  url: string;
  url1?: string;
  url2?: string;
  url3?: string;
  url4?: string;
  alt: string;
  alt1?: string;
  alt2?: string;
  alt3?: string;
  alt4?: string;
  width?: number;
  height?: number;
  caption: string;
  caption1?: string;
  caption2?: string;
  caption3?: string;
  caption4?: string;
  text?: string;
  text1?: string;
  text2?: string;
  text3?: string;
  text4?: string;
}

interface ImageSection {
  url: string;
  alt: string;
  caption: string;
  text?: string;
}

const ImageBlock: React.FC<{
  content: ImageContent;
  onContinue: () => void;
  isLastBlock: boolean;
}> = ({ content, onContinue, isLastBlock }) => {
  if (!content?.url) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] max-w-2xl mx-auto px-4">
        <Card className="w-full">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">Image not available</p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={onContinue}>
              {isLastBlock ? "Dhamee" : "Sii wado"}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Create an array of image objects with their associated text
  const imageSections: ImageSection[] = [
    { url: content.url, alt: content.alt, caption: content.caption, text: content.text },
    ...(content.url1 ? [{ url: content.url1, alt: content.alt1 || "", caption: content.caption1 || "", text: content.text1 }] : []),
    ...(content.url2 ? [{ url: content.url2, alt: content.alt2 || "", caption: content.caption2 || "", text: content.text2 }] : []),
    ...(content.url3 ? [{ url: content.url3, alt: content.alt3 || "", caption: content.caption3 || "", text: content.text3 }] : []),
    ...(content.url4 ? [{ url: content.url4, alt: content.alt4 || "", caption: content.caption4 || "", text: content.text4 }] : []),
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] max-w-2xl mx-auto px-4">
      <Card className="w-full">
        <CardContent className="p-6 space-y-8">
          {imageSections.map((section, index) => (
            <div key={index} className="space-y-4">
              {/* Text before image */}
              {section.text && (
                <div className="text-base text-muted-foreground mb-4">
                  {section.text}
                </div>
              )}

              {/* Image */}
              <div className="relative aspect-video w-full">
                <Image
                  src={section.url}
                  alt={section.alt}
                  width={content.width || 800}
                  height={content.height || 600}
                  className="object-cover rounded-lg"
                  unoptimized={process.env.NODE_ENV !== "production"}
                />
              </div>

              {/* Caption */}
              {section.caption && (
                <p className="text-sm text-muted-foreground text-center">
                  {section.caption}
                </p>
              )}
            </div>
          ))}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={onContinue}>
            {isLastBlock ? "Dhamee" : "Sii wado"}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ImageBlock;
