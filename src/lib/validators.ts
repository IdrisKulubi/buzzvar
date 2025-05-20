import { z } from "zod";

// Validation schemas
export const createPartyGroupSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    creatorId: z.string(),
    venueId: z.string().uuid().optional(),
    eventDate: z.coerce.date(),
    eventTime: z.string(),
    maxMembers: z.coerce.number().min(2, "Must allow at least 2 members"),
    isPublic: z.boolean().default(true),
  });
  
export const updatePartyGroupSchema = createPartyGroupSchema.partial().extend({
    id: z.string().uuid(),
    status: z.enum(["open", "closed", "cancelled"]).optional(),
  });
  
export const joinGroupRequestSchema = z.object({
    groupId: z.string().uuid(),
    userId: z.string(),
  });
  
export const updateGroupMemberStatusSchema = z.object({
    groupId: z.string().uuid(),
    userId: z.string(),
    status: z.enum(["pending", "approved", "declined"]),
  });
  
export const sendGroupMessageSchema = z.object({
    groupId: z.string().uuid(),
    senderId: z.string(),
    messageContent: z.string().min(1, "Message cannot be empty"),
  });

  // Validation schemas (inlined since validator files were deleted)
export const createVenueSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    address: z.string().min(5, "Address must be at least 5 characters"),
    latitude: z.string(),
    longitude: z.string(),
    phoneNumber: z.string().optional(),
    websiteUrl: z.string().url().optional().or(z.literal("")),
    description: z.string().optional(),
    openingHours: z.record(z.string(), z.string()).optional(),
    ownerUserId: z.string(),
  });
  
  export const updateVenueSchema = createVenueSchema.partial().extend({
    id: z.string().uuid(),
  });
  
 export const createOfferSchema = z.object({
    venueId: z.string().uuid(),
    title: z.string().min(2, "Title must be at least 2 characters"),
    description: z.string().min(5, "Description must be at least 5 characters"),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    active: z.boolean().default(true),
  });
  
  export const updateOfferSchema = createOfferSchema.partial().extend({
    id: z.string().uuid(),
  });
  
  export const createMenuSchema = z.object({
    venueId: z.string().uuid(),
    type: z.enum(["food", "drinks"]),
    content: z.record(z.string(), z.any()).optional(),
    contentText: z.string().optional(),
    imageUrl: z.string().url().optional(),
  });
  
  export const updateMenuSchema = createMenuSchema.partial().extend({
    id: z.string().uuid(),
  });
  
  export const addVenueImageSchema = z.object({
    venueId: z.string().uuid(),
    imageUrl: z.string().url(),
    altText: z.string().optional(),
  });