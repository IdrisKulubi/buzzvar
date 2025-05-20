import * as schema from "./schema";
import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import { relations } from "drizzle-orm";

// Define relations for tables
const userRelations = relations(schema.users, ({ many, one }) => ({
  accounts: many(schema.accounts),
  sessions: many(schema.sessions),
  profile: one(schema.profiles, {
    fields: [schema.users.id],
    references: [schema.profiles.userId],
  }),
  createdGroups: many(schema.partyGroups),
  groupMemberships: many(schema.groupMembers),
  sentMessages: many(schema.groupMessages),
  ownedVenues: many(schema.venues),
}));

const profileRelations = relations(schema.profiles, ({ one }) => ({
  user: one(schema.users, {
    fields: [schema.profiles.userId],
    references: [schema.users.id],
  }),
}));

const venueRelations = relations(schema.venues, ({ one, many }) => ({
  owner: one(schema.users, {
    fields: [schema.venues.ownerUserId],
    references: [schema.users.id],
  }),
  images: many(schema.venueImages),
  menus: many(schema.menus),
  offers: many(schema.offers),
  partyGroups: many(schema.partyGroups),
}));

const venueImageRelations = relations(schema.venueImages, ({ one }) => ({
  venue: one(schema.venues, {
    fields: [schema.venueImages.venueId],
    references: [schema.venues.id],
  }),
}));

const menuRelations = relations(schema.menus, ({ one }) => ({
  venue: one(schema.venues, {
    fields: [schema.menus.venueId],
    references: [schema.venues.id],
  }),
}));

const offerRelations = relations(schema.offers, ({ one }) => ({
  venue: one(schema.venues, {
    fields: [schema.offers.venueId],
    references: [schema.venues.id],
  }),
}));

const partyGroupRelations = relations(schema.partyGroups, ({ one, many }) => ({
  venue: one(schema.venues, {
    fields: [schema.partyGroups.venueId],
    references: [schema.venues.id],
  }),
  creator: one(schema.users, {
    fields: [schema.partyGroups.creatorId],
    references: [schema.users.id],
  }),
  members: many(schema.groupMembers),
  messages: many(schema.groupMessages),
}));

const groupMemberRelations = relations(schema.groupMembers, ({ one }) => ({
  group: one(schema.partyGroups, {
    fields: [schema.groupMembers.groupId],
    references: [schema.partyGroups.id],
  }),
  user: one(schema.users, {
    fields: [schema.groupMembers.userId],
    references: [schema.users.id],
  }),
}));

const groupMessageRelations = relations(schema.groupMessages, ({ one }) => ({
  group: one(schema.partyGroups, {
    fields: [schema.groupMessages.groupId],
    references: [schema.partyGroups.id],
  }),
  sender: one(schema.users, {
    fields: [schema.groupMessages.senderId],
    references: [schema.users.id],
  }),
}));

// Get pool configuration from environment variables
const poolConfig = {
  connectionString: process.env.POSTGRES_URL!,
  min: Number(process.env.POSTGRES_POOL_MIN || 5),
  max: Number(process.env.POSTGRES_POOL_MAX || 20),
  idleTimeoutMillis: Number(process.env.POSTGRES_IDLE_TIMEOUT || 30000),
  connectionTimeoutMillis: 5000, // 5 seconds
  maxUses: 10000, // Number of times a connection can be used before being destroyed
};

// Create connection pool
const pool = new Pool(poolConfig);

// Create drizzle instance with the pool and relations
const db = drizzle(pool, { 
  schema: {
    ...schema,
    userRelations,
    profileRelations,
    venueRelations,
    venueImageRelations,
    menuRelations,
    offerRelations,
    partyGroupRelations,
    groupMemberRelations,
    groupMessageRelations,
  } 
});

// Export the db instance and pool for potential direct usage
export { pool };
export default db;
