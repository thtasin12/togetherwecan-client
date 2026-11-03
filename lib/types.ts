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
    data: string
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