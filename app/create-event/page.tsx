"use client";

import { Protected } from "@/components/protected";
import { EventForm } from "@/components/event-form";

export default function CreateEventPage() {
  return (
    <Protected>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
            Create an Event
          </h1>
          <p className="mt-2 text-neutral-500 dark:text-neutral-400">
            Organize a community event and make an impact.
          </p>
        </div>
        <div className="mt-10">
          <EventForm />
        </div>
      </div>
    </Protected>
  );
}
