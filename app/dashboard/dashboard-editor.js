/* eslint-disable @next/next/no-img-element */
'use client';

import Link from 'next/link';
import { useMemo, useRef, useState } from 'react';
import { signOut } from 'next-auth/react';
import styles from './dashboard.module.css';

function buildInitialState(profile) {
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

export default function DashboardEditor({ profile, email, created }) {
  const [form, setForm] = useState(() => buildInitialState(profile));
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(created ? 'Page claimed. Now make it cute.' : '');
  const [error, setError] = useState('');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingPolaroid, setUploadingPolaroid] = useState(null);
  const avatarInputRef = useRef(null);
  const polaroidInputRefs = useRef([]);

  const profileLink = useMemo(() => `/@${profile.handle}`, [profile.handle]);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function updatePolaroid(index, key, value) {
    setForm((current) => ({
      ...current,
      polaroids: current.polaroids.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item
      ),
    }));
  }

  async function uploadImage(file, kind, index) {
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
      updateField('avatarUrl', data.url);
      return;
    }

    updatePolaroid(index, 'imageUrl', data.url);
  }

  async function handleAvatarChange(event) {
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
      setError(uploadError.message || 'Could not upload avatar.');
    } finally {
      setUploadingAvatar(false);
      event.target.value = '';
    }
  }

  async function handlePolaroidChange(index, event) {
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
      setError(uploadError.message || 'Could not upload photo.');
    } finally {
      setUploadingPolaroid(null);
      event.target.value = '';
    }
  }

  async function handleSave(event) {
    event.preventDefault();
    setSaving(true);
    setError('');
    setStatus('Saving...');

    try {
      const payload = {
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
      setForm(buildInitialState(data.profile));
    } catch (saveError) {
      setError(saveError.message || 'Could not save profile.');
      setStatus('');
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.topbar}>
        <div>
          <div className="pill">dashboard</div>
          <h1 className={styles.title}>Edit your page</h1>
          <p className={styles.subtitle}>Signed in as {email}</p>
        </div>
        <div className={styles.topbarActions}>
          <Link href={profileLink} className="secondary-button">
            View public page
          </Link>
          <button type="button" className="ghost-button" onClick={() => signOut({ callbackUrl: '/' })}>
            Log out
          </button>
        </div>
      </div>

      <div className={styles.grid}>
        <section className={styles.previewCard}>
          <div className={styles.previewShell}>
            <div className={styles.previewHead}>
              <div className={styles.avatarFrame}>
                {form.avatarUrl ? <img src={form.avatarUrl} alt={form.displayName || profile.handle} /> : <span>{(form.displayName || profile.handle).slice(0, 1)}</span>}
              </div>
              <div>
                <p className={styles.previewName}>{form.displayName || profile.handle}</p>
                <p className={styles.previewHandle}>@{profile.handle}</p>
              </div>
            </div>
            <p className={styles.previewBio}>{form.bio || 'Your bio shows up here.'}</p>
            <div className={styles.previewTags}>
              {form.charactersText
                .split(',')
                .map((value) => value.trim())
                .filter(Boolean)
                .slice(0, 4)
                .map((character) => (
                  <span key={character}>{character}</span>
                ))}
            </div>
            <div className={styles.previewPolaroids}>
              {form.polaroids.map((polaroid, index) => (
                <article key={index} className={styles.previewPolaroid}>
                  <div className={styles.previewPhoto}>
                    {polaroid.imageUrl ? (
                      <img src={polaroid.imageUrl} alt={polaroid.caption || ''} />
                    ) : (
                      <span>{polaroid.caption || 'photo slot'}</span>
                    )}
                  </div>
                  <p>{polaroid.caption || 'caption here'}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <form className={styles.editor} onSubmit={handleSave}>
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>Core profile</h2>
              <p>{profileLink}</p>
            </div>
            <div className={styles.formGrid}>
              <div className="field">
                <label htmlFor="displayName">Display name</label>
                <input id="displayName" value={form.displayName} onChange={(event) => updateField('displayName', event.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="characters">Characters</label>
                <input
                  id="characters"
                  value={form.charactersText}
                  onChange={(event) => updateField('charactersText', event.target.value)}
                  placeholder="Yae Miko, Tingyun, Takina"
                />
              </div>
            </div>
            <div className="field">
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                rows="4"
                value={form.bio}
                onChange={(event) => updateField('bio', event.target.value)}
                placeholder="Tell people what kind of cosplayer page they just landed on."
              />
            </div>
            <div className={styles.avatarRow}>
              <div className={styles.avatarFrameLarge}>
                {form.avatarUrl ? <img src={form.avatarUrl} alt={form.displayName || profile.handle} /> : <span>avatar</span>}
              </div>
              <div className={styles.avatarMeta}>
                <p>Avatar</p>
                <span>Square images work best.</span>
                <div className={styles.inlineButtons}>
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => avatarInputRef.current?.click()}
                    disabled={uploadingAvatar}
                  >
                    {uploadingAvatar ? 'Uploading...' : 'Upload avatar'}
                  </button>
                  <button type="button" className="ghost-button" onClick={() => updateField('avatarUrl', '')}>
                    Clear
                  </button>
                </div>
                <input ref={avatarInputRef} hidden type="file" accept="image/*" onChange={handleAvatarChange} />
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>Socials</h2>
              <p>Drop handles or links.</p>
            </div>
            <div className={styles.formGrid}>
              <div className="field">
                <label htmlFor="twitterHandle">Twitter</label>
                <input id="twitterHandle" value={form.twitterHandle} onChange={(event) => updateField('twitterHandle', event.target.value)} placeholder="pci_yae" />
              </div>
              <div className="field">
                <label htmlFor="instagramHandle">Instagram</label>
                <input id="instagramHandle" value={form.instagramHandle} onChange={(event) => updateField('instagramHandle', event.target.value)} placeholder="yuuko.koro" />
              </div>
              <div className="field">
                <label htmlFor="tiktokHandle">TikTok</label>
                <input id="tiktokHandle" value={form.tiktokHandle} onChange={(event) => updateField('tiktokHandle', event.target.value)} placeholder="cutefoxcos" />
              </div>
              <div className="field">
                <label htmlFor="websiteUrl">Website</label>
                <input id="websiteUrl" value={form.websiteUrl} onChange={(event) => updateField('websiteUrl', event.target.value)} placeholder="https://your-site.com" />
              </div>
              <div className="field">
                <label htmlFor="youtubeUrl">YouTube</label>
                <input id="youtubeUrl" value={form.youtubeUrl} onChange={(event) => updateField('youtubeUrl', event.target.value)} placeholder="https://youtube.com/@you" />
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>Polaroid wall</h2>
              <p>Five little slots for your best stuff.</p>
            </div>
            <div className={styles.polaroidGrid}>
              {form.polaroids.map((polaroid, index) => (
                <article key={index} className={styles.slotCard}>
                  <div className={styles.slotPhoto}>
                    {polaroid.imageUrl ? (
                      <img src={polaroid.imageUrl} alt={polaroid.caption || ''} />
                    ) : (
                      <span>photo {index + 1}</span>
                    )}
                  </div>
                  <div className={styles.slotActions}>
                    <button
                      type="button"
                      className="secondary-button"
                      onClick={() => polaroidInputRefs.current[index]?.click()}
                      disabled={uploadingPolaroid === index}
                    >
                      {uploadingPolaroid === index ? 'Uploading...' : 'Upload'}
                    </button>
                    <button type="button" className="ghost-button" onClick={() => updatePolaroid(index, 'imageUrl', '')}>
                      Clear
                    </button>
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
                  <div className="field">
                    <label htmlFor={`caption-${index}`}>Caption</label>
                    <input
                      id={`caption-${index}`}
                      value={polaroid.caption}
                      onChange={(event) => updatePolaroid(index, 'caption', event.target.value)}
                      placeholder="Cherry blossom weekend"
                    />
                  </div>
                </article>
              ))}
            </div>
          </section>

          <div className={styles.footerBar}>
            <div>
              {error ? <p className="error-text">{error}</p> : null}
              {status ? <p className="success-text">{status}</p> : null}
            </div>
            <button type="submit" className="primary-button" disabled={saving}>
              {saving ? 'Saving...' : 'Save profile'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
