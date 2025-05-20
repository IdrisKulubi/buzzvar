"use server";

import db from "@/db/drizzle";
import { partyGroups, groupMembers, groupMessages, users, venues } from "@/db/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createPartyGroupSchema, joinGroupRequestSchema, sendGroupMessageSchema, updateGroupMemberStatusSchema, updatePartyGroupSchema } from "../validators";



/**
 * Creates a new party group
 */
export async function createPartyGroup(formData: FormData | z.infer<typeof createPartyGroupSchema>) {
  try {
    // Parse and validate input data
    const data = formData instanceof FormData
      ? createPartyGroupSchema.parse(Object.fromEntries(formData))
      : createPartyGroupSchema.parse(formData);

    // Create party group
    const [group] = await db.insert(partyGroups).values({
      name: data.name,
      creatorId: data.creatorId,
      venueId: data.venueId,
      eventDate: data.eventDate.toISOString().split('T')[0], 
      eventTime: data.eventTime,
      maxMembers: data.maxMembers,
      isPublic: data.isPublic,
    }).returning();

    // Automatically add creator as an approved member
    await db.insert(groupMembers).values({
      groupId: group.id,
      userId: data.creatorId,
      status: "approved",
    });

    revalidatePath('/groups');
    return { success: true, group };
  } catch (error) {
    console.error("Error creating party group:", error);
    return { 
      success: false,
      error: error instanceof z.ZodError 
        ? error.errors 
        : "Failed to create party group" 
    };
  }
}

/**
 * Updates an existing party group
 */
export async function updatePartyGroup(formData: FormData | z.infer<typeof updatePartyGroupSchema>) {
  try {
    // Parse and validate input data
    const data = formData instanceof FormData
      ? updatePartyGroupSchema.parse(Object.fromEntries(formData))
      : updatePartyGroupSchema.parse(formData);

    const { id, eventDate, ...restGroupData } = data;

    // Update party group with properly formatted date
    const [updatedGroup] = await db.update(partyGroups)
      .set({
        ...restGroupData,
        ...(eventDate && { eventDate: eventDate.toISOString().split('T')[0] }),
        updatedAt: new Date(),
      })
      .where(eq(partyGroups.id, id))
      .returning();

    if (!updatedGroup) {
      return { success: false, error: "Party group not found" };
    }

    revalidatePath(`/groups/${id}`);
    revalidatePath('/groups');
    return { success: true, group: updatedGroup };
  } catch (error) {
    console.error("Error updating party group:", error);
    return { 
      success: false,
      error: error instanceof z.ZodError 
        ? error.errors 
        : "Failed to update party group" 
    };
  }
}

/**
 * Request to join a party group
 */
export async function requestToJoinGroup(data: z.infer<typeof joinGroupRequestSchema>) {
  try {
    // Check if user is already a member
    const existingMember = await db.query.groupMembers.findFirst({
      where: and(
        eq(groupMembers.groupId, data.groupId),
        eq(groupMembers.userId, data.userId)
      ),
    });

    if (existingMember) {
      return { 
        success: false, 
        error: "You are already a member or have a pending request" 
      };
    }

    // Get group details to check capacity
    const group = await db.query.partyGroups.findFirst({
      where: eq(partyGroups.id, data.groupId),
      with: {
        members: {
          where: eq(groupMembers.status, "approved"),
        },
      },
    });

    if (!group) {
      return { success: false, error: "Party group not found" };
    }

    if (group.status !== "open") {
      return { success: false, error: "This group is no longer accepting members" };
    }

    // Check if group is at capacity
    if (group.members.length >= group.maxMembers) {
      return { success: false, error: "This group is at maximum capacity" };
    }

    // Determine initial status based on creator
    // If joining user is the creator, auto-approve, otherwise pending
    const status = group.creatorId === data.userId ? "approved" : "pending";

    // Add user to group
    const [member] = await db.insert(groupMembers).values({
      groupId: data.groupId,
      userId: data.userId,
      status,
    }).returning();

    revalidatePath(`/groups/${data.groupId}`);
    return { success: true, member };
  } catch (error) {
    console.error("Error joining group:", error);
    return { success: false, error: "Failed to join group" };
  }
}

/**
 * Update a group member's status (approve/decline)
 */
export async function updateGroupMemberStatus(data: z.infer<typeof updateGroupMemberStatusSchema>) {
  try {
    // Only group creator can approve/decline membership requests
    const group = await db.query.partyGroups.findFirst({
      where: eq(partyGroups.id, data.groupId),
    });

    if (!group) {
      return { success: false, error: "Party group not found" };
    }

    // Update member status
    const [updatedMember] = await db.update(groupMembers)
      .set({ status: data.status })
      .where(
        and(
          eq(groupMembers.groupId, data.groupId),
          eq(groupMembers.userId, data.userId)
        )
      )
      .returning();

    if (!updatedMember) {
      return { success: false, error: "Member not found" };
    }

    revalidatePath(`/groups/${data.groupId}`);
    return { success: true, member: updatedMember };
  } catch (error) {
    console.error("Error updating member status:", error);
    return { success: false, error: "Failed to update member status" };
  }
}

/**
 * Send a message to a party group
 */
