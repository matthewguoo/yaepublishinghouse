/* eslint-disable @next/next/no-img-element */
'use client';

import Link from 'next/link';
import { useMemo, useRef, useState, type CSSProperties, type ChangeEvent, type FormEvent } from 'react';
import { signOut } from 'next-auth/react';
import { ExternalLink, LogOut, Upload, X } from 'lucide-react';
import { DoodleArrow, DoodleBow, DoodleHeart, DoodleStar } from '../../components/scrapbook-doodles';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Separator } from '../../components/ui/separator';
import { Textarea } from '../../components/ui/textarea';
import { getErrorMessage } from '../../lib/errors';
import { DEFAULT_PROFILE_THEME, PROFILE_THEME_KEYS, PROFILE_THEMES, getProfileTheme } from '../../lib/themes';
import type { EditablePolaroid, EditableProfilePayload, PublicProfile } from '../../lib/types';

type DashboardEditorProps = {
  profile: PublicProfile;
  email: string;
  created: boolean;
};

type DashboardFormState = {
  displayName: string;
  bio: string;
  avatarUrl: string;
  twitterHandle: string;
  instagramHandle: string;
  tiktokHandle: string;
  youtubeUrl: string;
  websiteUrl: string;
  themeKey: PublicProfile['themeKey'];
  charactersText: string;
  polaroids: EditablePolaroid[];
};

function buildInitialState(profile: PublicProfile): DashboardFormState {
  const polaroids = Array.from({ length: 5 }, (_, position) => {
    const match = profile.polaroids?.find((item) => item.position === position);
    return {
      position,
      imageUrl: match?.imageUrl || '',
      caption: match?.caption || '',
    };
  });

  return {
    displayName: profile.displayName || '',
    bio: profile.bio || '',
    avatarUrl: profile.avatarUrl || '',
    twitterHandle: profile.twitterHandle || '',
    instagramHandle: profile.instagramHandle || '',
    tiktokHandle: profile.tiktokHandle || '',
    youtubeUrl: profile.youtubeUrl || '',
    websiteUrl: profile.websiteUrl || '',
    themeKey: profile.themeKey || DEFAULT_PROFILE_THEME,
    charactersText: (profile.characters || []).join(', '),
    polaroids,
  };
}

function themeVars(themeKey: string): CSSProperties {
  const theme = getProfileTheme(themeKey);

  return {
    '--dash-accent': theme.accent,
    '--dash-accent-deep': theme.accentDeep,
    '--dash-tint': theme.tint,
    '--dash-tint-strong': theme.tintStrong,
    '--dash-paper': theme.paper,
    '--dash-paper-alt': theme.paperAlt,
    '--dash-tape': theme.tape,
    '--dash-ink': theme.ink,
    '--dash-sticker': theme.sticker,
  } as CSSProperties;
}

