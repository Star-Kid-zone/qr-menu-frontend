"use client";

import { useEffect, useState } from "react";
import { PiFacebookLogoBold, PiInstagramLogoBold, PiUploadSimpleBold } from "react-icons/pi";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/PageHeader";
import { socialService, type SocialAccount, type SocialAsset, type SocialPost, type WeeklyPoster } from "@/services/social.service";

export default function SocialMediaPage() {
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [assets, setAssets] = useState<SocialAsset[]>([]);
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [weeklyPosters, setWeeklyPosters] = useState<WeeklyPoster[]>([]);
  const [assetId, setAssetId] = useState("");
  const [weeklyPosterId, setWeeklyPosterId] = useState("");
  const [facebookSelected, setFacebookSelected] = useState(true);
  const [instagramSelected, setInstagramSelected] = useState(true);
  const [facebookCaption, setFacebookCaption] = useState("");
  const [instagramCaption, setInstagramCaption] = useState("");
  const [title, setTitle] = useState("");
  const [schedule, setSchedule] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function load() {
    const [a, m, p, w] = await Promise.all([socialService.getAccounts(), socialService.getAssets(), socialService.getPosts(), socialService.getWeeklyPosters()]);
    setAccounts(a.data); setAssets(m.data); setPosts(p.data); setWeeklyPosters(w.data);
    if (!assetId && m.data[0]) setAssetId(m.data[0].id);
  }
  useEffect(() => { load().catch((e) => setMessage(e?.response?.data?.error ?? "Could not load publishing data.")); }, []);
  async function connect(platform: "facebook" | "instagram") { const { data } = await socialService.startOAuth(platform); window.location.assign(data.url); }
  async function upload(file?: File) { if (!file) return; setBusy(true); try { const { data } = await socialService.uploadAsset(file); setAssets((current) => [data.asset, ...current]); setAssetId(data.asset.id); setMessage("Asset uploaded."); } catch (e: any) { setMessage(e?.response?.data?.error ?? "Upload failed."); } finally { setBusy(false); } }
  async function create(action: "now" | "schedule") {
    const selected = accounts.filter((a) => (a.platform === "facebook" && facebookSelected && facebookCaption.trim()) || (a.platform === "instagram" && instagramSelected && instagramCaption.trim()));
    if ((!assetId && !weeklyPosterId) || !selected.length) { setMessage("Choose a poster, at least one destination, and its caption."); return; }
    setBusy(true); try { const { data } = await socialService.createPost({ ...(weeklyPosterId ? { weeklyPosterId } : { assetId }), title: title || undefined, scheduledAt: action === "schedule" ? new Date(schedule).toISOString() : undefined, destinations: selected.map((a) => ({ accountId: a.id, caption: a.platform === "facebook" ? facebookCaption : instagramCaption })) }); setPosts((current) => [data, ...current]); setFacebookCaption(""); setInstagramCaption(""); setTitle(""); setMessage(action === "now" ? "Post queued for publishing." : "Post scheduled."); } catch (e: any) { setMessage(e?.response?.data?.error ?? "Could not create post."); } finally { setBusy(false); }
  }

  return <div className="flex h-full flex-col gap-4 overflow-y-auto pb-4">
    <PageHeader title="Organic Publishing" description="Manage poster assets and publish to connected Facebook Pages and Instagram Professional accounts." />
    {message && <div className="rounded-xl border border-border bg-muted px-4 py-3 text-caption text-foreground">{message}</div>}
    <Card><CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-h3">Connected accounts</h2><p className="text-caption text-muted-foreground">Tokens stay encrypted on the backend. Personal Facebook profiles are not supported.</p><div className="mt-3 flex flex-wrap gap-2">{accounts.map((a) => <span key={a.id} className="rounded-full border border-border px-3 py-1 text-caption">{a.platform === "facebook" ? "Facebook" : "Instagram"}: {a.displayName}</span>)}</div></div><div className="flex gap-2"><button onClick={() => connect("facebook")} className="rounded-lg bg-accent px-3 py-2 text-caption font-semibold"><PiFacebookLogoBold className="mr-1 inline" /> Connect Facebook</button><button onClick={() => connect("instagram")} className="rounded-lg border border-border px-3 py-2 text-caption font-semibold"><PiInstagramLogoBold className="mr-1 inline" /> Connect Instagram</button></div></CardContent></Card>
    <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]"><Card><CardContent className="p-4"><div className="mb-3 flex items-center justify-between"><h2 className="text-h3">Poster library</h2><label className="cursor-pointer rounded-lg bg-accent px-3 py-2 text-caption font-semibold"><PiUploadSimpleBold className="mr-1 inline" /> Upload<input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => upload(e.target.files?.[0])} /></label></div>{weeklyPosters.length > 0 && <><p className="mb-2 text-caption font-semibold text-primary">Weekly posters</p><div className="mb-4 grid grid-cols-2 gap-3">{weeklyPosters.map((poster) => <button key={poster.id} onClick={() => { setWeeklyPosterId(poster.id); setAssetId(""); }} className={`overflow-hidden rounded-xl border text-left ${weeklyPosterId === poster.id ? "border-primary ring-2 ring-primary/30" : "border-border"}`}><img src={poster.thumbnailUrl ?? poster.imageUrl} alt={poster.title} className="aspect-square w-full object-cover" /><span className="block truncate p-2 text-caption">{poster.title}</span></button>)}</div></>}{assets.length > 0 && <p className="mb-2 text-caption font-semibold text-primary">Your uploads</p>}<div className="grid grid-cols-2 gap-3">{assets.map((asset) => <button key={asset.id} onClick={() => { setAssetId(asset.id); setWeeklyPosterId(""); }} className={`overflow-hidden rounded-xl border text-left ${assetId === asset.id ? "border-primary ring-2 ring-primary/30" : "border-border"}`}><img src={asset.thumbnailUrl ?? asset.publishingUrl} alt={asset.originalFilename} className="aspect-square w-full object-cover" /><span className="block truncate p-2 text-caption">{asset.originalFilename}</span></button>)}</div>{!assets.length && !weeklyPosters.length && <p className="py-8 text-center text-caption text-muted-foreground">Upload an existing poster image to begin.</p>}</CardContent></Card>
      <Card><CardContent className="space-y-4 p-4"><h2 className="text-h3">Create post</h2><input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Internal title (optional)" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-body" /><label className="flex items-center gap-2 text-caption"><input type="checkbox" checked={facebookSelected} onChange={(e) => setFacebookSelected(e.target.checked)} /> Facebook Page</label><textarea disabled={!facebookSelected} value={facebookCaption} onChange={(e) => setFacebookCaption(e.target.value)} placeholder="Facebook Page caption" rows={4} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-body disabled:opacity-50" /><label className="flex items-center gap-2 text-caption"><input type="checkbox" checked={instagramSelected} onChange={(e) => setInstagramSelected(e.target.checked)} /> Instagram Professional</label><textarea disabled={!instagramSelected} value={instagramCaption} onChange={(e) => setInstagramCaption(e.target.value)} placeholder="Instagram caption" rows={4} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-body disabled:opacity-50" /><div className="flex flex-col gap-2 sm:flex-row"><input type="datetime-local" value={schedule} onChange={(e) => setSchedule(e.target.value)} className="rounded-lg border border-border bg-background px-3 py-2 text-body" /><button disabled={busy || !schedule} onClick={() => create("schedule")} className="rounded-lg border border-border px-4 py-2 text-caption font-semibold disabled:opacity-50">Schedule</button><button disabled={busy} onClick={() => create("now")} className="rounded-lg bg-primary px-4 py-2 text-caption font-semibold text-primary-foreground disabled:opacity-50">Publish now</button></div></CardContent></Card></div>
    <Card><CardContent className="p-4"><h2 className="mb-3 text-h3">Publishing history</h2><div className="space-y-2">{posts.map((post) => <div key={post.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border px-3 py-2 text-caption"><span>#{post.id} {post.title || "Untitled post"}</span><span className="rounded-full bg-muted px-2 py-1">{post.lifecycleStatus}</span></div>)}{!posts.length && <p className="text-caption text-muted-foreground">Your drafts, scheduled posts, and results will appear here.</p>}</div></CardContent></Card>
  </div>;
}
