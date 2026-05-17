// src/lib/ai-server.ts

const AI_SERVER_URL = 'https://arturo-nonclarified-chivalrously.ngrok-free.dev';
const GITHUB_API_URL = 'https://api.github.com/repos/rolvdeihai/InstructJet/dispatches';
let lastTriggerTime = 0;
const TRIGGER_COOLDOWN_MS = 60_000; // 1 minute

export async function isServerOnline(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(AI_SERVER_URL, { method: 'HEAD', signal: controller.signal });
    clearTimeout(timeoutId);
    return res.ok;
  } catch {
    return false;
  }
}

export async function triggerGitHubWorkflow(): Promise<boolean> {
  const now = Date.now();
  if (now - lastTriggerTime < TRIGGER_COOLDOWN_MS) {
    console.log('GitHub trigger skipped (cooldown)');
    return true; // pretend success to avoid repeated attempts
  }
  lastTriggerTime = now;

  const pat = process.env.GITHUB_PAT;
  if (!pat) {
    console.error('GITHUB_PAT not set');
    return false;
  }

  try {
    const res = await fetch(GITHUB_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${pat}`,
        'Accept': 'application/vnd.github+json',
      },
      body: JSON.stringify({ event_type: 'start-server' }),
    });
    if (!res.ok) {
      const errorText = await res.text();
      console.error('GitHub trigger failed:', errorText);
      return false;
    }
    console.log('GitHub workflow triggered successfully');
    return true;
  } catch (err) {
    console.error('Trigger error:', err);
    return false;
  }
}