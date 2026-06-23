import type { AmbientSound } from "@/lib/types/app";

export const AMBIENT_SOUNDS: AmbientSound[] = [
  { id: "rain", name: "Rain", file: "/audio/ambient/rain.mp3", icon: "cloud-rain" },
  { id: "forest", name: "Forest", file: "/audio/ambient/forest.mp3", icon: "trees" },
  { id: "cafe", name: "Cafe", file: "/audio/ambient/cafe.mp3", icon: "coffee" },
  { id: "ocean", name: "Ocean", file: "/audio/ambient/ocean.mp3", icon: "waves" },
  { id: "fireplace", name: "Fireplace", file: "/audio/ambient/fireplace.mp3", icon: "flame" },
  { id: "white-noise", name: "White Noise", file: "/audio/ambient/white-noise.mp3", icon: "radio" },
];
