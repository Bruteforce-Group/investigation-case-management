'use client';

import React from 'react';
import { z } from 'zod';

// Form input validation schemas
export const emailSchema = z
  .string()
  .min(1, { message: 'Email is required' })
  .email({ message: 'Invalid email address' });

export const passwordSchema = z
  .string()
  .min(8, { message: 'Password must be at least 8 characters' })
  .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
  .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
  .regex(/[0-9]/, { message: 'Password must contain at least one number' })
  .regex(/[^A-Za-z0-9]/, { message: 'Password must contain at least one special character' });

// Case validation schema
export const caseSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }).max(100, { message: 'Title cannot exceed 100 characters' }),
  description: z.string().optional(),
  status: z.enum(['OPEN', 'CLOSED', 'PENDING', 'ARCHIVED']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  startDate: z.string().min(1, { message: 'Start date is required' }),
  endDate: z.string().optional(),
});

// Evidence validation schema
export const evidenceSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }).max(100, { message: 'Title cannot exceed 100 characters' }),
  description: z.string().optional(),
  evidenceType: z.enum(['DOCUMENT', 'IMAGE', 'AUDIO', 'VIDEO', 'PHYSICAL', 'OTHER']),
  collectionDate: z.string().optional(),
  collectionLocation: z.string().optional(),
  caseId: z.string().min(1, { message: 'Case ID is required' }),
});

// Timeline event validation schema
export const timelineEventSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }).max(100, { message: 'Title cannot exceed 100 characters' }),
  description: z.string().optional(),
  eventDate: z.string().min(1, { message: 'Event date is required' }),
  endDate: z.string().optional(),
  location: z.string().optional(),
  importance: z.number().min(1).max(5),
  confidenceLevel: z.number().min(1).max(5),
  caseId: z.string().min(1, { message: 'Case ID is required' }),
});

// Person validation schema
export const personSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  alias: z.string().optional(),
  description: z.string().optional(),
  role: z.string().optional(),
  caseId: z.string().min(1, { message: 'Case ID is required' }),
});

// Location validation schema
export const locationSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  postalCode: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  description: z.string().optional(),
  caseId: z.string().min(1, { message: 'Case ID is required' }),
});

// User validation schema
export const userSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  email: emailSchema,
  password: passwordSchema,
  role: z.enum(['ADMIN', 'INVESTIGATOR', 'ANALYST', 'VIEWER']),
});

// API error response schema
export const apiErrorSchema = z.object({
  message: z.string(),
  code: z.string().optional(),
  details: z.array(z.string()).optional(),
});

// Helper function to validate API responses
export const validateApiResponse = <T extends z.ZodType>(schema: T, data: unknown): z.infer<T> => {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('API response validation error:', error.errors);
      throw new Error('Invalid API response format');
    }
    throw error;
  }
};

export default {
  emailSchema,
  passwordSchema,
  caseSchema,
  evidenceSchema,
  timelineEventSchema,
  personSchema,
  locationSchema,
  userSchema,
  apiErrorSchema,
  validateApiResponse,
};
