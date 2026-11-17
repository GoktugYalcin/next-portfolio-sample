import { ContactLink, PortfolioProject } from "@/types/portfolio";

/*
 * The portfolio's content. Edit here and push; the site rebuilds.
 * (This used to live in Airtable; moved into the repo so the site has no
 * API quota or token to run out.)
 */

/** In the order they appear on the site. */
export const projects: PortfolioProject[] = [
  {
    name: "Where Can I Watch?",
    icon: "🍿",
    description:
      'Are you curious about a show that "where can you watch?" Do not be frightened, with this app you can determine!',
    live: "https://where-can-i-watch.gokyalc.in",
    github: "https://github.com/GoktugYalcin/where-can-i-watch",
    currently: false,
  },
  {
    name: "Moodlist",
    icon: "🎧",
    description:
      "MoodList is an open-source, AI-powered music companion that generates highly personalized Spotify playlists based on your exact mood",
    live: "https://moodlis-t.vercel.app",
    github: "https://github.com/GoktugYalcin/moodlist",
    currently: false,
  },
  {
    name: "RainWalk",
    icon: "☂",
    description:
      "Self relaxing app. Trip on cities when you listen their radios on always rainy day.",
    live: "https://rainwalk.gokyalc.in",
    github: "https://github.com/GoktugYalcin/rainwalk",
    currently: false,
  },
  {
    name: "color-luminance-brightness",
    icon: "🧮",
    description: "Library for luminance calculation on colors.",
    live: "https://www.npmjs.com/package/color-luminance-brightness",
    github: "https://github.com/GoktugYalcin/color-luminance-brightness",
    currently: false,
  },
  {
    name: "Short It!",
    icon: "⛓",
    description:
      "A link shortener for myself. Any shortened destroys itself on next day. (Unfortunately, it needs some day...)",
    live: "https://short.gokyalc.in",
    github: "https://github.com/GoktugYalcin/short-it",
    currently: false,
  },
  {
    name: "Aurora",
    icon: "🌌",
    description: "A Spotify recommendation tool. Based on AI and your emotions",
    live: "",
    github: "",
    currently: true,
  },
  {
    name: "Printable CV",
    icon: "📝",
    description: "A simple printable CV with simple(again) configurations.",
    live: "",
    github: "",
    currently: false,
  },
  {
    name: "BudgetIt!",
    icon: "🧾",
    description:
      "An iOS app for manage personal budget and investments. Usage is for just myself.",
    live: "",
    github: "",
    currently: true,
  },
];

/** In the order they appear on the site. */
export const contacts: ContactLink[] = [
  {
    type: "Instagram",
    label: "gokyalcin6",
    url: "https://instagr.am/gokyalcin6",
  },
  {
    type: "GitHub",
    label: "GoktugYalcin",
    url: "https://github.com/GoktugYalcin",
  },
  { type: "Medium", label: "gokyalcin", url: "https://blog.gokyalc.in" },
  {
    type: "LinkedIn",
    label: "yalcing",
    url: "https://linkedin.com/in/yalcing",
  },
  {
    type: "E-Mail",
    label: "gok[at]gokyalc.in",
    url: "mailto:gok@gokyalc.in",
  },
];
