import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    UserTable:defineTable({
        name:v.string(),
        email:v.string(),
        imageUrl:v.optional(v.string()),
        subscription:v.optional(v.string()),
        token:v.number()


    }),
    AgentTable: defineTable({
        agentId: v.string(),
        name: v.string(),
        config: v.optional(v.any()),
        node:v.optional(v.any()),
        edge:v.optional(v.any()),
        published: v.boolean(),
        userId: v.id('UserTable'),
        agentToolConfig:v.optional(v.any()),
        messages:v.optional(v.any())
    }),
    ConversationTable: defineTable({
        conversationId: v.string(),
        agentId: v.id('AgentTable'),
        userId: v.id('UserTable'),
    })
}) 


