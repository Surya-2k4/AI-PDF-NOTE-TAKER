import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { query } from "./_generated/server";

export const AddNotes = mutation({
  args: {
    fileId: v.string(),
    notes: v.any(),
    createdBy: v.string(),
  },
  handler: async (ctx, args) => {
    const record = await ctx.db.query('notes')
      .filter((q) => q.eq(q.field('fileId'), args.fileId)).collect();

    if (record?.length == 0) {
      await ctx.db.insert(
        'notes', {
          fileId: args.fileId,
          notes: args.notes,
          createdBy: args.createdBy,
        });
    } else {
      await ctx.db.patch(record[0]._id, { notes: args.notes });
    }
  }
});

export const GetNotes = query({
  args: {
    userEmail: v.string(),
    fileId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let result;
    if (args.fileId) {
      result = await ctx.db.query('notes')
        .filter((q) => q.eq(q.field('createdBy'), args.userEmail))
        .filter((q) => q.eq(q.field('fileId'), args.fileId))
        .collect();
    } else {
      result = await ctx.db.query('notes')
        .filter((q) => q.eq(q.field('createdBy'), args.userEmail))
        .collect();
    }

    return result.map(note => note.notes).join('<br/>');
  },
});