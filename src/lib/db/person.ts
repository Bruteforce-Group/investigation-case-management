import { Person, Prisma } from '@prisma/client';
import prisma from './prisma';

export type PersonWithRelations = Prisma.PersonGetPayload<{
  include: {
    case: true;
    evidence: {
      include: {
        evidence: true;
      }
    };
    timelineEvents: {
      include: {
        timelineEvent: true;
      }
    };
    relationships: {
      include: {
        personB: true;
      }
    };
    relatedTo: {
      include: {
        personA: true;
      }
    };
    comments: true;
  }
}>;

export async function getAllPersons(caseId: string): Promise<Person[]> {
  return prisma.person.findMany({
    where: { caseId },
    orderBy: { lastName: 'asc' }
  });
}

export async function getPersonById(id: string): Promise<PersonWithRelations | null> {
  return prisma.person.findUnique({
    where: { id },
    include: {
      case: true,
      evidence: {
        include: {
          evidence: true
        }
      },
      timelineEvents: {
        include: {
          timelineEvent: true
        }
      },
      relationships: {
        include: {
          personB: true
        }
      },
      relatedTo: {
        include: {
          personA: true
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

export async function createPerson(data: Prisma.PersonCreateInput): Promise<Person> {
  return prisma.person.create({
    data
  });
}

export async function updatePerson(id: string, data: Prisma.PersonUpdateInput): Promise<Person> {
  return prisma.person.update({
    where: { id },
    data
  });
}

export async function deletePerson(id: string): Promise<Person> {
  return prisma.person.delete({
    where: { id }
  });
}

export async function searchPersons(query: string): Promise<Person[]> {
  return prisma.person.findMany({
    where: {
      OR: [
        { firstName: { contains: query, mode: 'insensitive' } },
        { lastName: { contains: query, mode: 'insensitive' } },
        { alias: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { role: { contains: query, mode: 'insensitive' } }
      ]
    },
    orderBy: { lastName: 'asc' },
    include: {
      case: true
    }
  });
}

export async function createRelationship(
  personAId: string,
  personBId: string,
  type: string,
  description?: string
): Promise<void> {
  await prisma.relationship.create({
    data: {
      personAId,
      personBId,
      type,
      description
    }
  });
}

export async function getPersonRelationships(personId: string): Promise<any[]> {
  const asPersonA = await prisma.relationship.findMany({
    where: { personAId: personId },
    include: {
      personB: true
    }
  });

  const asPersonB = await prisma.relationship.findMany({
    where: { personBId: personId },
    include: {
      personA: true
    }
  });

  return [
    ...asPersonA.map(r => ({
      id: r.id,
      person: r.personB,
      type: r.type,
      description: r.description,
      direction: 'outgoing'
    })),
    ...asPersonB.map(r => ({
      id: r.id,
      person: r.personA,
      type: r.type,
      description: r.description,
      direction: 'incoming'
    }))
  ];
}

export async function getPersonEvidence(personId: string): Promise<any[]> {
  return prisma.evidencePerson.findMany({
    where: { personId },
    include: {
      evidence: true
    }
  });
}

export async function getPersonTimelineEvents(personId: string): Promise<any[]> {
  return prisma.timelinePerson.findMany({
    where: { personId },
    include: {
      timelineEvent: true
    },
    orderBy: {
      timelineEvent: {
        eventDate: 'asc'
      }
    }
  });
}
