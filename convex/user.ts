import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const CreateNewUser = mutation({

    args:{
        name:v.string(),
        email:v.string()
    },
    handler:async(ctx , args)=>{
        //if exists
        const user = await ctx.db.query("UserTable")
        .filter((q)=>q.eq(q.field("email"),args.email))
        .collect();
        //if not exists 
        if(user?.length === 0){
            const userData={
                name:args?.name,
                email:args?.email,
                token:2
            }
            const id = await ctx.db.insert('UserTable',userData);
            return await ctx.db.get(id);
        }
        return user[0];
    }
})