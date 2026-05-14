export interface PipelineStats {
  totalRequirements: number;
  publishedRequirements: number;
  closedRequirements: number;
  totalMatches: number;
  matched: number;
  scheduled: number;
  hired: number;
  rejected: number;
  totalSessions: number;
  completedSessions: number;
  pendingSessions: number;
  averageRating: number | null;
}

export interface MatchRow {
  matchId: string;
  requirementId?: string;
  requirementTitle?: string;
  requirementSubject?: string;
  requirementArea?: string;
  requirementStatus?: string;
  tutorId: string;
  tutorName: string;
  tutorEmail: string;
  tutorPhone: string;
  subjects: string[];
  areas: string[];
  matchScore: number | null;
  status: string;
  tutorNotes: string | null;
  parentNotes: string | null;
  sessionCount: number;
  lastSessionDate: string | null;
  scheduledAt: string | null;
  createdAt: string;
}

export interface PaymentRow {
  id: string;
  tutorId: string;
  email: string | null;
  amount: number;
  currency: string;
  status: string;
  provider: string | null;
  providerPaymentId: string | null;
  stripePaymentIntentId: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string | null;
  updatedAt: string | null;
  userEmail: string | null;
  userFullName: string | null;
}

export interface SubscriberRow {
  id: string;
  email: string;
  createdAt: string | null;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
}

export interface TimelineEvent {
  sessionId: string;
  sessionType: string;
  scheduledAt: string;
  status: string;
  feedback: string | null;
  rating: number | null;
  outcome: string | null;
  locationUrl: string | null;
  meetingLink: string | null;
  createdAt: string;
}
