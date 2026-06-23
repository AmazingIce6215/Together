"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Howl } from "howler";
import { useUser } from "@clerk/nextjs";
import { createClient } from "@/lib/supabase/client";
import { useListenStore } from "@/lib/store/listen-store";
import {
  createListenSession,
  updatePlaybackState,
} from "@/actions/listen.actions";
import { AMBIENT_SOUNDS } from "@/lib/constants/audio";
import { PlayerBar } from "@/components/listen/player-bar";
import { TrackList } from "@/components/listen/track-list";
import { PartnerStatus } from "@/components/listen/partner-status";
import type { AmbientSound } from "@/lib/types/app";

interface SessionData {
  id: string;
  status: string;
  current_ambient_id: string | null;
  progress_ms: number;
  couple_id: string;
}

interface ListenClientProps {
  initialSession: SessionData | null;
}

export function ListenClient({ initialSession }: ListenClientProps) {
  const store = useListenStore();
  const { user, isLoaded } = useUser();
  const [partner, setPartner] = useState<{ id: string; display_name: string | null } | null>(null);
  const [showTracks, setShowTracks] = useState(false);

  const howlRef = useRef<Howl | null>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (initialSession) {
      store.setSession(initialSession);
    }
  }, [initialSession]);

  // Load partner info
  useEffect(() => {
    if (!isLoaded || !user || !initialSession) return;

    const supabase = createClient();
    supabase
      .from("couple_members")
      .select("user_id, profiles:user_id(display_name)")
      .eq("couple_id", initialSession.couple_id)
      .then(({ data }) => {
        if (data) {
          const them = data.find(
            (m: { user_id: string; profiles: unknown }) => m.user_id !== user.id
          );
          if (them) {
            const profile = them.profiles as unknown as {
              display_name: string | null;
            } | null;
            setPartner({
              id: them.user_id,
              display_name: profile?.display_name || null,
            });
          }
        }
      });
  }, [initialSession, user, isLoaded]);

  useEffect(() => {
    if (howlRef.current) {
      howlRef.current.unload();
      howlRef.current = null;
    }

    const ambient = store.currentAmbient;
    if (ambient) {
      const howl = new Howl({
        src: [ambient.file],
        html5: true,
        volume: store.volume * (store.isMuted ? 0 : 1),
        onplay: () => {
          progressIntervalRef.current = setInterval(() => {
            const seek = howl.seek() as number;
            store.setProgress(Math.round(seek * 1000));
          }, 500);
        },
        onpause: () => {
          if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
            progressIntervalRef.current = null;
          }
        },
        onstop: () => {
          if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
            progressIntervalRef.current = null;
          }
        },
        onend: () => {
          store.setStatus("idle");
          store.setProgress(0);
        },
        onloaderror: () => {
          console.warn("Audio file not found:", ambient.file);
        },
      });
      howlRef.current = howl;
    }

    return () => {
      if (howlRef.current) {
        howlRef.current.unload();
        howlRef.current = null;
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    };
  }, [store.currentAmbient?.id]);

  useEffect(() => {
    if (howlRef.current) {
      howlRef.current.volume(store.volume * (store.isMuted ? 0 : 1));
    }
  }, [store.volume, store.isMuted]);

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("listen-changes")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "listen_sessions",
          filter: `id=eq.${store.sessionId}`,
        },
        (payload) => {
          const s = payload.new as SessionData;
          store.setSession(s);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [store.sessionId]);

  const handlePlay = useCallback(() => {
    if (howlRef.current && store.currentAmbient) {
      howlRef.current.play();
      store.setStatus("playing");
      if (store.sessionId) {
        updatePlaybackState({
          sessionId: store.sessionId,
          status: "playing",
          currentAmbientId: store.currentAmbient.id,
        });
      }
    }
  }, [store.currentAmbient, store.sessionId]);

  const handlePause = useCallback(() => {
    if (howlRef.current) {
      howlRef.current.pause();
      store.setStatus("paused");
      if (store.sessionId) {
        updatePlaybackState({
          sessionId: store.sessionId,
          status: "paused",
          progressMs: store.progressMs,
        });
      }
    }
  }, [store.sessionId, store.progressMs]);

  const handleSelectAmbient = useCallback(
    async (ambient: AmbientSound) => {
      store.setCurrentAmbient(ambient);
      store.setProgress(0);

      if (!store.sessionId) {
        try {
          const id = await createListenSession();
          store.setSession({
            id,
            status: "idle",
            current_ambient_id: ambient.id,
            progress_ms: 0,
          });
        } catch (e) {
          console.error("Failed to create session", e);
        }
      }

      setShowTracks(false);
    },
    [store.sessionId]
  );

  const handleStartSession = useCallback(async () => {
    try {
      const id = await createListenSession();
      store.setSession({
        id,
        status: "idle",
        current_ambient_id: null,
        progress_ms: 0,
      });
    } catch (e) {
      console.error("Failed to create session", e);
    }
  }, []);

  const noSession = !store.sessionId;

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold tracking-tight">
            Listen Together
          </h1>
          <p className="text-sm text-zinc-400">
            {store.currentAmbient
              ? `Playing ${store.currentAmbient.name}`
              : noSession
              ? "Start a session to listen together"
              : "Select a track to begin"}
          </p>
        </div>

        {noSession ? (
          <button
            onClick={handleStartSession}
            className="rounded-xl bg-violet-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-violet-400"
          >
            Start Session
          </button>
        ) : (
          <button
            onClick={() => setShowTracks(!showTracks)}
            className="rounded-xl border border-zinc-800 px-4 py-2 text-sm text-zinc-300 transition-colors hover:bg-zinc-900"
          >
            {showTracks ? "Close" : "Browse Tracks"}
          </button>
        )}
      </div>

      {showTracks && (
        <TrackList
          sounds={AMBIENT_SOUNDS}
          activeId={store.currentAmbient?.id || null}
          onSelect={handleSelectAmbient}
        />
      )}

      {store.sessionId && (
        <PlayerBar
          currentAmbient={store.currentAmbient}
          status={store.status}
          progressMs={store.progressMs}
          volume={store.volume}
          isMuted={store.isMuted}
          onPlay={handlePlay}
          onPause={handlePause}
          onVolumeChange={store.setVolume}
          onToggleMute={store.toggleMute}
        />
      )}

      <PartnerStatus
        partnerName={partner?.display_name || "Partner"}
        currentAmbient={store.currentAmbient}
        status={store.status}
      />

      {store.currentAmbient && (
        <div className="rounded-xl border border-amber-900/30 bg-amber-950/10 px-4 py-3">
          <p className="text-xs text-amber-400/80">
            Add audio files to{" "}
            <code className="rounded bg-zinc-900 px-1.5 py-0.5">
              public/audio/ambient/
            </code>{" "}
            to enable playback.{" "}
            <a
              href="https://pixabay.com/music/search/genre/ambient/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-amber-300"
            >
              Find free ambient tracks
            </a>
          </p>
        </div>
      )}
    </div>
  );
}
