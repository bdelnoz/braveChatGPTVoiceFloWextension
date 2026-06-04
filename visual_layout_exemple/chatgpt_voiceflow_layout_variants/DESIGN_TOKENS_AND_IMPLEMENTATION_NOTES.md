# ChatGPT Voice Flow - Layout Color Variants

Generated quick visual mockups for a Brave/Chromium extension widget.

## My strongest picks

1. **01 Navy / Coral**: closest to your current design, cleaner and safer.
2. **02 Graphite / Blue**: most professional GitHub-style dark UI.
3. **15 NoXoZ Signature**: strong red icon compatibility, keeps the product identity.
4. **13 Proton Dark**: good if you want a Proton/AI/productivity vibe.

## Implementation pattern

Use CSS variables, then swap only the palette. Keep the DOM and JS logic unchanged.

```css
:root {
  --vf-bg: #0b1220;
  --vf-panel: #121b2b;
  --vf-panel-2: #182338;
  --vf-border: #394862;
  --vf-primary: #315b90;
  --vf-danger: #ef6f73;
  --vf-success: #1fb878;
  --vf-text: #f2f5fa;
  --vf-muted: #9aa8ba;
  --vf-track: #25334a;
}
```

## Variant palettes

### 01. Navy / Coral

```css
--vf-bg: #0b1220;
--vf-panel: #121b2b;
--vf-panel-2: #182338;
--vf-border: #394862;
--vf-primary: #315b90;
--vf-danger: #ef6f73;
--vf-success: #1fb878;
--vf-text: #f2f5fa;
--vf-muted: #9aa8ba;
--vf-track: #25334a;
```

### 02. Graphite / Blue

```css
--vf-bg: #0d1117;
--vf-panel: #161b22;
--vf-panel-2: #21262d;
--vf-border: #30363d;
--vf-primary: #1f6feb;
--vf-danger: #f85149;
--vf-success: #238636;
--vf-text: #f0f6fc;
--vf-muted: #8b949e;
--vf-track: #30363d;
```

### 03. OLED Minimal

```css
--vf-bg: #000000;
--vf-panel: #070707;
--vf-panel-2: #111111;
--vf-border: #2a2a2a;
--vf-primary: #2f81f7;
--vf-danger: #ff5f56;
--vf-success: #00c781;
--vf-text: #f5f5f5;
--vf-muted: #9a9a9a;
--vf-track: #202020;
```

### 04. Terminal Green

```css
--vf-bg: #06110b;
--vf-panel: #0a1710;
--vf-panel-2: #102419;
--vf-border: #24583a;
--vf-primary: #1f6f46;
--vf-danger: #d74f4f;
--vf-success: #42d37a;
--vf-text: #e8fff0;
--vf-muted: #88b99a;
--vf-track: #163524;
```

### 05. Cyber Cyan

```css
--vf-bg: #07111f;
--vf-panel: #0b1728;
--vf-panel-2: #10223a;
--vf-border: #1b4a72;
--vf-primary: #00a3ff;
--vf-danger: #ff5c8a;
--vf-success: #00d1a7;
--vf-text: #eff8ff;
--vf-muted: #8db4ce;
--vf-track: #17314b;
```

### 06. Aubergine Neon

```css
--vf-bg: #130b1c;
--vf-panel: #1d102b;
--vf-panel-2: #2a183f;
--vf-border: #4b2f69;
--vf-primary: #7c5cff;
--vf-danger: #ff6b81;
--vf-success: #35d07f;
--vf-text: #fbf6ff;
--vf-muted: #b9a6ca;
--vf-track: #37224f;
```

### 07. Industrial Orange

```css
--vf-bg: #11100e;
--vf-panel: #1d1a16;
--vf-panel-2: #28231d;
--vf-border: #514534;
--vf-primary: #d1842f;
--vf-danger: #e05252;
--vf-success: #58b368;
--vf-text: #f7f0e6;
--vf-muted: #b1a28d;
--vf-track: #3b3328;
```

### 08. Slate / Mint

```css
--vf-bg: #0f1720;
--vf-panel: #17212c;
--vf-panel-2: #202c38;
--vf-border: #3a4a5a;
--vf-primary: #3d6f99;
--vf-danger: #e46f6f;
--vf-success: #32c48d;
--vf-text: #edf5fb;
--vf-muted: #9fb0be;
--vf-track: #2a3846;
```

### 09. Blueprint

```css
--vf-bg: #081321;
--vf-panel: #0e1e33;
--vf-panel-2: #132a47;
--vf-border: #2b5c8c;
--vf-primary: #3975ba;
--vf-danger: #f76d6d;
--vf-success: #28c282;
--vf-text: #edf7ff;
--vf-muted: #8bb1d0;
--vf-track: #1c3857;
```

### 10. Mono Plus

```css
--vf-bg: #121212;
--vf-panel: #1c1c1c;
--vf-panel-2: #272727;
--vf-border: #484848;
--vf-primary: #595f6a;
--vf-danger: #d75f5f;
--vf-success: #6cc47d;
--vf-text: #f1f1f1;
--vf-muted: #acacac;
--vf-track: #373737;
```

### 11. Midnight Gold

```css
--vf-bg: #090e18;
--vf-panel: #121a2a;
--vf-panel-2: #1b263a;
--vf-border: #3e4c64;
--vf-primary: #c59f4a;
--vf-danger: #df6b65;
--vf-success: #4bc686;
--vf-text: #fff8e6;
--vf-muted: #b6b0a0;
--vf-track: #2a3447;
```

### 12. Red Alert Sober

```css
--vf-bg: #140c0d;
--vf-panel: #1d1416;
--vf-panel-2: #2a1b1e;
--vf-border: #5a363b;
--vf-primary: #8d3a45;
--vf-danger: #f06767;
--vf-success: #29b36f;
--vf-text: #fff0f0;
--vf-muted: #c4a0a0;
--vf-track: #40272b;
```

### 13. Proton Dark

```css
--vf-bg: #0c0b19;
--vf-panel: #16142a;
--vf-panel-2: #211d3a;
--vf-border: #3f3a64;
--vf-primary: #6d5dfc;
--vf-danger: #f66b7a;
--vf-success: #35c68a;
--vf-text: #f4f2ff;
--vf-muted: #a8a1c8;
--vf-track: #2c2947;
```

### 14. Frosted Dark

```css
--vf-bg: #0d1218;
--vf-panel: #18202a;
--vf-panel-2: #242e3a;
--vf-border: #4a5968;
--vf-primary: #527fae;
--vf-danger: #e27178;
--vf-success: #35bd91;
--vf-text: #f4f8fb;
--vf-muted: #aab7c1;
--vf-track: #344252;
```

### 15. NoXoZ Signature

```css
--vf-bg: #080b12;
--vf-panel: #101724;
--vf-panel-2: #192337;
--vf-border: #42506a;
--vf-primary: #2e64a8;
--vf-danger: #ef4d4d;
--vf-success: #18c37e;
--vf-text: #f5f7fb;
--vf-muted: #9ba9bb;
--vf-track: #263348;
```

## Layout advice

- Keep the current compact shape. It is useful.
- Do not make every button bright. Only active Yes/No states should pop.
- Rename labels consistently: `Send transcription`, `Read aloud`, `Start transcription`, `Time of silence`, `Silence seconds`, `Volume threshold`, `Microphone volume`.
- For Mini mode: use short labels only: `Send tr.`, `Read`, `Start tr.`, `T.O.S.`, `sec`, `thr`, `vol`.
- Best UI improvement without breaking the JS: add one `theme` CSS class and CSS variables.
