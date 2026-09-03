import type { Metadata } from "next";
import ResearchLibrary from "./ResearchLibrary";

export const metadata: Metadata = {
  title: "Research | VAISI",
};

export default function ResearchPage() {
  return <ResearchLibrary />;
}
