import type { Config } from "tailwindcss";
import flowbite from "flowbite-react/tailwind";
import plugin from "tailwindcss/plugin";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    flowbite.content(),
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        glacialBlue: '#A2DDF5',
        mossGreen: '#8AB83D',
        earthBrown: '#765C48',
        goldenYellow: '#FFD166',
        softGrey: '#F5F5F5',
        charcoal: '#333333',
      },
      
    },
   
  },  
  plugins: [
    flowbite.plugin(),
    plugin(function ({ addComponents }: { addComponents: (components: Record<string, any>) => void }) {
      addComponents({
        'button:focus-': {
          outline: 'none',
          ring: '0',
        },
      });
    }),
  ],
} satisfies Config;