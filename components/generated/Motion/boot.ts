/**
 * Runs in <head> before first paint.
 *
 * - `js` gates the hidden state of `.reveal`; if the motion code never
 *   starts, it is taken off again so nothing stays invisible.
 * - `intro` puts the paper cover up for the first home visit of a session,
 *   with its own failsafe.
 */
export const BOOT_SCRIPT = `(function(){var t=document.documentElement;t.classList.add("js");setTimeout(function(){window.__motion||t.classList.remove("js")},3000);try{if(location.pathname==="/"&&(/[?&]intro\\b/.test(location.search)||(!sessionStorage.getItem("intro")&&!location.hash))){t.classList.add("intro");setTimeout(function(){if(!window.__introStarted&&t.classList.contains("intro")){t.classList.remove("intro");document.dispatchEvent(new Event("introdone"))}},4000)}}catch(e){}})()`;

declare global {
  interface Window {
    __motion?: boolean;
    __introStarted?: boolean;
  }
}
