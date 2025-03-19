"use client";

import React from "react";

import { ReduxProvider } from "@/lib/redux/provider";

export function Providers({ children }) {
  return <ReduxProvider>{children}</ReduxProvider>;
}
