"use client";

import { useEffect } from "react";

const somaliStrings = {
  title: "Cinwaan",
  description: "Faahfaahin",
  email: "Email",
  feedbackType: "Nooca Jawaabta",
  bug: "Cilad",
  suggestion: "Talo",
  question: "Su'aal",
  attachments: "Lifaaqyo",
};

function setupSomaliShakeForm() {
  // Use global constructors from Shake SDK
  // Ensure these constructors are available before calling this function
  const title = new (window as any).ShakeTitle(
    "title",
    somaliStrings.title,
    "",
    true
  );
  const desc = new (window as any).ShakeTextInput(
    "description",
    somaliStrings.description,
    "",
    true
  );
  const email = new (window as any).ShakeEmail(
    "email",
    somaliStrings.email,
    "",
    false
  );

  const pickerItems = [
    new (window as any).ShakePickerItem(
      "bug",
      somaliStrings.bug,
      undefined,
      "bug"
    ),
    new (window as any).ShakePickerItem(
      "suggestion",
      somaliStrings.suggestion,
      undefined,
      "suggestion"
    ),
    new (window as any).ShakePickerItem(
      "question",
      somaliStrings.question,
      undefined,
      "question"
    ),
  ];
  const picker = new (window as any).ShakePicker(
    "feedback_type",
    somaliStrings.feedbackType,
    pickerItems
  );

  const attachments = new (window as any).ShakeAttachments();

  const shakeForm = new (window as any).ShakeForm([
    title,
    desc,
    email,
    picker,
    attachments,
  ]);

  (window as any).Shake.config.shakeForm = shakeForm;
}

const ShakeInitializer = () => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const apiKey = process.env.NEXT_PUBLIC_SHAKE_API_KEY;
      if (!apiKey) {
        console.error(
          "Shake API Key not set. Add NEXT_PUBLIC_SHAKE_API_KEY to .env.local."
        );
        return;
      }

      // Wait for Shake to be available
      const checkShakeLoaded = setInterval(() => {
        if ((window as any).Shake) {
          clearInterval(checkShakeLoaded);
          try {
            (window as any).Shake.start(apiKey);

            // Now wait for SDK constructors to be available
            const checkConstructors = setInterval(() => {
              if (
                (window as any).ShakeTitle &&
                (window as any).ShakeTextInput &&
                (window as any).ShakeEmail &&
                (window as any).ShakePicker &&
                (window as any).ShakePickerItem &&
                (window as any).ShakeAttachments &&
                (window as any).ShakeForm
              ) {
                setupSomaliShakeForm();
                clearInterval(checkConstructors);
              }
            }, 100); // Check every 100ms

            // Optional: Clear constructor check interval after a timeout
            setTimeout(() => clearInterval(checkConstructors), 5000); // 5-second timeout
          } catch (error) {
            console.error("Error initializing Shake SDK:", error);
          }
        }
      }, 100); // Check for window.Shake every 100ms

      // Optional: Clear initial check interval after a timeout to prevent infinite loop
      setTimeout(() => clearInterval(checkShakeLoaded), 10000); // 10-second timeout for Shake object
    }
  }, []); // Empty dependency array means this effect runs once on mount

  return null;
};

export default ShakeInitializer;
