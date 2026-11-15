# Biko Radio – Frontend Build Guide (React + Tailwind, NestJS-ready)

Scope: **frontend only**. The NestJS backend is built later (or by someone else). The frontend is structured so that
swapping mock data for real NestJS API calls is a one-file change per feature.

---

## 0. What the design contains

| Area | Description |
|---|---|
| Top bar | Logo "Biko Radio", "Back to Lumumba" link |
| Sidebar | Discover, Live shows, My channels, Replays, Membership + partner links (Lumumba, Sankara TV), tagline |
| Hero player | LIVE badge, show title, Listen live, volume slider, Follow, Share |
| Call in to the show | Join call queue, Test microphone, Leave queue |
| Become a member | Perks list, Join membership, Manage membership |
| Create your radio channel | Form: name, description, category, language, Create channel |
| Broadcaster tools | Open studio, Test microphone, Schedule show, Go live |
| Live chat | Message list + input + Send |
| Footer notice | "Screen callers before going on air" |

## 1. Tech stack

- **Vite + React 18 + TypeScript** – fast dev server
- **Tailwind CSS v4** (`@tailwindcss/vite` plugin) – styling
- **lucide-react** – icons
- **react-router-dom** – pages (Discover, Live shows, My channels, Replays, Membership)
- **Browser APIs** – `HTMLAudioElement` (listen live), `getUserMedia` + `AudioContext` (mic test)
- **Later (backend)**: NestJS REST + WebSocket gateway (chat, call queue, live status). Frontend uses `fetch`/`socket.io-client`.

## 2. Step-by-step plan

### Step 1 – Setup
1. `npm create vite@latest frontend -- --template react-ts`
2. `npm i tailwindcss @tailwindcss/vite lucide-react react-router-dom`
3. Add the Tailwind plugin in `vite.config.ts`; `@import "tailwindcss";` in `index.css`.
4. Define theme colors (`--color-brand` blue, `--color-gold` yellow, `--color-live` red) in `@theme`.

### Step 2 – Folder structure
```
src/
  components/
    layout/      Topbar, Sidebar, AppLayout
    player/      HeroPlayer
    call/        CallInCard
    membership/  MembershipCard
    channel/     CreateChannelForm
    broadcaster/ BroadcasterTools, MicTestModal
    chat/        LiveChat
    ui/          Button, Card
  hooks/         useMicTest, useAudioPlayer
  pages/         Discover, LiveShows, MyChannels, Replays, Membership
  services/      api.ts (mock now, NestJS later)
  types/         index.ts
  data/          mock data
```

### Step 3 – Layout shell
Topbar + Sidebar + a content area with a 12-column grid. Make it responsive (sidebar collapses on mobile).

### Step 4 – Build components one by one (in this order)
1. `ui/Button`, `ui/Card` – shared styles so everything matches.
2. `HeroPlayer` – play/pause state, volume slider, follow toggle, share (Web Share / clipboard).
3. `CallInCard` – queue state machine: `idle → queued → (host approves) → on air → idle`.
4. `MembershipCard` – static perks + button.
5. `CreateChannelForm` – controlled form with validation (name required, category, language).
6. `BroadcasterTools` – 4 actions: Open studio, Test mic (real mic level meter), Schedule show (modal), Go live (toggle).
7. `LiveChat` – message list, auto-scroll, send on Enter.
8. Footer notice bar.

### Step 5 – State & services
- Local state with hooks first; `services/api.ts` exposes functions (`getLiveShow`, `createChannel`, `joinQueue`, `sendMessage`).
- Mock implementations now; each will map to a NestJS endpoint:

| Frontend function | NestJS endpoint (future) |
|---|---|
| `getLiveShow()` | `GET /shows/live` |
| `createChannel(dto)` | `POST /channels` |
| `joinQueue()` / `leaveQueue()` | `POST/DELETE /shows/:id/queue` |
| `scheduleShow(dto)` | `POST /shows` |
| `goLive()` | `POST /shows/:id/go-live` |
| chat | WebSocket gateway `/chat` |

### Step 6 – Pages / routing
Sidebar items route to pages. `Discover` is the full dashboard in the screenshot; others start as simple placeholder pages.

### Step 7 – Polish
Responsive breakpoints, focus states, aria labels, loading/empty states, keyboard support.

### Step 8 – Connect to NestJS (later)
1. Add `VITE_API_URL` in `.env`.
2. Replace mock bodies in `services/api.ts` with `fetch`.
3. Add `socket.io-client` for chat + call queue live updates.
4. For real streaming: use an Icecast/HLS URL as the `<audio>` src, WebRTC for call-ins.

## 3. Run
```bash
cd frontend
npm install
npm run dev
```
