import dynamic from "next/dynamic";
import { ComponentType } from "react";

export function dynamicImport<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  options: {
    loading?: () => JSX.Element;
    ssr?: boolean;
  } = {}
) {
  return dynamic(importFunc, {
    loading:
      options.loading ||
      (() => (
        <div className="min-h-[200px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500" />
        </div>
      )),
    ssr: options.ssr ?? false,
  });
}
