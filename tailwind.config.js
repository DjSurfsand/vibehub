// tailwind.config.js — VibeHub Design System
// Retro cyberpunk social platform. Every token maps to DESIGN.md.

import { fontFamily } from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./index.html"],
  darkMode: "class", // always-on dark mode — class is set on <html> by default
  theme: {
    extend: {
      colors: {
        // --- Dark Space Backgrounds ---
        bg: {
          deep: "#0A0A0F",
          surface: "#12122A",
          card: "#1A1A2E",
          elevated: "#16213E",
        },

        // --- Neon Accent Channels ---
        neon: {
          cyan: "#00F0FF",
          magenta: "#FF2D95",
          lime: "#39FF14",
          amber: "#FFB347",
          red: "#FF3355",
        },

        // --- Semantic Neon (derived, for component use) ---
        vote: {
          up: "#39FF14",
          down: "#FF3355",
        },

        // --- Text ---
        text: {
          primary: "#E8E8F0",
          secondary: "#8888AA",
          dim: "#555577",
          "on-neon": "#0A0A0F",
        },

        // --- Borders ---
        border: {
          subtle: "#2A2A4A",
        },
      },

      fontFamily: {
        display: ['"Orbitron"', ...fontFamily.sans],
        body: ['"Inter"', ...fontFamily.sans],
        mono: ['"JetBrains Mono"', ...fontFamily.mono],
        pixel: ['"Press Start 2P"', "monospace"],
      },

      fontSize: {
        // Corresponds to DESIGN.md typography scale
        "h1": ["2.5rem", { lineHeight: "1.1", fontWeight: "700", letterSpacing: "0.02em", fontFamily: '"Orbitron"' }],
        "h2": ["1.75rem", { lineHeight: "1.2", fontWeight: "600", letterSpacing: "0.01em", fontFamily: '"Orbitron"' }],
        "h3": ["1.25rem", { lineHeight: "1.3", fontWeight: "600", fontFamily: '"Inter"' }],
        "body-lg": ["1.0625rem", { lineHeight: "1.6" }],
        "body-md": ["0.9375rem", { lineHeight: "1.6" }],
        "body-sm": ["0.8125rem", { lineHeight: "1.5" }],
        "mono": ["0.875rem", { lineHeight: "1.5", fontFamily: '"JetBrains Mono"' }],
        "mono-sm": ["0.75rem", { lineHeight: "1.4", fontFamily: '"JetBrains Mono"' }],
        "pixel": ["0.625rem", { lineHeight: "1.4", letterSpacing: "0.05em", fontFamily: '"Press Start 2P"' }],
        "label-caps": ["0.6875rem", { lineHeight: "1", fontWeight: "600", letterSpacing: "0.08em", textTransform: "uppercase" }],
      },

      borderRadius: {
        sm: "4px",
        md: "8px",
        lg: "12px",
        xl: "16px",
      },

      spacing: {
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "32px",
        xxl: "48px",
        section: "80px",
      },

      maxWidth: {
        "content": "1200px",
        "readable": "60ch",
      },

      boxShadow: {
        "card": "0 4px 20px rgba(0, 0, 0, 0.4)",
        "card-hover": "0 4px 24px rgba(0, 0, 0, 0.5), 0 0 10px rgba(0, 240, 255, 0.15)",
        "glow-cyan": "0 0 15px rgba(0, 240, 255, 0.3), 0 0 40px rgba(0, 240, 255, 0.1)",
        "glow-magenta": "0 0 15px rgba(255, 45, 149, 0.3), 0 0 40px rgba(255, 45, 149, 0.1)",
        "glow-lime": "0 0 15px rgba(57, 255, 20, 0.3), 0 0 40px rgba(57, 255, 20, 0.1)",
        "glow-red": "0 0 15px rgba(255, 51, 85, 0.3), 0 0 40px rgba(255, 51, 85, 0.1)",
        "glow-ring": "0 0 0 3px rgba(0, 240, 255, 0.15)",
        "toast": "0 8px 32px rgba(0, 0, 0, 0.5)",
        "modal": "0 24px 64px rgba(0, 0, 0, 0.6)",
      },

      backgroundImage: {
        "gradient-cta": "linear-gradient(135deg, #00F0FF, #FF2D95)",
        "gradient-gold": "linear-gradient(135deg, #FFB347, #FF2D95)",
        "gradient-cyan": "linear-gradient(135deg, #00F0FF, #00B4D8)",
        "gradient-magenta": "linear-gradient(135deg, #FF2D95, #B8175C)",
        "gradient-lime": "linear-gradient(135deg, #39FF14, #00CC00)",
        "gradient-amber": "linear-gradient(135deg, #FFB347, #FF8C00)",
        // Grid patterns for retro CRT texture
        "grid-cyan": "linear-gradient(rgba(0, 240, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 240, 255, 0.03) 1px, transparent 1px)",
        "grid-magenta": "linear-gradient(rgba(255, 45, 149, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 45, 149, 0.03) 1px, transparent 1px)",
      },

      backgroundSize: {
        "grid-sm": "20px 20px",
        "grid-md": "40px 40px",
      },

      textShadow: {
        glow: "0 0 8px currentColor",
        "glow-cyan": "0 0 8px rgba(0, 240, 255, 0.5)",
        "glow-magenta": "0 0 8px rgba(255, 45, 149, 0.5)",
        "glow-lime": "0 0 8px rgba(57, 255, 20, 0.5)",
      },

      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-in-right": {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "glow-scan": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "pulse-neon": {
          "0%, 100%": { boxShadow: "0 0 10px rgba(0, 240, 255, 0.2)" },
          "50%": { boxShadow: "0 0 20px rgba(0, 240, 255, 0.5)" },
        },
        "vibe-bounce": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.15)" },
        },
        "scan-line": {
          "0%": { transform: "translateY(-100vh)" },
          "100%": { transform: "translateY(100vh)" },
        },
        "rainbow-border": {
          "0%": { borderColor: "#00F0FF" },
          "25%": { borderColor: "#FF2D95" },
          "50%": { borderColor: "#39FF14" },
          "75%": { borderColor: "#FFB347" },
          "100%": { borderColor: "#00F0FF" },
        },
      },

      animation: {
        "fade-in": "fade-in 200ms ease-out",
        "slide-in-right": "slide-in-right 300ms cubic-bezier(0.16, 1, 0.3, 1)",
        "glow-scan": "glow-scan 2s ease-in-out infinite",
        "pulse-neon": "pulse-neon 2s ease-in-out infinite",
        "vibe-bounce": "vibe-bounce 200ms spring(80, 10, 10, 0)",
        "rainbow-border": "rainbow-border 3s ease-in-out",
      },

      backdropBlur: {
        glass: "12px",
      },

      borderWidth: {
        neon: "2px",
      },
    },
  },

  plugins: [
    // Adds text-shadow via arbitrary values — we keep it in config for DX
    function ({ addUtilities, theme }) {
      addUtilities({
        ".text-glow": {
          textShadow: "0 0 8px currentColor",
        },
        ".text-glow-cyan": {
          textShadow: theme("textShadow.glow-cyan"),
        },
        ".text-glow-magenta": {
          textShadow: theme("textShadow.glow-magenta"),
        },
        ".text-glow-lime": {
          textShadow: theme("textShadow.glow-lime"),
        },
        ".bg-grid-cyan": {
          backgroundImage: theme("backgroundImage.grid-cyan"),
          backgroundSize: theme("backgroundSize.grid-md"),
        },
        ".bg-grid-magenta": {
          backgroundImage: theme("backgroundImage.grid-magenta"),
          backgroundSize: theme("backgroundSize.grid-md"),
        },
        ".scrollbar-neon": {
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: "#0A0A0F",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#2A2A4A",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "#00F0FF",
          },
        },
      });
    },
  ],
};