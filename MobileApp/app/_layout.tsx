import { Slot } from "expo-router";
import { useEffect } from "react";
import { initializeFirebase } from "./services/firebase";

export default function RootLayout() {
  useEffect(() => {
    // Initialize Firebase when app starts
    initializeFirebase();
  }, []);

  return <Slot />;
}
