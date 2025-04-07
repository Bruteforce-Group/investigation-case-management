import { User, UserRole, Prisma } from '@prisma/client';
import prisma from './prisma';

export type UserWithRelations = Prisma.UserGetPayload<{
  include: {
    cases: {
      include: {
        case: true;
      }
    };
    evidenceUploaded: true;
    evidenceModified: true;
    timelineEvents: true;
    comments: true;
    activities: true;
  }
}>;

export async function getAllUsers(): Promise<User[]> {
  return prisma.user.findMany({
    orderBy: { name: 'asc' }
  });
}

export async function getUserById(id: string): Promise<UserWithRelations | null> {
  return prisma.user.findUnique({
    where: { id },
    include: {
      cases: {
        include: {
          case: true
        }
      },
      evidenceUploaded: true,
      evidenceModified: true,
      timelineEvents: true,
      comments: true,
      activities: {
        orderBy: {
          createdAt: 'desc'
        },
        take: 50
      }
    }
  });
}

export async function getUserByEmail(email: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: { email }
  });
}

export async function createUser(data: Prisma.UserCreateInput): Promise<User> {
  return prisma.user.create({
    data
  });
}

export async function updateUser(id: string, data: Prisma.UserUpdateInput): Promise<User> {
  return prisma.user.update({
    where: { id },
    data
  });
}

export async function deleteUser(id: string): Promise<User> {
  return prisma.user.delete({
    where: { id }
  });
}

export async function getUsersByRole(role: UserRole): Promise<User[]> {
  return prisma.user.findMany({
    where: { role },
    orderBy: { name: 'asc' }
  });
}

export async function assignUserToCase(userId: string, caseId: string, role: string): Promise<void> {
  await prisma.caseAssignment.create({
    data: {
      userId,
      caseId,
      role
    }
  });
}

export async function removeUserFromCase(userId: string, caseId: string): Promise<void> {
  await prisma.caseAssignment.deleteMany({
    where: {
      userId,
      caseId
    }
  });
}

export async function getUserCases(userId: string): Promise<any[]> {
  return prisma.caseAssignment.findMany({
    where: { userId },
    include: {
      case: true
    },
    orderBy: {
      case: {
        updatedAt: 'desc'
      }
    }
  });
}

export async function logUserActivity(
  userId: string,
  action: string,
  details?: string,
  caseId?: string,
  evidenceId?: string,
  personId?: string,
  locationId?: string,
  timelineEventId?: string,
  storylineAnalysisId?: string
): Promise<void> {
  await prisma.activityLog.create({
    data: {
      userId,
      action,
      details,
      caseId,
      evidenceId,
      personId,
      locationId,
      timelineEventId,
      storylineAnalysisId
    }
  });
}
