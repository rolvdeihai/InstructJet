// src/components/SiteTranslator.tsx
//
// Translates the whole site in the browser with Google's free website
// translator when the user picked a language other than English. Loaded only
// when needed; the URL in the address bar never changes.

'use client';

import { useEffect } from 'react';
import { DEFAULT_LANGUAGE, getCurrentLanguage, syncTranslatorCookie } from '@/lib/language';

declare global {
  interface Window {
    google?: any;
    googleTranslateElementInit?: () => void;
  }
}

// Google Translate swaps text nodes for <font> wrappers behind React's back,
// which makes React throw when it later removes or inserts next to those
// nodes. Make those two DOM calls tolerant of that (facebook/react#11538).
function patchDomForTranslation() {
  const proto = Node.prototype as any;
  if (proto.__ijTranslatePatched) return;
  proto.__ijTranslatePatched = true;

  const removeChild = proto.removeChild;
  proto.removeChild = function <T extends Node>(child: T): T {
    if (child.parentNode !== this) {
      return child;
    }
    return removeChild.call(this, child);
  };

  const insertBefore = proto.insertBefore;
  proto.insertBefore = function <T extends Node>(newNode: T, referenceNode: Node | null): T {
    if (referenceNode && referenceNode.parentNode !== this) {
      return insertBefore.call(this, newNode, null);
    }
    return insertBefore.call(this, newNode, referenceNode);
  };
}

export default function SiteTranslator() {
  useEffect(() => {
    syncTranslatorCookie();
    const lang = getCurrentLanguage();
    if (lang === DEFAULT_LANGUAGE) return;

    patchDomForTranslation();
    document.documentElement.lang = lang;

    if (document.getElementById('google-translate-script')) return;
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        { pageLanguage: DEFAULT_LANGUAGE, autoDisplay: false },
        'google_translate_element'
      );
    };
    const script = document.createElement('script');
    script.id = 'google-translate-script';
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <>
      <div id="google_translate_element" className="hidden" aria-hidden />
      <style>{`
        .goog-te-banner-frame, iframe.skiptranslate, .goog-te-gadget, #goog-gt-tt,
        .goog-te-balloon-frame, .VIpgJd-ZVi9od-ORHb-OEVmcd { display: none !important; }
        body { top: 0 !important; }
        .goog-text-highlight { background: none !important; box-shadow: none !important; }
      `}</style>
    </>
  );
}
