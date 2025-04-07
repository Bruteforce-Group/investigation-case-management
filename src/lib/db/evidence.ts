import { Evidence, EvidenceType, Prisma } from '@prisma/client';
import prisma from './prisma';

export type EvidenceWithRelations = Prisma.EvidenceGetPayload<{
  include: {
    case: true;
    uploadedBy: true;
    modifiedBy: true;
    tags: true;
    timelineEvents: true;
    persons: true;
    locations: true;
    comments: true;
  }
}>;

export async function getAllEvidence(): Promise<Evidence[]> {
  return prisma.evidence.findMany({
    orderBy: { updatedAt: 'desc' }
  });
}

export async function getEvidenceById(id: string): Promise<EvidenceWithRelations | null> {
  return prisma.evidence.findUnique({
    where: { id },
    include: {
      case: true,
      uploadedBy: true,
      modifiedBy: true,
      tags: true,
      timelineEvents: {
        include: {
          timelineEvent: true
        }
      },
      persons: {
        include: {
          person: true
        }
      },
      locations: {
        include: {
          location: true
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

export async function getEvidenceByCaseId(caseId: string): Promise<Evidence[]> {
  return prisma.evidence.findMany({
    where: { caseId },
    orderBy: { updatedAt: 'desc' },
    include: {
      tags: true,
      uploadedBy: true
    }
  });
}

export async function createEvidence(data: Prisma.EvidenceCreateInput): Promise<Evidence> {
  return prisma.evidence.create({
    data
  });
}

export async function updateEvidence(id: string, data: Prisma.EvidenceUpdateInput): Promise<Evidence> {
  return prisma.evidence.update({
    where: { id },
    data
  });
}

export async function deleteEvidence(id: string): Promise<Evidence> {
  return prisma.evidence.delete({
    where: { id }
  });
}

export async function getEvidenceByType(caseId: string, evidenceType: EvidenceType): Promise<Evidence[]> {
  return prisma.evidence.findMany({
    where: { 
      caseId,
      evidenceType 
    },
    orderBy: { updatedAt: 'desc' },
    include: {
      tags: true
    }
  });
}

export async function searchEvidence(query: string): Promise<Evidence[]> {
  return prisma.evidence.findMany({
    where: {
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { ocrText: { contains: query, mode: 'insensitive' } },
        { transcription: { contains: query, mode: 'insensitive' } }
      ]
    },
    orderBy: { updatedAt: 'desc' },
    include: {
      case: true,
      tags: true
    }
  });
}

export async function addEvidenceTag(evidenceId: string, name: string, color?: string): Promise<Evidence> {
  return prisma.evidence.update({
    where: { id: evidenceId },
    data: {
      tags: {
        create: {
          name,
          color
        }
      }
    }
  });
}

export async function removeEvidenceTag(tagId: string): Promise<void> {
  await prisma.evidenceTag.delete({
    where: { id: tagId }
  });
}

export async function linkEvidenceToPerson(evidenceId: string, personId: string, relationship?: string): Promise<void> {
  await prisma.evidencePerson.create({
    data: {
      evidenceId,
      personId,
      relationship
    }
  });
}

export async function linkEvidenceToLocation(evidenceId: string, locationId: string, relationship?: string): Promise<void> {
  await prisma.evidenceLocation.create({
    data: {
      evidenceId,
      locationId,
      relationship
    }
  });
}

export async function linkEvidenceToTimelineEvent(evidenceId: string, timelineEventId: string, relationship?: string): Promise<void> {
  await prisma.timelineEvidence.create({
    data: {
      evidenceId,
      timelineEventId,
      relationship
    }
  });
}
