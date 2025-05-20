import { uuid } from "drizzle-orm/pg-core";
import {
  timestamp,
  pgTable,
  text,
  integer,
  boolean,
  primaryKey,
  index,
  jsonb,
  date,
  time,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// First define all tables
export const users = pgTable(
  "user",
  {
    id: text("id").primaryKey(), 
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    role: text("role").$type<"user" | "admin" | "venue_admin">().default("user"),
    emailVerified: timestamp("emailVerified"),
    image: text("image"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    lastActive: timestamp("last_active").defaultNow().notNull(),
    isOnline: boolean("is_online").default(false),
    profilePhoto: text("profile_photo"),
    phoneNumber: text("phone_number"),
    university: text("university"),
  },
  (table) => ({
    emailIdx: index("user_email_idx").on(table.email),
    createdAtIdx: index("user_created_at_idx").on(table.createdAt),
    lastActiveIdx: index("user_last_active_idx").on(table.lastActive),
  })
);

// Auth.js tables
export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").notNull().primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

// Extended user profiles
export const profiles = pgTable(
    "profiles",
    { 
      id: uuid("id").defaultRandom().primaryKey(),
      userId: text("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
      bio: text("bio"),
      age: integer("age"),
      gender: text("gender"),
      role: text("role").$type<"user" | "admin">().default("user"),
      lastActive: timestamp("last_active").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow().notNull(),
      instagram: text("instagram"),
      spotify: text("spotify"),
      snapchat: text("snapchat"),
      profilePhoto: text("profile_photo"),
      phoneNumber: text("phone_number"),
      firstName: text("first_name").notNull().default(""),
      lastName: text("last_name").notNull().default(""),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      username: text("username"),
      university: text("university"),
    },
    (table) => ({
      userIdIdx: index("profile_user_id_idx").on(table.userId),
    })
  );

// Venue-related tables as specified in requirements
export const venues = pgTable(
  "venues",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    address: text("address").notNull(),
    latitude: text("latitude").notNull(),
    longitude: text("longitude").notNull(),
    phoneNumber: text("phone_number"),
    websiteUrl: text("website_url"),
    description: text("description"),
    openingHours: jsonb("opening_hours").$type<Record<string, string>>(), // JSONB for daily schedules
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    ownerUserId: text("owner_user_id").references(() => users.id, { onDelete: "set null" }),
  },
  (table) => ({
    ownerUserIdIdx: index("venue_owner_user_id_idx").on(table.ownerUserId),
    nameIdx: index("venue_name_idx").on(table.name),
  })
);

export const venueImages = pgTable(
  "venue_images",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    venueId: uuid("venue_id")
      .notNull()
      .references(() => venues.id, { onDelete: "cascade" }),
    imageUrl: text("image_url").notNull(),
    altText: text("alt_text"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    venueIdIdx: index("venue_images_venue_id_idx").on(table.venueId),
  })
);

export const menus = pgTable(
  "menus",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    venueId: uuid("venue_id")
      .notNull()
      .references(() => venues.id, { onDelete: "cascade" }),
    type: text("type").$type<"food" | "drinks">().notNull(),
    content: jsonb("content"), // JSONB for structured items or text for simple list
    contentText: text("content_text"), // Alternative for simple text content
    imageUrl: text("image_url"), // For image URL in V1
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    venueIdIdx: index("menus_venue_id_idx").on(table.venueId),
  })
);

export const offers = pgTable(
  "offers",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    venueId: uuid("venue_id")
      .notNull()
      .references(() => venues.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description").notNull(),
    startDate: date("start_date").notNull(),
    endDate: date("end_date").notNull(),
    active: boolean("active").default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    venueIdIdx: index("offers_venue_id_idx").on(table.venueId),
    startDateIdx: index("offers_start_date_idx").on(table.startDate),
    endDateIdx: index("offers_end_date_idx").on(table.endDate),
  })
);

export const partyGroups = pgTable(
  "party_groups",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    creatorId: text("creator_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    venueId: uuid("venue_id").references(() => venues.id, { onDelete: "set null" }),
    eventDate: date("event_date").notNull(),
    eventTime: time("event_time").notNull(),
    maxMembers: integer("max_members").notNull(),
    isPublic: boolean("is_public").default(true),
    status: text("status").$type<"open" | "closed" | "cancelled">().default("open"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    creatorIdIdx: index("party_groups_creator_id_idx").on(table.creatorId),
    venueIdIdx: index("party_groups_venue_id_idx").on(table.venueId),
    eventDateIdx: index("party_groups_event_date_idx").on(table.eventDate),
    statusIdx: index("party_groups_status_idx").on(table.status),
  })
);

export const groupMembers = pgTable(
  "group_members",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    groupId: uuid("group_id")
      .notNull()
      .references(() => partyGroups.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    status: text("status").$type<"pending" | "approved" | "declined">().default("pending"),
    joinedAt: timestamp("joined_at").defaultNow().notNull(),
  },
  (table) => ({
    groupIdIdx: index("group_members_group_id_idx").on(table.groupId),
    userIdIdx: index("group_members_user_id_idx").on(table.userId),
  })
);

export const groupMessages = pgTable(
  "group_messages",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    groupId: uuid("group_id")
      .notNull()
      .references(() => partyGroups.id, { onDelete: "cascade" }),
    senderId: text("sender_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    messageContent: text("message_content").notNull(),
    sentAt: timestamp("sent_at").defaultNow().notNull(),
  },
  (table) => ({
    groupIdIdx: index("group_messages_group_id_idx").on(table.groupId),
    senderIdIdx: index("group_messages_sender_id_idx").on(table.senderId),
    sentAtIdx: index("group_messages_sent_at_idx").on(table.sentAt),
  })
);

// Define Zod schemas for validation
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);

export const insertProfileSchema = createInsertSchema(profiles);
export const selectProfileSchema = createSelectSchema(profiles);

export const insertVenueSchema = createInsertSchema(venues);
export const selectVenueSchema = createSelectSchema(venues);

export const insertMenuSchema = createInsertSchema(menus);
export const selectMenuSchema = createSelectSchema(menus);

export const insertOfferSchema = createInsertSchema(offers);
export const selectOfferSchema = createSelectSchema(offers);

export const insertPartyGroupSchema = createInsertSchema(partyGroups);
export const selectPartyGroupSchema = createSelectSchema(partyGroups);

export type User = z.infer<typeof selectUserSchema>;
export type Profile = z.infer<typeof selectProfileSchema>;
export type Venue = z.infer<typeof selectVenueSchema>;
export type Menu = z.infer<typeof selectMenuSchema>;
export type Offer = z.infer<typeof selectOfferSchema>;
export type PartyGroup = z.infer<typeof selectPartyGroupSchema>;