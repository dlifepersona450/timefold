/** Optional synthesized room tone. No audio files or external recordings. */
export function mountAmbientAudio(button: HTMLButtonElement, label: HTMLElement): () => void {
  const listeners = new AbortController();
  const oscillators: OscillatorNode[] = [];
  let context: AudioContext | undefined;
  let masterGain: GainNode | undefined;
  let enabled = false;
  let busy = false;
  let disposed = false;

  function updateButton(unavailable = false) {
    button.setAttribute("aria-pressed", String(enabled));
    button.setAttribute("aria-label", enabled ? "Disable ambient sound" : "Enable ambient sound");
    label.textContent = unavailable ? "Sound unavailable" : enabled ? "Sound on" : "Sound off";
  }

  function reportUnavailable() {
    enabled = false;
    if (context && masterGain && context.state !== "closed") {
      masterGain.gain.setValueAtTime(0, context.currentTime);
    }
    updateButton(true);
  }

  function createAudioGraph() {
    context = new AudioContext();
    masterGain = context.createGain();
    masterGain.gain.value = 0;
    masterGain.connect(context.destination);
    [55, 82.41, 110, 164.81].forEach((frequency, index) => {
      const oscillator = context!.createOscillator();
      const voiceGain = context!.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = frequency;
      oscillator.detune.value = index * 2;
      voiceGain.gain.value = 0.12 / (index + 1);
      oscillator.connect(voiceGain);
      voiceGain.connect(masterGain!);
      oscillators.push(oscillator);
      oscillator.start();
    });
  }

  async function toggleSound() {
    if (busy || disposed) return;
    busy = true;
    try {
      if (!context) createAudioGraph();
      await context!.resume();
      if (disposed) return;
      enabled = !enabled;
      masterGain!.gain.setTargetAtTime(enabled ? 0.18 : 0, context!.currentTime, 0.5);
      updateButton();
    } catch {
      if (!disposed) reportUnavailable();
    } finally {
      busy = false;
    }
  }

  async function syncVisibility() {
    if (!context || context.state === "closed" || disposed) return;
    try {
      if (document.hidden) await context.suspend();
      else if (enabled) await context.resume();
    } catch {
      if (!disposed) reportUnavailable();
    }
  }

  function dispose() {
    if (disposed) return;
    disposed = true;
    listeners.abort();
    oscillators.forEach((oscillator) => {
      oscillator.stop();
      oscillator.disconnect();
    });
    masterGain?.disconnect();
    if (context && context.state !== "closed") void context.close().catch(() => {});
  }

  button.addEventListener("click", toggleSound, { signal: listeners.signal });
  document.addEventListener("visibilitychange", syncVisibility, { signal: listeners.signal });
  return dispose;
}
