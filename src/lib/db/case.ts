import { Case, CaseStatus, CasePriority, Prisma } from '@prisma/client';
import prisma from './prisma';

export type CaseWithRelations = Prisma.CaseGetPayload<{
  include: {
    assignments: true;
    tags: true;
    evidence: true;
    persons: true;
    locations: true;
    timelineEvents: true;
    storylineAnalyses: true;
  }
}>;

export async function getAllCases(): Promise<Case[]> {
  return prisma.case.findMany({
    orderBy: { updatedAt: 'desc' }
  });
}

export async function getCaseById(id: string): Promise<CaseWithRelations | null> {
  return prisma.case.findUnique({
    where: { id },
    include: {
      assignments: {
        include: {
          user: true
        }
      },
      tags: true,
      evidence: true,
      persons: true,
      locations: true,
      timelineEvents: {
        orderBy: {
          eventDate: 'asc'
        }
      },
      storylineAnalyses: {
        orderBy: {
          updatedAt: 'desc'
        }
      }
    }
  });
}

export async function createCase(data: Prisma.CaseCreateInput): Promise<Case> {
  return prisma.case.create({
    data
  });
}

export async function updateCase(id: string, data: Prisma.CaseUpdateInput): Promise<Case> {
  return prisma.case.update({
    where: { id },
    data
  });
}

export async function deleteCase(id: string): Promise<Case> {
  return prisma.case.delete({
    where: { id }
  });
}

export async function getCasesByStatus(status: CaseStatus): Promise<Case[]> {
  return prisma.case.findMany({
    where: { status },
    orderBy: { updatedAt: 'desc' }
  });
}

export async function getCasesByPriority(priority: CasePriority): Promise<Case[]> {
  return prisma.case.findMany({
    where: { priority },
    orderBy: { updatedAt: 'desc' }
  });
}

export async function searchCases(query: string): Promise<Case[]> {
  return prisma.case.findMany({
    where: {
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { caseNumber: { contains: query, mode: 'insensitive' } }
      ]
    },
    orderBy: { updatedAt: 'desc' }
  });
}

export async function getCasesByUserId(userId: string): Promise<Case[]> {
  return prisma.case.findMany({
    where: {
      assignments: {
        some: {
          userId
        }
      }
    },
    orderBy: { updatedAt: 'desc' }
  });
}
