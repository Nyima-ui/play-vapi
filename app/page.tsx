"use client";
import UploadForm from "@/components/UploadForm";
import { start, stop } from "../lib/vapi";

export default function Home() {
  return (
    <div>
      <button
        className="cursor-pointer border rounded-md m-5 px-5 py-2.5"
        onClick={start}
      >
        Speak
      </button>
      <button
        className="cursor-pointer border rounded-md m-5 px-5 py-2.5"
        onClick={stop}
      >
        Stop
      </button>

      <UploadForm />
    </div>
  );
}
