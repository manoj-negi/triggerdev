// src/app/api/github-webhook/route.ts
import { NextResponse } from "next/server";
import { tasks } from "@trigger.dev/sdk/v3";
import { githubPushLoggerTask } from "@/trigger/github-push";
 
export async function POST(req: Request) {
  try {
    const payload = await req.json();
 
    // We'll only trigger the task for the 'push' event.
    // The 'X-GitHub-Event' header tells you what kind of event it is.
    // GitHub also sends a 'ping' event when you set up the webhook, which is good for a simple "pong" response.
    const event = req.headers.get("X-GitHub-Event");
    console.log("Key from env:", process.env.TRIGGER_SECRET_KEY);
 
 
    if (event === "ping") {
      return NextResponse.json({ message: "pong" }, { status: 200 });
    }
    
    if (event !== "push") {
      return NextResponse.json({ message: "Ignoring non-push event" }, { status: 200 });
    }
 
    // Trigger the defined Trigger.dev task with the payload
    await tasks.trigger<typeof githubPushLoggerTask>("github-push-logger", payload);
 
    return NextResponse.json({ message: "Task triggered" }, { status: 200 });
 
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
 
// import { NextResponse } from "next/server";
 
// export async function POST(req: Request) {
//   try {
//     const event = req.headers.get("X-GitHub-Event");
 
//     if (event === "ping") {
//       console.log("Received GitHub 'ping' event. Webhook is working!");
//       return NextResponse.json({ message: "pong" }, { status: 200 });
//     }
 
//     if (event !== "push") {
//       console.log(`Ignoring non-push event: ${event}`);
//       return NextResponse.json({ message: "Ignoring non-push event" }, { status: 200 });
//     }
 
//     const payload = await req.json();
//     const pusherName = payload.pusher.name;
//     const repoName = payload.repository.full_name;
//     const branch = payload.ref;
 
//     // Log the details of the push event directly to the console
//     console.log(`[${new Date().toISOString()}] Push detected on branch "${branch}" by "${pusherName}" in repository "${repoName}".`);
 
//     return NextResponse.json({ message: "Log created" }, { status: 200 });
 
//   } catch (error) {
//     console.error("Error processing webhook:", error);
//     return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
 
// }
// }