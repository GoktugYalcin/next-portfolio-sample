"use client";

import React, { useEffect, useRef } from "react";
import type Matter from "matter-js";
import { PILE_ITEMS, PileItemDef } from "./items";

type Item = {
  def: PileItemDef;
  body: Matter.Body;
  el: HTMLDivElement;
  w: number;
  h: number;
  inWorld: boolean;
  drawn: boolean;
};

const STEP = 1000 / 60;

const HIT = ["hey!", "ow.", "rude.", "nice throw.", "watch the hat.", "again?"];
const POKE = ["hi :)", "that tickles.", "throw something.", "tidy up, maybe?"];
const TIDY = ["much better.", "there. sorted.", "neat."];

const pick = (lines: string[]) =>
  lines[Math.floor(Math.random() * lines.length)];

/**
 * The footer pile: a handful of drawn objects with real weight. They drop in
 * when the footer arrives, and can be dragged, thrown at the little walker,
 * and tidied back into a row.
 */
const Pile = () => {
  const pileRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);
  const meRef = useRef<HTMLDivElement>(null);
  const sayRef = useRef<HTMLSpanElement>(null);
  const tidyRef = useRef<() => void>(() => {});

  useEffect(() => {
    const pile = pileRef.current;
    const layer = itemsRef.current;
    const me = meRef.current;
    const bubble = sayRef.current;
    if (!pile || !layer || !me || !bubble) return;

    let M: typeof Matter | null = null;
    let engine: Matter.Engine | null = null;
    let items: Item[] = [];
    let width = 0;
    let height = 0;
    let scale = 1;
    let epoch = 0; // bumps on every rebuild so stale timeouts can tell
    let dropping = 0;
    let visible = false;
    let started = false;
    let frame = 0;
    let lastTime = 0;
    let acc = 0;
    let lastThrow = -1e9;
    let alive = true;
    let sayTimer = 0;
    let hopTimer = 0;
    let held: {
      it: Item;
      c: Matter.Constraint;
      id: number;
    } | null = null;

    const say = (line: string, ms = 1700) => {
      bubble.textContent = line;
      bubble.classList.add("on");
      window.clearTimeout(sayTimer);
      sayTimer = window.setTimeout(() => bubble.classList.remove("on"), ms);
    };
    const hop = () => {
      me.classList.remove("hop");
      void me.offsetWidth;
      me.classList.add("hop");
      window.clearTimeout(hopTimer);
      hopTimer = window.setTimeout(() => me.classList.remove("hop"), 520);
    };

    const local = (e: PointerEvent) => {
      const box = pile.getBoundingClientRect();
      return { x: e.clientX - box.left, y: e.clientY - box.top };
    };

    const render = (force: boolean) => {
      for (const it of items) {
        const b = it.body;
        if (!it.inWorld || (!force && b.isSleeping && it.drawn)) continue;
        it.drawn = true;
        it.el.style.transform =
          "translate3d(" +
          (b.position.x - it.w / 2).toFixed(1) +
          "px," +
          (b.position.y - it.h / 2).toFixed(1) +
          "px,0) rotate(" +
          b.angle.toFixed(4) +
          "rad)";
      }
    };

    /** let a batch fall in from above, one after another */
    const drop = (batch: Item[], tidy: boolean) => {
      if (!M || !engine) return;
      const lib = M;
      const world = engine.world;
      const edge = me.offsetLeft - 10;
      const stamp = epoch;
      dropping++;
      batch.forEach((it, i) =>
        window.setTimeout(() => {
          if (stamp !== epoch || !alive) return;
          const room = Math.max(8, edge - 12 - it.w);
          const x = tidy
            ? 12 +
              it.w / 2 +
              room * ((i + 0.5) / batch.length) +
              30 * (Math.random() - 0.5)
            : 12 + it.w / 2 + Math.random() * room;
          lib.Body.setPosition(it.body, { x, y: -0.6 * it.h - 20 });
          lib.Body.setAngle(
            it.body,
            (Math.random() - 0.5) * (tidy ? 0.4 : 1.4)
          );
          lib.Body.setVelocity(it.body, { x: 0, y: tidy ? 2 : 0 });
          lib.Body.setAngularVelocity(it.body, 0);
          lib.Composite.add(world, it.body);
          it.inWorld = true;
          it.drawn = false;
          it.el.classList.remove("poof");
          it.el.classList.add("in");
          wake();
          if (i === batch.length - 1) dropping--;
        }, i * (tidy ? 90 : 120))
      );
      wake();
    };

    const build = () => {
      if (!M || !engine) return;
      const lib = M;
      width = pile.clientWidth;
      height = pile.clientHeight;
      scale = Math.max(0.7, Math.min(1, width / 720));
      epoch++;
      dropping = 0;
      held = null;
      pile.classList.remove("holding");
      lib.Composite.clear(engine.world, false);
      layer.textContent = "";

      const thick = 240;
      const wall = { isStatic: true, friction: 0.9 };
      lib.Composite.add(engine.world, [
        lib.Bodies.rectangle(
          width / 2,
          height + thick / 2,
          width + 960,
          thick,
          wall
        ),
        lib.Bodies.rectangle(-thick / 2, -height, thick, height * 5, wall),
        lib.Bodies.rectangle(
          width + thick / 2,
          -height,
          thick,
          height * 5,
          wall
        ),
        lib.Bodies.rectangle(
          width / 2,
          -2.2 * height - thick / 2,
          width + 960,
          thick,
          wall
        ),
      ]);

      /* the walker is solid: things bounce off him */
      const mw = me.offsetWidth;
      lib.Composite.add(
        engine.world,
        lib.Bodies.rectangle(
          me.offsetLeft + mw / 2,
          me.offsetTop + mw * 0.56,
          mw * 0.44,
          mw * 0.88,
          {
            isStatic: true,
            restitution: 0.45,
            friction: 0.4,
            label: "me",
            chamfer: { radius: mw * 0.12 },
          }
        )
      );

      const defs =
        width < 520 ? PILE_ITEMS.filter((d) => !d.roomy) : PILE_ITEMS;

      items = defs.map((def) => {
        const w = def.w * scale;
        const h = def.h * scale;
        const options = {
          restitution: 0.2,
          friction: 0.6,
          frictionStatic: 0.9,
          frictionAir: 0.014,
          density: 0.0016,
          sleepThreshold: 45,
        };
        const body = def.r
          ? lib.Bodies.circle(0, 0, def.r * scale, options)
          : lib.Bodies.rectangle(
              0,
              0,
              (def.bodyW || def.w) * scale,
              (def.bodyH || def.h) * scale,
              { ...options, chamfer: { radius: (def.chamfer || 4) * scale } }
            );

        const el = document.createElement("div");
        el.className = "pile-item";
        el.dataset.pileItem = def.id;
        el.style.width = w + "px";
        el.style.height = h + "px";
        el.style.transformOrigin = w / 2 + "px " + h / 2 + "px";
        el.innerHTML = def.svg;
        layer.appendChild(el);

        return { def, body, el, w, h, inWorld: false, drawn: false };
      });
    };

    const tick = (now: number) => {
      frame = 0;
      if (!M || !engine || !alive) return;
      const lib = M;
      const dt = lastTime ? Math.min(50, now - lastTime) : STEP;
      lastTime = now;
      acc += dt;
      let steps = 0;
      while (acc >= STEP && steps < 4) {
        lib.Engine.update(engine, STEP);
        acc -= STEP;
        steps++;
      }
      if (steps === 4) acc = 0;

      /* anything that escapes the box falls back in from the top */
      for (const it of items) {
        if (!it.inWorld || (held && held.it === it)) continue;
        const p = it.body.position;
        if (p.x > -20 && p.x < width + 20 && p.y < height + 40) continue;
        lib.Composite.remove(engine.world, it.body);
        it.inWorld = false;
        drop([it], false);
      }

      render(false);

      const busy =
        !!held ||
        dropping > 0 ||
        items.some((it) => it.inWorld && !it.body.isSleeping);
      if (busy && (visible || held)) frame = requestAnimationFrame(tick);
      else lastTime = 0;
    };

    function wake() {
      if (!frame && engine) frame = requestAnimationFrame(tick);
    }

    const onDown = (e: PointerEvent) => {
      if (!M || !engine || held) return;
      const el = (e.target as Element).closest<HTMLDivElement>(".pile-item");
      const it = el && items.find((x) => x.el === el);
      if (!el || !it) return;
      e.preventDefault();
      el.setPointerCapture(e.pointerId);
      const p = local(e);
      const b = it.body;
      M.Sleeping.set(b, false);
      const c = M.Constraint.create({
        pointA: p,
        bodyB: b,
        pointB: { x: p.x - b.position.x, y: p.y - b.position.y },
        stiffness: 0.16,
        damping: 0.08,
        length: 0,
      });
      M.Composite.add(engine.world, c);
      held = { it, c, id: e.pointerId };
      el.classList.add("held");
      pile.classList.add("holding");
      wake();
    };

    const onMove = (e: PointerEvent) => {
      if (!held || e.pointerId !== held.id) return;
      const p = local(e);
      held.c.pointA = {
        x: Math.max(0, Math.min(width, p.x)),
        y: Math.max(-2 * height, Math.min(height, p.y)),
      };
    };

    const onUp = (e: PointerEvent) => {
      if (!M || !engine || !held || e.pointerId !== held.id) return;
      const { it, c } = held;
      M.Composite.remove(engine.world, c);
      it.el.classList.remove("held");
      pile.classList.remove("holding");
      const v = it.body.velocity;
      const speed = Math.hypot(v.x, v.y);
      if (speed > 42)
        M.Body.setVelocity(it.body, {
          x: (42 * v.x) / speed,
          y: (42 * v.y) / speed,
        });
      if (speed > 7) lastThrow = performance.now();
      held = null;
      wake();
    };

    const onCollide = (e: Matter.IEventCollision<Matter.Engine>) => {
      if (performance.now() - lastThrow > 2600) return;
      for (const pair of e.pairs) {
        const { bodyA: a, bodyB: b } = pair;
        const other = a.label === "me" ? b : b.label === "me" ? a : null;
        if (!other || other.isStatic) continue;
        const speed = Math.hypot(other.velocity.x, other.velocity.y);
        if (speed < 6) continue;
        lastThrow = -1e9;
        hop();
        say(pick(HIT));
        break;
      }
    };

    const tidy = () => {
      if (!M || !engine || held) return;
      const lib = M;
      const world = engine.world;
      const stamp = epoch;
      const sorted = items.slice().sort((a, b) => b.w * b.h - a.w * a.h);
      items.forEach((it) => it.el.classList.add("poof"));
      window.setTimeout(() => {
        if (stamp !== epoch || !alive) return;
        items.forEach((it) => {
          if (it.inWorld) lib.Composite.remove(world, it.body);
          it.inWorld = false;
          it.drawn = false;
        });
        drop(sorted, true);
        window.setTimeout(() => alive && say(pick(TIDY), 1500), 900);
      }, 260);
    };
    tidyRef.current = tidy;

    const onPoke = () => {
      hop();
      say(pick(POKE));
    };

    layer.addEventListener("pointerdown", onDown);
    layer.addEventListener("pointermove", onMove);
    layer.addEventListener("pointerup", onUp);
    layer.addEventListener("pointercancel", onUp);
    layer.addEventListener("lostpointercapture", onUp);
    me.addEventListener("click", onPoke);

    let resizeTimer = 0;
    let lastWidth = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        if (!engine || Math.abs(pile.clientWidth - lastWidth) < 2) return;
        lastWidth = pile.clientWidth;
        build();
        drop(items, true);
      }, 250);
    };
    window.addEventListener("resize", onResize);

    /* first full look at the pile lets everything fall */
    const arrive = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || !engine) return;
        arrive.disconnect();
        drop(items, false);
      },
      { threshold: 0.35 }
    );

    /* the physics library only loads once the footer is near */
    const near = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !started) {
          started = true;
          import("matter-js")
            .then((mod) => {
              if (!alive) return;
              M = (mod.default ?? mod) as typeof Matter;
              engine = M.Engine.create({
                enableSleeping: true,
                positionIterations: 8,
                velocityIterations: 6,
              });
              engine.gravity.y = 1;
              M.Events.on(engine, "collisionStart", onCollide);
              build();
              lastWidth = width;
              arrive.observe(pile);
            })
            .catch(() => {});
        } else if (visible) {
          wake();
        }
      },
      { rootMargin: "300px 0px" }
    );
    near.observe(pile);

    return () => {
      alive = false;
      if (frame) cancelAnimationFrame(frame);
      window.clearTimeout(resizeTimer);
      window.clearTimeout(sayTimer);
      window.clearTimeout(hopTimer);
      near.disconnect();
      arrive.disconnect();
      window.removeEventListener("resize", onResize);
      layer.removeEventListener("pointerdown", onDown);
      layer.removeEventListener("pointermove", onMove);
      layer.removeEventListener("pointerup", onUp);
      layer.removeEventListener("pointercancel", onUp);
      layer.removeEventListener("lostpointercapture", onUp);
      me.removeEventListener("click", onPoke);
      if (M && engine) {
        M.Events.off(engine, "collisionStart", onCollide);
        M.Composite.clear(engine.world, false);
        M.Engine.clear(engine);
      }
      layer.textContent = "";
    };
  }, []);

  return (
    <>
      <div className="pile-bar">
        <p>my &ldquo;off the clock&rdquo; pile</p>
        <p>
          <span className="pile-how">drag it, throw it, </span>
          <button
            type="button"
            className="pile-tidy"
            onClick={() => tidyRef.current()}
          >
            tidy up
          </button>
        </p>
      </div>
      <div className="pile" ref={pileRef}>
        <div
          className="pile-me rain-lift"
          ref={meRef}
          role="img"
          aria-label="the little walker from the top of the page, standing behind the pile"
        >
          <span className="sprite" />
          <span className="me-say" ref={sayRef} aria-hidden="true" />
        </div>
        <div className="pile-items" ref={itemsRef} aria-hidden="true" />
      </div>
    </>
  );
};

export default Pile;
