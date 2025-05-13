import React, { ComponentType } from "react";
import dynamic from "next/dynamic";

const DefaultLoading = () => (
  <div className="min-h-[200px] flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500" />
  </div>
);

export function dynamicImport(
  importFunc: () => Promise<{ default: ComponentType<unknown> }>,
  options: {
    loading?: () => React.ReactNode;
    ssr?: boolean;
  } = {}
) {
  return dynamic(importFunc, {
    loading: options.loading || DefaultLoading,
    ssr: options.ssr ?? false,
  });
}
