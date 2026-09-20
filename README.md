# Sellix Hero Showcase

Build a single, self-contained index.html with no build step, no frameworks, and no external CSS or JS libraries. Follow the exact specification:
- Page: Full-viewport hero for "Sellix — Cross-border finance" with Plus Jakarta Sans (weights 300, 400, 500, 600, 800, font-display: block, aliased to 'PJS').
- Video background: Stacked dual <video> elements (bgVideoA with autoplay muted loop playsinline, bgVideoB muted loop playsinline) using video source https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260912_104036_bd6924f6-3c8e-417e-8465-6d03c8c2e9e6.mp4 and poster https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/82e7eb75-c65f-490a-99b5-f3d1cad54200.webp.
- Video cross-fade script: timeupdate listener cross-fading A and B with 0.9s transition at the loop point to eliminate the seam.
- Design unit: --u: min(calc(100vw / 1280), calc(100dvh / 760)) with 100vh fallback; exact tokens (--ink: #ffffff, --ink-muted: #ededed, --panel: #181818, --white-btn: #fdfdfd, --btn-ink: #050505, --glass-fill: rgba(0,0,0,.78), --glass-line: rgba(255,255,255,.09), --dx: 8.5, --dy: 13.1).
- Navigation: Desktop nav with logo "Sellix", 5 links (Products, Pricing, Developers, Resources, Contact Sales), Login button, Get Started button with inline arrow SVG, and mobile burger button.
- Hero inner: Two-line masked h1 ("Cross-border" / "finance" using .ln and .ln-i spans), 3-line subtitle copy, and CTA button pair (Get Started primary, Contact Sales ghost).
- Mobile menu drawer with backdrop blur and links + action buttons.
- Breakpoints: Tablet (max-width: 1160px), Mobile (max-width: 552px), Narrow phones (max-width: 353px), Short landscape (max-width: 552px and max-height: 460px).
- Entrance animation sequence: html.anim armed synchronously in <head> script after <style>, triggering on document.fonts.ready with line rise, pill settle, and lift animations, cleaned up on last animationend.
- prefers-reduced-motion: Full handling (paused first-frame still video, no animations or transitions).

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://sellix-seamless-showcase.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/75b8d73d-9661-4537-8404-b24ed587ef10).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
