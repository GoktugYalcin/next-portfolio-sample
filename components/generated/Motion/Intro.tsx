"use client";

import { useLayoutEffect } from "react";

const EASE_OUT = "cubic-bezier(0.16, 1, 0.3, 1)";
const EASE_IN_OUT = "cubic-bezier(0.65, 0, 0.35, 1)";

let run = 0;

/** The avatar frame's resting box, ignoring the reveal it hasn't played yet. */
const restingRect = (el: Element) => {
  const reveal = el.closest<HTMLElement>(".reveal");
  if (!reveal) return el.getBoundingClientRect();
  const { transform, transition } = reveal.style;
  reveal.style.transition = "none";
  reveal.style.transform = "none";
  const rect = el.getBoundingClientRect();
  reveal.style.transform = transform;
  void reveal.offsetWidth;
  reveal.style.transition = transition;
  return rect;
};

/**
 * First home visit of a session: the page waits under a sheet of paper while
 * my picture says hi from the middle of the screen, then the sheet lifts and
 * the picture flies to its place in the profile.
 */
const Intro = ({
  avatar,
  line = "hi :)",
}: {
  avatar: string;
  line?: string;
}) => {
  useLayoutEffect(() => {
    const html = document.documentElement;

    if (!html.classList.contains("intro")) {
      try {
        const forced = /[?&]intro\b/.test(location.search);
        if (!forced && (sessionStorage.getItem("intro") || location.hash))
          return;
      } catch (e) {
        return;
      }
      html.classList.add("intro");
    }

    const id = ++run;
    window.__introStarted = true;
    try {
      sessionStorage.setItem("intro", "1");
    } catch (e) {}

    const timers: number[] = [];
    let face: HTMLDivElement | null = null;
    let done = false;

    const finish = () => {
      if (done) return;
      done = true;
      html.classList.add("intro-out");
      document.dispatchEvent(new Event("introdone"));
      window.setTimeout(() => html.classList.remove("intro", "intro-out"), 650);
    };

    const target = document.querySelector(".avatar .avatar-frame");
    const rect = target?.getBoundingClientRect();
    const onScreen =
      !!rect && rect.bottom > 0 && rect.top < innerHeight && rect.width > 0;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!target || !onScreen || reduced) {
      finish();
      return;
    }

    face = document.createElement("div");
    face.className = "intro-face";
    face.setAttribute("aria-hidden", "true");

    const frame = document.createElement("div");
    frame.className = "intro-frame";
    const img = document.createElement("img");
    img.src = avatar;
    img.alt = "";
    img.draggable = false;
    frame.appendChild(img);

    const say = document.createElement("div");
    say.className = "intro-say";
    const bubble = document.createElement("span");
    bubble.className = "me-say";
    bubble.textContent = line;
    say.appendChild(bubble);

    face.append(frame, say);
    document.body.appendChild(face);
    face.style.left = Math.round((innerWidth - face.offsetWidth) / 2) + "px";
    face.style.top = Math.round((innerHeight - face.offsetHeight) / 2) + "px";

    face.animate(
      [
        { opacity: 0, transform: "translateY(8px) scale(0.94)" },
        { opacity: 1, transform: "none" },
      ],
      { duration: 380, easing: EASE_OUT }
    );

    timers.push(window.setTimeout(() => bubble.classList.add("on"), 820));

    timers.push(
      window.setTimeout(() => {
        if (!face) return;
        bubble.classList.remove("on");
        finish();

        const from = frame.getBoundingClientRect();
        const box = face.getBoundingClientRect();
        const to = restingRect(target);

        face.style.transformOrigin =
          from.left - box.left + "px " + (from.top - box.top) + "px";
        const fly = face.animate(
          [
            { transform: "none" },
            {
              transform:
                "translate(" +
                (to.left - from.left) +
                "px," +
                (to.top - from.top) +
                "px) scale(" +
                to.width / from.width +
                ")",
            },
          ],
          { duration: 700, easing: EASE_IN_OUT, fill: "forwards" }
        );
        fly.onfinish = () => {
          timers.push(
            window.setTimeout(() => {
              if (!face) return;
              const el = face;
              el.animate([{ opacity: 1 }, { opacity: 0 }], {
                duration: 220,
                fill: "forwards",
              }).onfinish = () => el.remove();
            }, 750)
          );
        };
      }, 1250 + 45 * line.length)
    );

    return () => {
      timers.forEach(clearTimeout);
      face?.remove();
      face = null;
      /* leaving mid-intro must not strand the cover; a strict-mode re-run
       * bumps `run` first and takes over instead */
      window.setTimeout(() => {
        if (run === id) finish();
      }, 0);
    };
  }, [avatar, line]);

  return null;
};

export default Intro;
