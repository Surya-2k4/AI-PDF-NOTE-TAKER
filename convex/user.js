//writing mutations to handle user related data

import { v } from "convex/values";
import { mutation, query } from "./_generated/server"; // Add query import

export const createUser = mutation({
    args:{
        email:v.string(),
        userName:v.string(),
        imageUrl:v.string()
    },

    handler:async(ctx,args)=>{
        //if user already exists
        const user = await ctx.db.query('users')
        .filter((q)=>q.eq(q.field('email'),args.email))
        .collect();

        //if not already exists
        if(user?.length === 0){
           await ctx.db.insert('users',{
            userName:args.userName,
            email:args.email,
            imageUrl:args.imageUrl,
            upgrade:false
            });

            return 'Inserted New User..'

        }
            return 'User already exists..'
    }
})

export const userUpgradePlan=mutation({
    args:{
        userEmail:v.string()
    },
    handler:async(ctx,args)=>{
       const result=await ctx.db.query('users').filter(q=>q.eq(q.field('email'),args.userEmail)).collect();
        
       if(result){
        await ctx.db.patch(result[0]._id,{upgrade:true});
        return 'success'
       }
       return 'Error'
    }
})

export const GetUserInfo=query({
    args:{
        userEmail:v.optional(v.string())
    },
    handler:async(ctx,args)=>{
        if(!args.userEmail){
            return; 
        }
        const result=await ctx.db.query('users').filter(q=>q.eq(q.field('email'),args?.userEmail)).collect();
        return result[0];
    }
})