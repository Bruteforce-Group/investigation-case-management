import { StorylineAnalysis, Prisma } from '@prisma/client';
import prisma from './prisma';

export type StorylineAnalysisWithRelations = Prisma.StorylineAnalysisGetPayload<{
  include: {
    case: true;
    comments: {
      include: {
        author: true;
      }
    };
  }
}>;

export async function getAllStorylineAnalyses(caseId: string): Promise<StorylineAnalysis[]> {
  return prisma.storylineAnalysis.findMany({
    where: { caseId },
    orderBy: { updatedAt: 'desc' }
  });
}

export async function getStorylineAnalysisById(id: string): Promise<StorylineAnalysisWithRelations | null> {
  return prisma.storylineAnalysis.findUnique({
    where: { id },
    include: {
      case: true,
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

export async function createStorylineAnalysis(data: Prisma.StorylineAnalysisCreateInput): Promise<StorylineAnalysis> {
  return prisma.storylineAnalysis.create({
    data
  });
}

export async function updateStorylineAnalysis(id: string, data: Prisma.StorylineAnalysisUpdateInput): Promise<StorylineAnalysis> {
  return prisma.storylineAnalysis.update({
    where: { id },
    data
  });
}

export async function deleteStorylineAnalysis(id: string): Promise<StorylineAnalysis> {
  return prisma.storylineAnalysis.delete({
    where: { id }
  });
}

export async function getLatestStorylineAnalysis(caseId: string): Promise<StorylineAnalysis | null> {
  return prisma.storylineAnalysis.findFirst({
    where: { caseId },
    orderBy: { updatedAt: 'desc' }
  });
}

export async function searchStorylineAnalyses(query: string): Promise<StorylineAnalysis[]> {
  return prisma.storylineAnalysis.findMany({
    where: {
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { content: { contains: query, mode: 'insensitive' } }
      ]
    },
    orderBy: { updatedAt: 'desc' },
    include: {
      case: true
    }
  });
}
