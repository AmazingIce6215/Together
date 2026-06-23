<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Project: Together — Private Shared Experience Platform for Couples

### Stack
- Next.js 16.2.9, TypeScript, Tailwind v4, Supabase
- Auth: Supabase Email + Google OAuth
- State: Zustand + React Server Components
- Audio: Howler.js
- Animations: Framer Motion

### Modules Built

#### Quiz Together (`/quiz`)
- 7 game modes (classic, guess_partner, this_or_that, speed_round, never_have_i_ever, would_you_rather, truth)
- 13 categories seeded
- Real-time sync via postgres_changes on quiz_responses
- Zustand store for client state
- Start empty — user adds questions via SQL or future UI

#### Focus Together (`/focus`)
- Shared Pomodoro timer synced via postgres_changes
- Circular animated countdown with focus/break phases
- Per-user task and daily goal input
- Daily progress bar (focus time vs goal)
- Partner status card (focusing/on_break/idle)
- Server actions: createSession, updateFocusTask, updateFocusGoal

#### Listen Together (`/listen`)
- Shared ambient sound player via Howler.js
- 6 ambient sound slots (Rain, Forest, Cafe, Ocean, Fireplace, White Noise)
- Real-time session sync via postgres_changes
- Volume control, mute toggle
- Partner listening status display
- Browser tracks UI with icon grid
- ⚠️ Audio files required in `public/audio/ambient/` — currently empty

### Auth & Rooms
- Email/password + Google OAuth signup/login
- Invite code system (`TOG-XXXX`) — create/join room
- Root middleware protects `/quiz`, `/listen`, `/focus`

### Database
- 10 tables (profiles, couples, couple_members, quiz_*, listen_sessions, focus_*)
- RLS enabled on all tables with SECURITY DEFINER helper `get_user_couple_ids()`
- Real-time publication for quiz_sessions, quiz_responses, listen_sessions, focus_sessions, focus_participants

### Next Steps
- Add actual audio files to `public/audio/ambient/` (royalty-free from Pixabay, Freesound, etc.)
- Add quiz questions via SQL seed or AI generation UI
- Polish empty states, error handling, accessibility
- Deploy to Vercel
