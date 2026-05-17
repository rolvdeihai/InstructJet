"use client";

import dynamic from "next/dynamic";

const ChallengeSticky = dynamic(() => import("@/components/ChallengeSticky"), {
  ssr: false,
});

export default function ClientChallenge() {
  return <ChallengeSticky />;
}