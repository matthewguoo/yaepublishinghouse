/* eslint-disable @next/next/no-img-element */
'use client';

import Link from 'next/link';
import { useMemo, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { signOut } from 'next-auth/react';
import { ExternalLink, LogOut, Sparkles, Upload, WandSparkles, X } from 'lucide-react';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Separator } from '../../components/ui/separator';
import { Textarea } from '../../components/ui/textarea';
import { getErrorMessage } from '../../lib/errors';
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
    charactersText: (profile.characters || []).join(', '),
    polaroids,
  };
}

export default function DashboardEditor({ profile, email, created }: DashboardEditorProps) {
  const [form, setForm] = useState<DashboardFormState>(() => buildInitialState(profile));
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(created ? 'Page claimed. Now make it cute.' : '');
  const [error, setError] = useState('');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingPolaroid, setUploadingPolaroid] = useState<number | null>(null);
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const polaroidInputRefs = useRef<Array<HTMLInputElement | null>>([]);

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
      setStatus('Uploading avatar...');
      await uploadImage(file, 'avatar');
      setStatus('Avatar uploaded. Hit save when you are done.');
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
      setStatus('Uploading polaroid...');
      await uploadImage(file, 'polaroid', index);
      setStatus('Polaroid uploaded. Hit save when you are done.');
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
    setStatus('Saving...');

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

      setStatus('Saved. Your page is live.');
      setForm(buildInitialState(data.profile as PublicProfile));
    } catch (saveError) {
      setError(getErrorMessage(saveError, 'Could not save profile.'));
      setStatus('');
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-5 sm:px-6 sm:py-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(255,184,214,0.28),transparent_16%),radial-gradient(circle_at_88%_14%,rgba(255,236,244,0.94),transparent_18%),radial-gradient(circle_at_78%_78%,rgba(255,194,222,0.18),transparent_22%)]" />
      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-5">
        <Card className="overflow-hidden rounded-[34px] border-petal-200/70 bg-white/84 shadow-float">
          <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="grid gap-3">
              <Badge className="w-fit">dashboard</Badge>
              <div className="grid gap-2">
                <h1 className="font-display text-4xl leading-none tracking-[-0.05em] sm:text-6xl">Edit your page</h1>
                <p className="text-sm leading-7 text-muted-foreground sm:text-base">Signed in as {email}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="secondary">
                <Link href={profileLink}>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View public page
                </Link>
              </Button>
              <Button type="button" variant="ghost" onClick={() => signOut({ callbackUrl: '/' })}>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-5 xl:grid-cols-[minmax(340px,410px)_minmax(0,1fr)]">
          <Card className="sticky top-4 overflow-hidden rounded-[34px] border-petal-200/70 bg-white/84 shadow-float xl:self-start">
            <div className="absolute inset-0 bg-petal-grid opacity-80" />
            <CardContent className="relative grid gap-5 p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="grid gap-2">
                  <Badge className="w-fit">live preview</Badge>
                  <p className="font-scribble text-2xl text-petal-700">tiny scrapbook energy</p>
                </div>
                <div className="rounded-full bg-white/80 p-3 text-petal-600 shadow-sm">
                  <Sparkles className="h-5 w-5" />
                </div>
              </div>

              <div className="grid gap-5 rounded-[28px] border border-petal-200/70 bg-white/88 p-4 shadow-petal">
                <div className="flex items-center gap-4">
                  <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-[24px] bg-gradient-to-br from-petal-100 to-petal-200 text-2xl font-display text-jam">
                    {form.avatarUrl ? (
                      <img src={form.avatarUrl} alt={form.displayName || profile.handle} className="h-full w-full object-cover" />
                    ) : (
                      <span>{(form.displayName || profile.handle).slice(0, 1)}</span>
                    )}
                  </div>
                  <div className="grid gap-1">
                    <p className="font-display text-3xl leading-none tracking-[-0.05em]">{form.displayName || profile.handle}</p>
                    <p className="text-sm text-muted-foreground">@{profile.handle}</p>
                  </div>
                </div>

                <p className="text-sm leading-7 text-muted-foreground">
                  {form.bio || 'Your bio shows up here.'}
                </p>

                <div className="flex flex-wrap gap-2">
                  {previewCharacters.length ? (
                    previewCharacters.map((character) => (
                      <Badge key={character} variant="secondary" className="normal-case tracking-normal">
                        {character}
                      </Badge>
                    ))
                  ) : (
                    <Badge variant="outline" className="normal-case tracking-normal">
                      add a few characters
                    </Badge>
                  )}
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-3">
                  {form.polaroids.map((polaroid, index) => (
                    <article
                      key={index}
                      className="grid gap-2 rounded-[22px] bg-white p-3 shadow-sm ring-1 ring-petal-100"
                    >
                      <div className="aspect-square overflow-hidden rounded-[16px] bg-gradient-to-br from-petal-100 to-petal-50">
                        {polaroid.imageUrl ? (
                          <img src={polaroid.imageUrl} alt={polaroid.caption || ''} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full items-center justify-center px-3 text-center text-xs leading-5 text-muted-foreground">
                            {polaroid.caption || 'photo slot'}
                          </div>
                        )}
                      </div>
                      <p className="font-scribble text-sm leading-5 text-jam">{polaroid.caption || 'caption here'}</p>
                    </article>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <form className="grid gap-5" onSubmit={handleSave}>
            <Card className="rounded-[34px] border-petal-200/70 bg-white/84 shadow-float">
              <CardHeader className="gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge>core profile</Badge>
                  <Badge variant="secondary" className="normal-case tracking-normal">{profileLink}</Badge>
                </div>
                <CardTitle>Make the page feel like you.</CardTitle>
                <CardDescription>
                  This editor is shadcn-based now, but the surface is still soft and custom instead of default grey enterprise mush.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="grid gap-3">
                    <Label htmlFor="displayName">Display name</Label>
                    <Input id="displayName" value={form.displayName} onChange={(event) => updateField('displayName', event.target.value)} />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="characters">Characters</Label>
                    <Input
                      id="characters"
                      value={form.charactersText}
                      onChange={(event) => updateField('charactersText', event.target.value)}
                      placeholder="Yae Miko, Tingyun, Takina"
                    />
                  </div>
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    rows={4}
                    value={form.bio}
                    onChange={(event) => updateField('bio', event.target.value)}
                    placeholder="Tell people what kind of cosplayer page they just landed on."
                  />
                </div>

                <div className="grid gap-5 rounded-[28px] border border-dashed border-petal-300/80 bg-petal-50/80 p-4 md:grid-cols-[140px_minmax(0,1fr)] md:items-center">
                  <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-[26px] bg-white shadow-sm ring-1 ring-petal-100">
                    {form.avatarUrl ? (
                      <img src={form.avatarUrl} alt={form.displayName || profile.handle} className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-sm text-muted-foreground">avatar</span>
                    )}
                  </div>
                  <div className="grid gap-3">
                    <div className="grid gap-1">
                      <p className="text-sm font-semibold uppercase tracking-[0.12em] text-jam">Avatar</p>
                      <p className="text-sm leading-6 text-muted-foreground">Square images work best. Good face crop, good lighting, no chaos in the background.</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Button type="button" variant="secondary" onClick={() => avatarInputRef.current?.click()} disabled={uploadingAvatar}>
                        <Upload className="mr-2 h-4 w-4" />
                        {uploadingAvatar ? 'Uploading...' : 'Upload avatar'}
                      </Button>
                      <Button type="button" variant="ghost" onClick={() => updateField('avatarUrl', '')}>
                        <X className="mr-2 h-4 w-4" />
                        Clear
                      </Button>
                    </div>
                    <input ref={avatarInputRef} hidden type="file" accept="image/*" onChange={handleAvatarChange} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[34px] border-petal-200/70 bg-white/84 shadow-float">
              <CardHeader>
                <div className="flex flex-wrap items-center gap-3">
                  <Badge>socials</Badge>
                  <Badge variant="secondary" className="normal-case tracking-normal">drop handles or links</Badge>
                </div>
                <CardTitle>Link the places people already know you from.</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-5 md:grid-cols-2">
                <div className="grid gap-3">
                  <Label htmlFor="twitterHandle">Twitter</Label>
                  <Input id="twitterHandle" value={form.twitterHandle} onChange={(event) => updateField('twitterHandle', event.target.value)} placeholder="pci_yae" />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="instagramHandle">Instagram</Label>
                  <Input id="instagramHandle" value={form.instagramHandle} onChange={(event) => updateField('instagramHandle', event.target.value)} placeholder="yuuko.koro" />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="tiktokHandle">TikTok</Label>
                  <Input id="tiktokHandle" value={form.tiktokHandle} onChange={(event) => updateField('tiktokHandle', event.target.value)} placeholder="cutefoxcos" />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="websiteUrl">Website</Label>
                  <Input id="websiteUrl" value={form.websiteUrl} onChange={(event) => updateField('websiteUrl', event.target.value)} placeholder="https://your-site.com" />
                </div>
                <div className="grid gap-3 md:col-span-2">
                  <Label htmlFor="youtubeUrl">YouTube</Label>
                  <Input id="youtubeUrl" value={form.youtubeUrl} onChange={(event) => updateField('youtubeUrl', event.target.value)} placeholder="https://youtube.com/@you" />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[34px] border-petal-200/70 bg-white/84 shadow-float">
              <CardHeader>
                <div className="flex flex-wrap items-center gap-3">
                  <Badge>polaroid wall</Badge>
                  <Badge variant="secondary" className="normal-case tracking-normal">five cute little slots</Badge>
                </div>
                <CardTitle>Hero shots, con weekends, placeholders, whatever.</CardTitle>
                <CardDescription>
                  Keep the captions short. Think scrapbook notes, not paragraph posts.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {form.polaroids.map((polaroid, index) => (
                  <article
                    key={index}
                    className="grid gap-4 rounded-[28px] border border-petal-200/70 bg-petal-50/70 p-4 shadow-sm"
                  >
                    <div className="aspect-square overflow-hidden rounded-[20px] bg-white shadow-sm ring-1 ring-petal-100">
                      {polaroid.imageUrl ? (
                        <img src={polaroid.imageUrl} alt={polaroid.caption || ''} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center px-4 text-center text-sm text-muted-foreground">
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
                        {uploadingPolaroid === index ? 'Uploading...' : 'Upload'}
                      </Button>
                      <Button type="button" variant="ghost" onClick={() => updatePolaroid(index, 'imageUrl', '')}>
                        <X className="mr-2 h-4 w-4" />
                        Clear
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
                      <Label htmlFor={`caption-${index}`}>Caption</Label>
                      <Input
                        id={`caption-${index}`}
                        value={polaroid.caption}
                        onChange={(event) => updatePolaroid(index, 'caption', event.target.value)}
                        placeholder="Cherry blossom weekend"
                      />
                    </div>
                  </article>
                ))}
              </CardContent>
            </Card>

            <Card className="rounded-[34px] border-petal-200/70 bg-white/84 shadow-float">
              <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <div className="grid gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {error ? (
                      <Badge className="border-rose-200 bg-rose-50 text-rose-700">save issue</Badge>
                    ) : status ? (
                      <Badge className="bg-emerald-50 text-emerald-700">status</Badge>
                    ) : null}
                    <Badge variant="secondary" className="gap-2 normal-case tracking-normal">
                      <WandSparkles className="h-3.5 w-3.5" /> polished with shadcn + custom skin
                    </Badge>
                  </div>
                  {error ? <p className="text-sm leading-6 text-rose-700">{error}</p> : null}
                  {status ? <p className="text-sm leading-6 text-emerald-700">{status}</p> : null}
                </div>
                <Button type="submit" disabled={saving} className="min-w-[180px]">
                  {saving ? 'Saving...' : 'Save profile'}
                </Button>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
    </main>
  );
}