export async function sendGroupMessage(data: z.infer<typeof sendGroupMessageSchema>) {
  try {
    // Check if user is a member of the group
    const isMember = await db.query.groupMembers.findFirst({
      where: and(
        eq(groupMembers.groupId, data.groupId),
        eq(groupMembers.userId, data.senderId),
        eq(groupMembers.status, "approved")
      ),
    });

    if (!isMember) {
      return { 
        success: false, 
        error: "You must be an approved member to send messages" 
      };
    }

    // Send message
    const [message] = await db.insert(groupMessages).values({
      groupId: data.groupId,
      senderId: data.senderId,
      messageContent: data.messageContent,
    }).returning();

    revalidatePath(`/groups/${data.groupId}`);
    return { success: true, message };
  } catch (error) {
    console.error("Error sending message:", error);
    return { success: false, error: "Failed to send message" };
  }
}

/**
 * Get messages for a party group
 */
export async function getGroupMessages(groupId: string, options: { 
  limit?: number, 
  before?: Date 
} = {}) {
  try {
    const { limit = 50, before } = options;
    
    // Create base query
    let baseQuery = db.select({
      message: groupMessages,
      sender: {
        id: users.id,
        name: users.name,
        image: users.image,
      },
    })
    .from(groupMessages)
    .innerJoin(users, eq(groupMessages.senderId, users.id))
    .where(eq(groupMessages.groupId, groupId));
    
    // If before date is provided, create a new query with both conditions
    if (before) {
      // Convert Date to ISO string for comparison
      const beforeStr = before.toISOString();
      baseQuery = db.select({
        message: groupMessages,
        sender: {
          id: users.id,
          name: users.name,
          image: users.image,
        },
      })
      .from(groupMessages)
      .innerJoin(users, eq(groupMessages.senderId, users.id))
      .where(and(
        eq(groupMessages.groupId, groupId),
        sql`${groupMessages.sentAt} < ${beforeStr}`
      ));
    }
    
    const messages = await baseQuery
      .orderBy(desc(groupMessages.sentAt))
      .limit(limit);
    
    return { success: true, messages };
  } catch (error) {
    console.error("Error fetching messages:", error);
    return { success: false, error: "Failed to fetch messages" };
  }
}

/**
 * Get party group details including members and venue
 */
export async function getGroupDetails(groupId: string) {
  try {
    const group = await db.query.partyGroups.findFirst({
      where: eq(partyGroups.id, groupId),
      with: {
        members: {
          with: {
            user: {
              columns: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
        venue: true,
        creator: {
          columns: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    if (!group) {
      return { success: false, error: "Party group not found" };
    }

    return { success: true, group };
  } catch (error) {
    console.error("Error fetching group details:", error);
    return { success: false, error: "Failed to fetch group details" };
  }
}

/**
 * Get all public party groups with filtering options
 */
export async function getPartyGroups(options: {
  limit?: number,
  page?: number,
  onlyFuture?: boolean,
  userId?: string,
  venueId?: string,
} = {}) {
  try {
    const { 
      limit = 10, 
      page = 1, 
      onlyFuture = true,
      userId,
      venueId,
    } = options;
    
    const offset = (page - 1) * limit;
    const currentDate = new Date().toISOString().split('T')[0]; // Format as YYYY-MM-DD
    
    // Build conditions array
    const conditions = [eq(partyGroups.isPublic, true)];
    
    if (onlyFuture) {
      conditions.push(sql`${partyGroups.eventDate} >= ${currentDate}`);
    }
    
    if (userId) {
      conditions.push(eq(partyGroups.creatorId, userId));
    }
    
    if (venueId) {
      conditions.push(eq(partyGroups.venueId, venueId));
    }
    
    // Combine conditions with AND
    const whereCondition = conditions.length === 1 
      ? conditions[0] 
      : and(...conditions);
    
    // Build the complete query with all conditions
    const groupsQuery = db.select({
      group: partyGroups,
      venue: venues,
      memberCount: sql<number>`count(${groupMembers.id})`.as("memberCount"),
    })
    .from(partyGroups)
    .leftJoin(venues, eq(partyGroups.venueId, venues.id))
    .leftJoin(groupMembers, and(
      eq(partyGroups.id, groupMembers.groupId),
      eq(groupMembers.status, "approved")
    ))
    .where(whereCondition)
    .groupBy(partyGroups.id, venues.id)
    .orderBy(partyGroups.eventDate, partyGroups.eventTime)
    .limit(limit)
    .offset(offset);
    
    const groups = await groupsQuery;
    
    // Get total count for pagination with the same conditions
    const countResult = await db.select({
      count: sql<number>`count(*)`,
    })
    .from(partyGroups)
    .where(whereCondition);
    
    const totalCount = countResult[0]?.count || 0;
    
    return {
      success: true,
      groups,
      pagination: {
        total: Number(totalCount),
        page,
        limit,
        totalPages: Math.ceil(Number(totalCount) / limit)
      }
    };
  } catch (error) {
    console.error("Error fetching party groups:", error);
    return { success: false, error: "Failed to fetch party groups" };
  }
}

/**
 * Get all groups a user is a member of
 */
export async function getUserGroups(userId: string) {
  try {
    const memberGroups = await db.query.groupMembers.findMany({
      where: and(
        eq(groupMembers.userId, userId),
        eq(groupMembers.status, "approved")
      ),
      with: {
        group: {
          with: {
            venue: true,
          },
        },
      },
    });
    
    return { success: true, groups: memberGroups.map(m => m.group) };
  } catch (error) {
    console.error("Error fetching user groups:", error);
    return { success: false, error: "Failed to fetch user groups" };
  }
} 