"use client";

import type React from "react";
import { useState, useEffect } from "react";
import Shake from "@shakebugs/browser";
import { Button } from "./ui/button";
import { Flag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

/**
 * Advanced function to replace specific unsupported color formats (like oklch, oklab)
 * with fallback values across a wider range of color-sensitive CSS properties
 * for a given element and its descendants.
 */
const replaceUnsupportedColors = (element: HTMLElement) => {
  // Get all descendant elements including the root element itself
  const elements = Array.from(element.querySelectorAll<HTMLElement>("*"));
  elements.unshift(element);

  // Expanded list of properties that are known to accept color values
  const colorSensitiveProperties: string[] = [
    // Direct Color Properties
    "color",
    "backgroundColor",
    "borderColor",
    "borderTopColor",
    "borderRightColor",
    "borderBottomColor",
    "borderLeftColor",
    "outlineColor",
    "textDecorationColor",
    "textEmphasisColor",
    "caretColor",
    "columnRuleColor",

    // Properties that can contain color functions, gradients, or images using colors
    "backgroundImage",
    "background",
    "borderImage",
    "listStyleImage",
    "maskImage",
    "boxShadow",
    "textShadow",
    "filter",

    // SVG/Canvas related
    "fill",
    "stroke",
    "stopColor",
    "floodColor",
    "lightingColor",

    // Composite properties
    "border",
    "outline",
    "columnRule",
  ];

  // Define categories for properties to apply appropriate fallback strategies
  enum PropertyCategory {
    Text = 0,
    Background = 1,
    BorderOutline = 2,
    Shadow = 3,
    ImageGradient = 4,
    Filter = 5,
    SVG = 6,
  }

  // Map each color-sensitive property to its category
  const propertyCategoryMap: Record<string, PropertyCategory> = {
    color: PropertyCategory.Text,
    textDecorationColor: PropertyCategory.Text,
    textEmphasisColor: PropertyCategory.Text,
    caretColor: PropertyCategory.Text,

    backgroundColor: PropertyCategory.Background,
    background: PropertyCategory.Background,

    borderColor: PropertyCategory.BorderOutline,
    borderTopColor: PropertyCategory.BorderOutline,
    borderRightColor: PropertyCategory.BorderOutline,
    borderBottomColor: PropertyCategory.BorderOutline,
    borderLeftColor: PropertyCategory.BorderOutline,
    outlineColor: PropertyCategory.BorderOutline,
    columnRuleColor: PropertyCategory.BorderOutline,
    border: PropertyCategory.BorderOutline,
    outline: PropertyCategory.BorderOutline,
    columnRule: PropertyCategory.BorderOutline,

    boxShadow: PropertyCategory.Shadow,
    textShadow: PropertyCategory.Shadow,

    backgroundImage: PropertyCategory.ImageGradient,
    borderImage: PropertyCategory.ImageGradient,
    listStyleImage: PropertyCategory.ImageGradient,
    maskImage: PropertyCategory.ImageGradient,

    filter: PropertyCategory.Filter,

    fill: PropertyCategory.SVG,
    stroke: PropertyCategory.SVG,
    stopColor: PropertyCategory.SVG,
    floodColor: PropertyCategory.SVG,
    lightingColor: PropertyCategory.SVG,
  };

  /**
   * Determines the appropriate fallback value based on the property category and name.
   */
  const getFallbackValue = (
    propertyName: string,
    category: PropertyCategory
  ): string => {
    switch (category) {
      case PropertyCategory.Text:
      case PropertyCategory.SVG:
        return "#000";
      case PropertyCategory.Background:
        return "#fff";
      case PropertyCategory.BorderOutline:
        return ["border", "outline", "columnRule"].includes(propertyName)
          ? "1px solid transparent"
          : "transparent";
      case PropertyCategory.Shadow:
        return "none";
      case PropertyCategory.ImageGradient:
        return "none";
      case PropertyCategory.Filter:
        return "none";
      default:
        console.warn(
          `[replaceUnsupportedColors] Unknown property category for "${propertyName}". Applying a generic transparent fallback.`
        );
        return "transparent";
    }
  };

  elements.forEach((el) => {
    if (!(el instanceof HTMLElement)) {
      return;
    }

    const style = getComputedStyle(el);

    colorSensitiveProperties.forEach((propName) => {
      const value = style.getPropertyValue(propName);

      if (value && (value.includes("oklch(") || value.includes("oklab("))) {
        const category = propertyCategoryMap[propName];

        if (category !== undefined) {
          const fallbackValue = getFallbackValue(propName, category);
          el.style.setProperty(propName, fallbackValue);
        } else {
          console.warn(
            `[replaceUnsupportedColors] Property "${propName}" found with unsupported color "${value}" but no defined category in the propertyCategoryMap.`
          );
          el.style.setProperty(propName, "transparent");
        }
      }
    });
  });
};

/**
 * Prepares the DOM for high-quality screenshots by ensuring all elements are
 * properly rendered and visible.
 */
const prepareForScreenshot = async () => {
  // Wait for any pending animations or transitions to complete
  return new Promise<void>((resolve) => {
    // Force a layout recalculation to ensure all elements are properly positioned
    document.body.getBoundingClientRect();

    // Wait for the next animation frame to ensure all visual updates are applied
    requestAnimationFrame(() => {
      // Wait a bit longer to ensure everything is fully rendered
      setTimeout(() => {
        // Replace unsupported colors to prevent rendering issues in screenshots
        replaceUnsupportedColors(document.body);
        resolve();
      }, 100);
    });
  });
};

/**
 * Configures Shake SDK with optimal screenshot settings
 */
const configureShakeForHighQualityScreenshots = () => {
  if (typeof Shake === "undefined") return;

  // Configure Shake to capture high-resolution screenshots
  // Shake.setScreenshotQuality(1.0); // Removed as it does not exist in the Shake SDK

  // Removed full-page screenshot configuration as it is not supported by the Shake SDK

  // Set additional metadata that helps with bug context
  Shake.setMetadata("userAgent", navigator.userAgent);
  Shake.setMetadata("screenSize", `${window.innerWidth}x${window.innerHeight}`);
  Shake.setMetadata("devicePixelRatio", window.devicePixelRatio.toString());
  Shake.setMetadata("url", window.location.href);
};

interface BugReportButtonProps {
  setIsReportingBug?: (open: boolean) => void;
}

const BugReportButton: React.FC<BugReportButtonProps> = ({
  setIsReportingBug,
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Initialize Shake with optimal settings when component mounts
  useEffect(() => {
    if (typeof Shake !== "undefined") {
      configureShakeForHighQualityScreenshots();
    }
  }, []);

  const handleReportBugClick = async () => {
    setIsLoading(true);
    try {
      if (typeof Shake !== "undefined") {
        if (setIsReportingBug) setIsReportingBug(true);

        // Set current URL as metadata
        Shake.setMetadata("url", window.location.href);

        // Prepare the DOM for high-quality screenshots
        await prepareForScreenshot();

        // Show the Shake UI after preparation is complete
        await Shake.show();



        // Try to detect when the modal is closed
        if (setIsReportingBug) {
          // Shake Web SDK does not provide a close event, so use a timeout as a fallback
          setTimeout(() => setIsReportingBug(false), 2000);
        }
      } else {
        console.warn("Shake SDK lama helin.");

      }
    } catch (error) {
      console.error("Khalad ayaa dhacay:", error);

      if (setIsReportingBug) setIsReportingBug(false);
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div>
      <Button
        className="rounded-xl"
        variant={"outline"}
        onClick={handleReportBugClick}
        disabled={isLoading}
      >
        <Flag size={20} className={isLoading ? "animate-spin" : ""} />
      </Button>
    </div>
  );
};

export default BugReportButton;
