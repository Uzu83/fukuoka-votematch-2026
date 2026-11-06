"use client";

import { useEffect, useRef, useState } from "react";

export function ShareButton() {
  const [message, setMessage] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  async function share() {
    const url = window.location.origin + "/";
    try {
      if (navigator.share) {
        await navigator.share({
          title: "ふくおか・みらいマッチ｜2026年福岡市長選挙",
          url,
        });
        setMessage("共有しました");
      } else {
        await navigator.clipboard.writeText(url);
        setMessage("サイトのURLをコピーしました");
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setMessage("URL: " + url);
    }
    timer.current = setTimeout(() => setMessage(""), 5000);
  }

  return (
    <div>
      <button type="button" className="secondary-button" onClick={share}>
        このサイトを共有 <span aria-hidden="true">↗</span>
      </button>
      <p className="mt-2 text-sm text-[#4c6067]">
        回答や候補者名は共有しません。サイトのURLだけです。
      </p>
      <p role="status" className="text-sm font-bold">{message}</p>
    </div>
  );
}
