import { TimelineEvent, Prisma } from '@prisma/client';
import prisma from './prisma';

export type TimelineEventWithRelations = Prisma.TimelineEventGetPayload<{
  include: {
    case: true;
    createdBy: true;
    evidence: {
      include: {
        evidence: true;
      }
    };
    persons: {
      include: {
        person: true;
      }
    };
    comments: true;
  }
}>;

export async function getAllTimelineEvents(caseId: string): Promise<TimelineEvent[]> {
  return prisma.timelineEvent.findMany({
    where: { caseId },
    orderBy: { eventDate: 'asc' }
  });
}

export async function getTimelineEventById(id: string): Promise<TimelineEventWithRelations | null> {
  return prisma.timelineEvent.findUnique({
    where: { id },
    include: {
      case: true,
      createdBy: true,
      evidence: {
        include: {
          evidence: true
        }
      },
      persons: {
        include: {
          person: true
        }
      },
      comments: {
        include: {
          author: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  });
}

export async function createTimelineEvent(data: Prisma.TimelineEventCreateInput): Promise<TimelineEvent> {
  return prisma.timelineEvent.create({
    data
  });
}

export async function updateTimelineEvent(id: string, data: Prisma.TimelineEventUpdateInput): Promise<TimelineEvent> {
  return prisma.timelineEvent.update({
    where: { id },
    data
  });
}

export async function deleteTimelineEvent(id: string): Promise<TimelineEvent> {
  return prisma.timelineEvent.delete({
    where: { id }
  });
}

export async function getTimelineEventsByDateRange(
  caseId: string, 
  startDate: Date, 
  endDate: Date
): Promise<TimelineEvent[]> {
  return prisma.timelineEvent.findMany({
    where: {
      caseId,
      eventDate: {
        gte: startDate,
        lte: endDate
      }
    },
    orderBy: { eventDate: 'asc' },
    include: {
      evidence: {
        include: {
          evidence: true
        }
      },
      persons: {
        include: {
          person: true
        }
      }
    }
  });
}

export async function getTimelineEventsByImportance(
  caseId: string,
  minImportance: number
): Promise<TimelineEvent[]> {
  return prisma.timelineEvent.findMany({
    where: {
      caseId,
      importance: {
        gte: minImportance
      }
    },
    orderBy: { eventDate: 'asc' },
    include: {
      evidence: {
        include: {
          evidence: true
        }
      },
      persons: {
        include: {
          person: true
        }
      }
    }
  });
}

export async function searchTimelineEvents(query: string): Promise<TimelineEvent[]> {
  return prisma.timelineEvent.findMany({
    where: {
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { location: { contains: query, mode: 'insensitive' } }
      ]
    },
    orderBy: { eventDate: 'asc' },
    include: {
      case: true,
      evidence: {
        include: {
          evidence: true
        }
      }
    }
  });
}

export async function linkTimelineEventToPerson(
  timelineEventId: string, 
  personId: string, 
  involvement?: string
): Promise<void> {
  await prisma.timelinePerson.create({
    data: {
      timelineEventId,
      personId,
      involvement
    }
  });
}

export async function linkTimelineEventToEvidence(
  timelineEventId: string, 
  evidenceId: string, 
  relationship?: string
): Promise<void> {
  await prisma.timelineEvidence.create({
    data: {
      timelineEventId,
      evidenceId,
      relationship
    }
  });
}
