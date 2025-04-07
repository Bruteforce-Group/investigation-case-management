import { Location, Prisma } from '@prisma/client';
import prisma from './prisma';

export type LocationWithRelations = Prisma.LocationGetPayload<{
  include: {
    case: true;
    evidence: {
      include: {
        evidence: true;
      }
    };
    comments: true;
  }
}>;

export async function getAllLocations(caseId: string): Promise<Location[]> {
  return prisma.location.findMany({
    where: { caseId },
    orderBy: { name: 'asc' }
  });
}

export async function getLocationById(id: string): Promise<LocationWithRelations | null> {
  return prisma.location.findUnique({
    where: { id },
    include: {
      case: true,
      evidence: {
        include: {
          evidence: true
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

export async function createLocation(data: Prisma.LocationCreateInput): Promise<Location> {
  return prisma.location.create({
    data
  });
}

export async function updateLocation(id: string, data: Prisma.LocationUpdateInput): Promise<Location> {
  return prisma.location.update({
    where: { id },
    data
  });
}

export async function deleteLocation(id: string): Promise<Location> {
  return prisma.location.delete({
    where: { id }
  });
}

export async function searchLocations(query: string): Promise<Location[]> {
  return prisma.location.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { address: { contains: query, mode: 'insensitive' } },
        { city: { contains: query, mode: 'insensitive' } },
        { state: { contains: query, mode: 'insensitive' } },
        { country: { contains: query, mode: 'insensitive' } },
        { postalCode: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } }
      ]
    },
    orderBy: { name: 'asc' },
    include: {
      case: true
    }
  });
}

export async function getLocationEvidence(locationId: string): Promise<any[]> {
  return prisma.evidenceLocation.findMany({
    where: { locationId },
    include: {
      evidence: true
    }
  });
}
