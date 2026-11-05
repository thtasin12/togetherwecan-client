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
  | "Healthcare"
  | "Other"

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

export interface EventComment {
  _id: string;
  eventId: string;
  userEmail: string;
  authorName: string;
  authorPhoto?: string;
  body: string;
  createdAt: string;
}

export interface Badge {
  id: string;
  label: string;
  description: string;
  earned: boolean;
}

export interface UserStats {
  joined: number;
  hosted: number;
  volunteersReached: number;
  saved: number;
  comments: number;
  waitlisted: number;
  badges: Badge[];
}

export interface Promotion {
  event: CommunityEvent;
  promotedAt: string;
}