export default function DashboardEditor({ profile, email, created }: DashboardEditorProps) {
  const [form, setForm] = useState<DashboardFormState>(() => buildInitialState(profile));
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(created ? 'page claimed. now make it adorable.' : '');
  const [error, setError] = useState('');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingPolaroid, setUploadingPolaroid] = useState<number | null>(null);
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const polaroidInputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const selectedTheme = getProfileTheme(form.themeKey);
  const profileLink = useMemo(() => `/@${profile.handle}`, [profile.handle]);
  const previewCharacters = form.charactersText
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)
    .slice(0, 6);

  function updateField<Field extends keyof DashboardFormState>(field: Field, value: DashboardFormState[Field]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function updatePolaroid(index: number, key: keyof EditablePolaroid, value: string | number) {
    setForm((current) => ({
      ...current,
      polaroids: current.polaroids.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item
      ),
    }));
  }

  async function uploadImage(file: File, kind: 'avatar' | 'polaroid', index?: number) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Upload failed.');
    }

    if (kind === 'avatar') {
      updateField('avatarUrl', data.url as string);
      return;
    }

    if (typeof index === 'number') {
      updatePolaroid(index, 'imageUrl', data.url as string);
    }
  }

  async function handleAvatarChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      setUploadingAvatar(true);
      setError('');
      setStatus('uploading avatar...');
      await uploadImage(file, 'avatar');
      setStatus('avatar uploaded. save when you are ready.');
    } catch (uploadError) {
      setError(getErrorMessage(uploadError, 'Could not upload avatar.'));
      setStatus('');
    } finally {
      setUploadingAvatar(false);
      event.target.value = '';
    }
  }

  async function handlePolaroidChange(index: number, event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      setUploadingPolaroid(index);
      setError('');
      setStatus('uploading photo...');
      await uploadImage(file, 'polaroid', index);
      setStatus('photo uploaded. save when you are ready.');
    } catch (uploadError) {
      setError(getErrorMessage(uploadError, 'Could not upload photo.'));
      setStatus('');
    } finally {
      setUploadingPolaroid(null);
      event.target.value = '';
    }
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError('');
    setStatus('saving...');

    try {
      const payload: EditableProfilePayload = {
        displayName: form.displayName,
        bio: form.bio,
        avatarUrl: form.avatarUrl,
        twitterHandle: form.twitterHandle,
        instagramHandle: form.instagramHandle,
        tiktokHandle: form.tiktokHandle,
        youtubeUrl: form.youtubeUrl,
        websiteUrl: form.websiteUrl,
        themeKey: form.themeKey,
        characters: form.charactersText
          .split(',')
          .map((value) => value.trim())
          .filter(Boolean),
        polaroids: form.polaroids,
      };

      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Could not save profile.');
      }

      setStatus('saved. your page is live.');
      setForm(buildInitialState(data.profile as PublicProfile));
    } catch (saveError) {
      setError(getErrorMessage(saveError, 'Could not save profile.'));
      setStatus('');
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-4 sm:px-6 sm:py-6" style={themeVars(form.themeKey)}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,var(--dash-tint-strong),transparent_16%),radial-gradient(circle_at_88%_14%,rgba(255,255,255,0.74),transparent_18%),radial-gradient(circle_at_82%_80%,rgba(255,238,245,0.64),transparent_22%)]" />
      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-5">
        <Card className="overflow-hidden rounded-[34px] border-[rgba(111,82,95,0.14)] bg-white/88">
          <CardContent className="relative flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="absolute left-10 top-[-8px] h-5 w-20 rotate-[-6deg] rounded-[4px] bg-[var(--dash-tape)]" />
            <div className="grid gap-2">
              <Badge className="w-fit bg-[var(--dash-paper-alt)] text-[var(--dash-accent-deep)]">dashboard</Badge>
              <div className="grid gap-2">
                <p className="font-marker text-3xl leading-none text-[var(--dash-accent-deep)] sm:text-4xl">decorate your page</p>
                <h1 className="font-body text-4xl font-semibold leading-none tracking-[-0.04em] text-[var(--dash-ink)] sm:text-6xl">make it look like you made it.</h1>
                <p className="text-[15px] leading-7 text-muted-foreground sm:text-base">signed in as {email}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild variant="secondary">
                <Link href={profileLink}>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  view public page
                </Link>
              </Button>
              <Button type="button" variant="ghost" onClick={() => signOut({ callbackUrl: '/' })}>
                <LogOut className="mr-2 h-4 w-4" />
                log out
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-5 xl:grid-cols-[minmax(340px,420px)_minmax(0,1fr)]">
          <Card className="sticky top-4 overflow-hidden rounded-[34px] border-[rgba(111,82,95,0.14)] xl:self-start" style={themeVars(form.themeKey)}>
            <CardContent className="relative grid gap-5 p-5 sm:p-6">
              <div className="absolute left-8 top-[-8px] h-5 w-20 rotate-[-8deg] rounded-[4px] bg-[var(--dash-tape)]" />
              <DoodleStar className="absolute right-5 top-5 h-9 w-9 text-[var(--dash-accent-deep)]" />
              <DoodleHeart className="absolute right-10 top-20 h-8 w-8 text-[var(--dash-accent-deep)]" />
              <div className="flex items-start justify-between gap-4">
                <div className="grid gap-2">
                  <Badge className="w-fit bg-[var(--dash-paper-alt)] text-[var(--dash-accent-deep)]">live preview</Badge>
                  <p className="font-marker text-3xl leading-none text-[var(--dash-accent-deep)]">scrapbook mode</p>
                </div>
                <div className="sticker-bubble rotate-[7deg] bg-[var(--dash-sticker)] text-[var(--dash-ink)]">{selectedTheme.label}</div>
              </div>

              <div className="relative rounded-[28px] border border-[rgba(111,82,95,0.12)] bg-white/92 p-4 shadow-paper">
                <div className="absolute left-6 top-[-9px] h-5 w-16 rotate-[-5deg] rounded-[4px] bg-[var(--dash-tape)]" />
                <div className="absolute right-7 top-[-7px] h-5 w-14 rotate-[7deg] rounded-[4px] bg-[var(--dash-tape)]" />
                <DoodleArrow className="absolute bottom-4 right-2 h-12 w-20 text-[var(--dash-accent-deep)]" />
                <div className="grid gap-5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-[28px] bg-[linear-gradient(180deg,var(--dash-paper-alt),var(--dash-tint))] text-3xl text-[var(--dash-accent-deep)] shadow-paper">
                      {form.avatarUrl ? (
                        <img src={form.avatarUrl} alt={form.displayName || profile.handle} className="h-full w-full object-cover" />
                      ) : (
                        <span className="font-note">{(form.displayName || profile.handle).slice(0, 1)}</span>
                      )}
                    </div>
                    <div className="grid gap-1">
                      <p className="font-body text-4xl font-semibold leading-none tracking-[-0.04em] text-[var(--dash-ink)]">{form.displayName || profile.handle}</p>
                      <p className="font-note text-lg text-muted-foreground">@{profile.handle}</p>
                    </div>
                  </div>

                  <p className="text-[15px] leading-7 text-muted-foreground">{form.bio || 'your bio shows up here.'}</p>

                  <div className="flex flex-wrap gap-2">
                    {previewCharacters.length ? (
                      previewCharacters.map((character) => (
                        <span
                          key={character}
                          className="inline-flex rounded-full border border-[rgba(111,82,95,0.12)] bg-[var(--dash-paper-alt)] px-3 py-1.5 font-note text-[1rem] text-[var(--dash-ink)]"
                        >
                          {character}
                        </span>
                      ))
                    ) : (
                      <span className="inline-flex rounded-full border border-dashed border-[rgba(111,82,95,0.18)] px-3 py-1.5 font-note text-[1rem] text-muted-foreground">
                        add a few characters
                      </span>
                    )}
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-3">
                    {form.polaroids.map((polaroid, index) => (
                      <article
                        key={index}
                        className="relative grid gap-2 rounded-[18px] bg-white p-3 shadow-paper"
                        style={{ transform: `rotate(${[-4, 3, -2, 4, -3][index] || 0}deg)` }}
                      >
                        <div className="absolute left-1/2 top-[-7px] h-4 w-14 -translate-x-1/2 rotate-[-4deg] rounded-[4px] bg-[var(--dash-tape)]" />
                        <div className="aspect-square overflow-hidden rounded-[14px] bg-[linear-gradient(180deg,var(--dash-paper-alt),var(--dash-tint))]">
                          {polaroid.imageUrl ? (
                            <img src={polaroid.imageUrl} alt={polaroid.caption || ''} className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full items-center justify-center px-3 text-center font-note text-sm leading-5 text-[var(--dash-accent-deep)]">
                              {polaroid.caption || 'photo slot'}
                            </div>
                          )}
                        </div>
                        <p className="font-marker text-lg leading-5 text-[var(--dash-ink)]">{polaroid.caption || 'caption here'}</p>
                      </article>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <form className="grid gap-5" onSubmit={handleSave}>
            <Card className="rounded-[34px] border-[rgba(111,82,95,0.14)] bg-white/88">
              <CardHeader className="gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge>core stuff</Badge>
                  <Badge variant="secondary" className="normal-case">{profileLink}</Badge>
                </div>
                <CardTitle>the main note</CardTitle>
                <CardDescription>
                  display name, bio, avatar, then your page gets the rest of the personality from photos and color.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="grid gap-3">
                    <Label htmlFor="displayName">display name</Label>
                    <Input id="displayName" value={form.displayName} onChange={(event) => updateField('displayName', event.target.value)} />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="characters">characters</Label>
                    <Input
                      id="characters"
                      value={form.charactersText}
                      onChange={(event) => updateField('charactersText', event.target.value)}
                      placeholder="Yae Miko, Tingyun, Takina"
                    />
                  </div>
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="bio">bio</Label>
                  <Textarea
                    id="bio"
                    rows={4}
                    value={form.bio}
                    onChange={(event) => updateField('bio', event.target.value)}
                    placeholder="tiny intro, current cosplay brainrot, whatever"
                  />
                </div>

                <div className="grid gap-5 rounded-[28px] border border-dashed border-[rgba(111,82,95,0.18)] bg-[var(--dash-paper-alt)] p-4 md:grid-cols-[140px_minmax(0,1fr)] md:items-center">
                  <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-[26px] bg-white shadow-paper">
                    {form.avatarUrl ? (
                      <img src={form.avatarUrl} alt={form.displayName || profile.handle} className="h-full w-full object-cover" />
                    ) : (
                      <span className="font-note text-lg text-muted-foreground">avatar</span>
                    )}
                  </div>
                  <div className="grid gap-3">
                    <div className="grid gap-1">
                      <p className="font-note text-lg text-[var(--dash-accent-deep)]">avatar</p>
                      <p className="text-sm leading-6 text-muted-foreground">square crops work best. good lighting, face centered, background not too noisy.</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Button type="button" variant="secondary" onClick={() => avatarInputRef.current?.click()} disabled={uploadingAvatar}>
                        <Upload className="mr-2 h-4 w-4" />
                        {uploadingAvatar ? 'uploading...' : 'upload avatar'}
                      </Button>
                      <Button type="button" variant="ghost" onClick={() => updateField('avatarUrl', '')}>
                        <X className="mr-2 h-4 w-4" />
                        clear
                      </Button>
                    </div>
                    <input ref={avatarInputRef} hidden type="file" accept="image/*" onChange={handleAvatarChange} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[34px] border-[rgba(111,82,95,0.14)] bg-white/88">
              <CardHeader>
                <div className="flex flex-wrap items-center gap-3">
                  <Badge>page color</Badge>
                  <Badge variant="secondary" className="normal-case">public profile accent</Badge>
                </div>
                <CardTitle>pick the mood</CardTitle>
                <CardDescription>this changes the tint, borders, stickers, and buttons on your public page.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {PROFILE_THEME_KEYS.map((themeKey) => {
                  const theme = PROFILE_THEMES[themeKey];
                  const active = form.themeKey === themeKey;

                  return (
                    <button
                      key={themeKey}
                      type="button"
                      onClick={() => updateField('themeKey', themeKey)}
                      className={`relative grid gap-3 rounded-[24px] border p-4 text-left shadow-paper transition-transform hover:-translate-y-0.5 ${
                        active ? 'border-[var(--dash-accent-deep)] bg-white' : 'border-[rgba(111,82,95,0.12)] bg-white/90'
                      }`}
                    >
                      <div className="absolute left-5 top-[-7px] h-4 w-14 rotate-[-6deg] rounded-[4px]" style={{ background: theme.tape }} />
                      <div className="flex gap-2">
                        <span className="h-5 w-5 rounded-full border-2 border-white shadow-sm" style={{ background: theme.accent }} />
                        <span className="h-5 w-5 rounded-full border-2 border-white shadow-sm" style={{ background: theme.paperAlt }} />
                        <span className="h-5 w-5 rounded-full border-2 border-white shadow-sm" style={{ background: theme.sticker }} />
                      </div>
                      <div>
                        <p className="font-note text-lg text-[var(--dash-ink)]">{theme.label}</p>
                        <p className="text-sm leading-6 text-muted-foreground">{active ? 'selected for your public page' : 'tap to use this palette'}</p>
                      </div>
                    </button>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="rounded-[34px] border-[rgba(111,82,95,0.14)] bg-white/88">
              <CardHeader>
                <div className="flex flex-wrap items-center gap-3">
                  <Badge>links</Badge>
                  <Badge variant="secondary" className="normal-case">where people already know you from</Badge>
                </div>
                <CardTitle>pin your handles</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-5 md:grid-cols-2">
                <div className="grid gap-3">
                  <Label htmlFor="twitterHandle">twitter</Label>
                  <Input id="twitterHandle" value={form.twitterHandle} onChange={(event) => updateField('twitterHandle', event.target.value)} placeholder="pci_yae" />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="instagramHandle">instagram</Label>
                  <Input id="instagramHandle" value={form.instagramHandle} onChange={(event) => updateField('instagramHandle', event.target.value)} placeholder="yuuko.koro" />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="tiktokHandle">tiktok</Label>
                  <Input id="tiktokHandle" value={form.tiktokHandle} onChange={(event) => updateField('tiktokHandle', event.target.value)} placeholder="cutefoxcos" />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="websiteUrl">website</Label>
                  <Input id="websiteUrl" value={form.websiteUrl} onChange={(event) => updateField('websiteUrl', event.target.value)} placeholder="https://your-site.com" />
                </div>
                <div className="grid gap-3 md:col-span-2">
                  <Label htmlFor="youtubeUrl">youtube</Label>
                  <Input id="youtubeUrl" value={form.youtubeUrl} onChange={(event) => updateField('youtubeUrl', event.target.value)} placeholder="https://youtube.com/@you" />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[34px] border-[rgba(111,82,95,0.14)] bg-white/88">
              <CardHeader>
                <div className="flex flex-wrap items-center gap-3">
                  <Badge>photo wall</Badge>
                  <Badge variant="secondary" className="normal-case">five crooked little polaroids</Badge>
                </div>
                <CardTitle>hero shots and crumbs</CardTitle>
                <CardDescription>keep captions short. scrapbook note energy works way better than a formal sentence.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {form.polaroids.map((polaroid, index) => (
                  <article
                    key={index}
                    className="relative grid gap-4 rounded-[28px] border border-[rgba(111,82,95,0.12)] bg-[var(--dash-paper-alt)] p-4 shadow-paper"
                  >
                    <div className="absolute left-6 top-[-7px] h-4 w-14 rotate-[-6deg] rounded-[4px] bg-[var(--dash-tape)]" />
                    <div className="aspect-square overflow-hidden rounded-[20px] bg-white shadow-paper">
                      {polaroid.imageUrl ? (
                        <img src={polaroid.imageUrl} alt={polaroid.caption || ''} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center px-4 text-center font-note text-lg text-muted-foreground">
                          photo {index + 1}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => polaroidInputRefs.current[index]?.click()}
                        disabled={uploadingPolaroid === index}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        {uploadingPolaroid === index ? 'uploading...' : 'upload'}
                      </Button>
                      <Button type="button" variant="ghost" onClick={() => updatePolaroid(index, 'imageUrl', '')}>
                        <X className="mr-2 h-4 w-4" />
                        clear
                      </Button>
                      <input
                        ref={(element) => {
                          polaroidInputRefs.current[index] = element;
                        }}
                        hidden
                        type="file"
                        accept="image/*"
                        onChange={(event) => handlePolaroidChange(index, event)}
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor={`caption-${index}`}>caption</Label>
                      <Input
                        id={`caption-${index}`}
                        value={polaroid.caption}
                        onChange={(event) => updatePolaroid(index, 'caption', event.target.value)}
                        placeholder="maid yae on the train"
                      />
                    </div>
                  </article>
                ))}
              </CardContent>
            </Card>

            <Card className="rounded-[34px] border-[rgba(111,82,95,0.14)] bg-white/88">
              <CardContent className="relative flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <div className="absolute right-10 top-[-8px] h-5 w-20 rotate-[7deg] rounded-[4px] bg-[var(--dash-tape)]" />
                <DoodleBow className="absolute bottom-3 right-4 h-10 w-14 text-[var(--dash-accent-deep)] opacity-90" />
                <div className="grid gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {error ? (
                      <Badge className="border-rose-200 bg-rose-50 text-rose-700">save issue</Badge>
                    ) : status ? (
                      <Badge className="bg-emerald-50 text-emerald-700">status</Badge>
                    ) : null}
                    <Badge variant="secondary" className="normal-case">cute beats slick</Badge>
                  </div>
                  {error ? <p className="text-sm leading-6 text-rose-700">{error}</p> : null}
                  {status ? <p className="text-sm leading-6 text-emerald-700">{status}</p> : null}
                </div>
                <Button type="submit" disabled={saving} className="min-w-[180px]">
                  {saving ? 'saving...' : 'save profile'}
                </Button>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
    </main>
  );
}
