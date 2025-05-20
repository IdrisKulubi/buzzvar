"use server";

import db from "@/db/drizzle";
import { venues, venueImages, menus, offers } from "@/db/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  createVenueSchema,
  updateVenueSchema,
  createOfferSchema,
  updateOfferSchema,
  createMenuSchema,
  updateMenuSchema,
  addVenueImageSchema
} from "@/lib/validators";

/**
 * Creates a new venue in the database
 */
export async function createVenue(formData: FormData | z.infer<typeof createVenueSchema>) {
  try {
    // Parse and validate input data
    const data = formData instanceof FormData
      ? createVenueSchema.parse(Object.fromEntries(formData))
      : createVenueSchema.parse(formData);

    // Create venue
    const [venue] = await db.insert(venues).values({
      name: data.name,
      address: data.address,
      latitude: data.latitude,
      longitude: data.longitude,
      phoneNumber: data.phoneNumber,
      websiteUrl: data.websiteUrl,
      description: data.description,
      openingHours: data.openingHours,
      ownerUserId: data.ownerUserId,
    }).returning();

    revalidatePath('/venues');
    return { success: true, venue };
  } catch (error) {
    console.error("Error creating venue:", error);
    return { 
      success: false,
      error: error instanceof z.ZodError 
        ? error.errors 
        : "Failed to create venue" 
    };
  }
}

/**
 * Updates an existing venue
 */
export async function updateVenue(formData: FormData | z.infer<typeof updateVenueSchema>) {
  try {
    // Parse and validate input data
    const data = formData instanceof FormData
      ? updateVenueSchema.parse(Object.fromEntries(formData))
      : updateVenueSchema.parse(formData);

    const { id, ...venueData } = data;

    // Update venue
    const [updatedVenue] = await db.update(venues)
      .set({
        ...venueData,
        updatedAt: new Date(),
      })
      .where(eq(venues.id, id))
      .returning();

    if (!updatedVenue) {
      return { success: false, error: "Venue not found" };
    }

    revalidatePath(`/venues/${id}`);
    revalidatePath('/venues');
    return { success: true, venue: updatedVenue };
  } catch (error) {
    console.error("Error updating venue:", error);
    return { 
      success: false,
      error: error instanceof z.ZodError 
        ? error.errors 
        : "Failed to update venue" 
    };
  }
}

/**
 * Retrieves a venue by ID with all related data
 */
export async function getVenueById(id: string) {
  try {
    const currentDate = new Date().toISOString().split('T')[0]; // Format as YYYY-MM-DD
    
    const venue = await db.query.venues.findFirst({
      where: eq(venues.id, id),
      with: {
        images: true,
        menus: true,
        offers: {
          where: and(
            sql`${offers.startDate} >= ${currentDate}`,
            sql`${offers.endDate} >= ${currentDate}`,
            eq(offers.active, true)
          ),
        },
      },
    });

    return { success: true, venue };
  } catch (error) {
    console.error("Error fetching venue:", error);
    return { success: false, error: "Failed to fetch venue" };
  }
}

/**
 * Retrieves all venues with optional filtering
 */
export async function getVenues(options: { 
  limit?: number,
  page?: number,
  query?: string,
} = {}) {
  try {
    const { limit = 10, page = 1 } = options;
    const offset = (page - 1) * limit;

    // Build base query
    let baseQuery = db.select().from(venues);
    
    // Add search if provided
    if (options.query) {
      // Use a type assertion to avoid TypeScript error
      baseQuery = db.select()
        .from(venues)
        .where(sql`${venues.name} ILIKE ${`%${options.query.toLowerCase()}%`}`) as typeof baseQuery;
    }

    // Execute query with pagination
    const venueResults = await baseQuery
      .limit(limit)
      .offset(offset)
      .orderBy(desc(venues.createdAt));

    // Get total count
    const totalCountResult = await db.select({
      count: sql<number>`count(*)::int`,
    })
    .from(venues);

    const totalCount = totalCountResult[0]?.count || 0;

    return { 
      success: true, 
      venues: venueResults,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit)
      }
    };
  } catch (error) {
    console.error("Error fetching venues:", error);
    return { success: false, error: "Failed to fetch venues" };
  }
}

/**
 * Creates a new offer for a venue
 */
export async function createOffer(formData: FormData | z.infer<typeof createOfferSchema>) {
  try {
    // Parse and validate input data
    const data = formData instanceof FormData
      ? createOfferSchema.parse(Object.fromEntries(formData))
      : createOfferSchema.parse(formData);

    // Format dates for database
    const startDateStr = data.startDate.toISOString().split('T')[0];
    const endDateStr = data.endDate.toISOString().split('T')[0];

    // Create offer
    const [offer] = await db.insert(offers).values({
      venueId: data.venueId,
      title: data.title,
      description: data.description,
      startDate: startDateStr,
      endDate: endDateStr,
      active: data.active,
    }).returning();

    revalidatePath(`/venues/${data.venueId}`);
    revalidatePath('/venues');
    return { success: true, offer };
  } catch (error) {
    console.error("Error creating offer:", error);
    return { 
      success: false,
      error: error instanceof z.ZodError 
        ? error.errors 
        : "Failed to create offer" 
    };
  }
}

