import React from 'react'
import RecentProject from "@/components/generated/RecentProject";


export default async function Projects() {
    
    return <ul>
        <RecentProject
            label={"Short-it"}
            description={
                "A link shortener app built with Supabase, Tailwind, TypeScript and Next.js"
            }
        />
        <RecentProject
            label={"Sighttrippr"}
            description={
                "Trip router and suggestion app. Building with Google API, TypeScript, Firebase, Next.js"
            }
        />
        <RecentProject
            label={"Spotify Recommendation App"}
            description={
                "I googled an app which can create custom Spotify Listening Card\n" +
                "                but I cannot found any. So I decided to build it myself."
            }
        />
    </ul>
}