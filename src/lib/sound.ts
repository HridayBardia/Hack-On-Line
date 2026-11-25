"use client";

// Sound engine: Kept completely silent by default for professional enterprise UX.
class SoundEngine {
  public enabled: boolean = false;

  public toggle(): boolean {
    return false;
  }

  public playClick() {}
  public playHover() {}
  public playSuccess() {}
  public playScramble() {}
  public playError() {}
}

export const sound = new SoundEngine();
