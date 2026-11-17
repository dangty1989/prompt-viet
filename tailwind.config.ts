import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--color-background))",
        foreground: "rgb(var(--color-foreground))",
        card: {
          DEFAULT: "rgb(var(--color-card))",
          foreground: "rgb(var(--color-card-foreground))",
        },
        popover: {
          DEFAULT: "rgb(var(--color-popover))",
          foreground: "rgb(var(--color-popover-foreground))",
        },
        primary: {
          DEFAULT: "rgb(var(--color-primary))",
          foreground: "rgb(var(--color-primary-foreground))",
          hover: "rgb(var(--color-primary-hover))",
          active: "rgb(var(--color-primary-active))",
        },
        secondary: {
          DEFAULT: "rgb(var(--color-secondary))",
          foreground: "rgb(var(--color-secondary-foreground))",
          hover: "rgb(var(--color-secondary-hover))",
        },
        accent: {
          DEFAULT: "rgb(var(--color-accent))",
          foreground: "rgb(var(--color-accent-foreground))",
          hover: "rgb(var(--color-accent-hover))",
        },
        muted: {
          DEFAULT: "rgb(var(--color-muted))",
          foreground: "rgb(var(--color-muted-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--color-destructive))",
          foreground: "hsl(var(--color-destructive-foreground))",
        },
        border: "rgb(var(--color-border))",
        input: "rgb(var(--color-input))",
        ring: "rgb(var(--color-ring))",
      },
      borderRadius: {
        lg: "var(--radius-lg)",
        md: "var(--radius-md)",
        sm: "var(--radius-sm)",
        xl: "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
        full: "var(--radius-full)",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
        heading: ["var(--font-heading)"],
      },
      spacing: {
        "section": "var(--space-20)",
        "component": "var(--space-6)",
      },
      boxShadow: {
        xs: "var(--shadow-xs)",
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        xl: "var(--shadow-xl)",
      },
      transitionDuration: {
        fast: "var(--transition-fast)",
        normal: "var(--transition-normal)",
        slow: "var(--transition-slow)",
      },
      zIndex: {
        dropdown: "var(--z-dropdown)",
        sticky: "var(--z-sticky)",
        fixed: "var(--z-fixed)",
        "modal-backdrop": "var(--z-modal-backdrop)",
        modal: "var(--z-modal)",
        popover: "var(--z-popover)",
        tooltip: "var(--z-tooltip)",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          from: { opacity: "0", transform: "translateY(-10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        fadeIn: "fadeIn var(--transition-normal) ease-out forwards",
        slideUp: "slideUp var(--transition-slow) ease-out forwards",
        slideDown: "slideDown var(--transition-slow) ease-out forwards",
        scaleIn: "scaleIn var(--transition-normal) ease-out forwards",
      },
    },
  },
  plugins: [],
}

export default config