/**
 * Updates an existing offer
 */
export async function updateOffer(formData: FormData | z.infer<typeof updateOfferSchema>) {
  try {
    // Parse and validate input data
    const data = formData instanceof FormData
      ? updateOfferSchema.parse(Object.fromEntries(formData))
      : updateOfferSchema.parse(formData);

    const { id, ...offerData } = data;

    // Create update object with proper field names
    const updateData: Record<string, unknown> = {};
    
    if (offerData.title) updateData.title = offerData.title;
    if (offerData.description) updateData.description = offerData.description;
    if (offerData.active !== undefined) updateData.active = offerData.active;
    if (offerData.venueId) updateData.venueId = offerData.venueId;
    
    // Handle date formatting for database
    if (offerData.startDate) {
      updateData.startDate = offerData.startDate.toISOString().split('T')[0];
    }
    
    if (offerData.endDate) {
      updateData.endDate = offerData.endDate.toISOString().split('T')[0];
    }
    
    // Add updated timestamp
    updateData.updatedAt = new Date();

    // Update offer
    const [updatedOffer] = await db.update(offers)
      .set(updateData)
      .where(eq(offers.id, id))
      .returning();

    if (!updatedOffer) {
      return { success: false, error: "Offer not found" };
    }

    revalidatePath(`/venues/${updatedOffer.venueId}`);
    return { success: true, offer: updatedOffer };
  } catch (error) {
    console.error("Error updating offer:", error);
    return { 
      success: false,
      error: error instanceof z.ZodError 
        ? error.errors 
        : "Failed to update offer" 
    };
  }
}

/**
 * Adds a new image to a venue
 */
export async function addVenueImage(formData: FormData | z.infer<typeof addVenueImageSchema>) {
  try {
    // Parse and validate input data
    const data = formData instanceof FormData
      ? addVenueImageSchema.parse(Object.fromEntries(formData))
      : addVenueImageSchema.parse(formData);

    // Add image
    const [image] = await db.insert(venueImages).values({
      venueId: data.venueId,
      imageUrl: data.imageUrl,
      altText: data.altText,
    }).returning();

    revalidatePath(`/venues/${data.venueId}`);
    return { success: true, image };
  } catch (error) {
    console.error("Error adding venue image:", error);
    return { 
      success: false,
      error: error instanceof z.ZodError 
        ? error.errors 
        : "Failed to add venue image" 
    };
  }
}

/**
 * Deletes a venue image
 */
export async function deleteVenueImage(id: string) {
  try {
    const [image] = await db.delete(venueImages)
      .where(eq(venueImages.id, id))
      .returning();

    if (!image) {
      return { success: false, error: "Image not found" };
    }

    revalidatePath(`/venues/${image.venueId}`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting venue image:", error);
    return { success: false, error: "Failed to delete venue image" };
  }
}

/**
 * Creates a new menu for a venue
 */
export async function createMenu(formData: FormData | z.infer<typeof createMenuSchema>) {
  try {
    // Parse and validate input data
    const data = formData instanceof FormData
      ? createMenuSchema.parse(Object.fromEntries(formData))
      : createMenuSchema.parse(formData);

    // Create menu
    const [menu] = await db.insert(menus).values({
      venueId: data.venueId,
      type: data.type,
      content: data.content,
      contentText: data.contentText,
      imageUrl: data.imageUrl,
    }).returning();

    revalidatePath(`/venues/${data.venueId}`);
    return { success: true, menu };
  } catch (error) {
    console.error("Error creating menu:", error);
    return { 
      success: false,
      error: error instanceof z.ZodError 
        ? error.errors 
        : "Failed to create menu" 
    };
  }
}

/**
 * Updates an existing menu
 */
export async function updateMenu(formData: FormData | z.infer<typeof updateMenuSchema>) {
  try {
    // Parse and validate input data
    const data = formData instanceof FormData
      ? updateMenuSchema.parse(Object.fromEntries(formData))
      : updateMenuSchema.parse(formData);

    const { id, ...menuData } = data;

    // Create update object with proper field names
    const updateData: Record<string, unknown> = {};
    
    if (menuData.type) updateData.type = menuData.type;
    if (menuData.content) updateData.content = menuData.content;
    if (menuData.contentText) updateData.contentText = menuData.contentText;
    if (menuData.imageUrl) updateData.imageUrl = menuData.imageUrl;
    if (menuData.venueId) updateData.venueId = menuData.venueId;
    
    // Add updated timestamp
    updateData.updatedAt = new Date();

    // Update menu
    const [updatedMenu] = await db.update(menus)
      .set(updateData)
      .where(eq(menus.id, id))
      .returning();

    if (!updatedMenu) {
      return { success: false, error: "Menu not found" };
    }

    revalidatePath(`/venues/${updatedMenu.venueId}`);
    return { success: true, menu: updatedMenu };
  } catch (error) {
    console.error("Error updating menu:", error);
    return { 
      success: false,
      error: error instanceof z.ZodError 
        ? error.errors 
        : "Failed to update menu" 
    };
  }
} 