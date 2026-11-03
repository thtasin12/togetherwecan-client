export type User = {
    _id: string
    name: string
    email: string
    photoURL: string

}

export type EventType =
  | "Cleanup"
  | "Plantation"
  | "Donation"
  | "Education"
  | "Health"
  | "Others"

export type CommunityEvent = {
    _id: string
    title: string
    description: string
    eventType: EventType
    thumbnail: string
    location: string
    date: string
    capacity?: number | null
    spotsLeft?: number | null
    isFull?: boolean
    createdBy: {name: string; email: string}
    joinedCount?: number
    joined?: boolean
    saved?: boolean
    waitlisted?: boolean
    waitlistCount?: number
    createdAt?: string
}

export type Attendee = {
  email: string;
  name: string;
  photoURL: string;
  joinedAt?: string | null;
};

export const EVENT_TYPES = [
  "Cleanup",
  "Plantation",
  "Donation",
  "Education",
  "Healthcare",
  "Other",
] as const;
export type PublicStats = {
  events: number;
  volunteers: number;
  communities: number;
  joins: number;
};
