import { task } from "@trigger.dev/sdk/v3";
import { z } from "zod";
 
const githubPushPayloadSchema = z.object({
  pusher: z.object({
    name: z.string(),
  }),
  repository: z.object({
    full_name: z.string(),
  }),
  ref: z.string(),
});
 
export const githubPushLoggerTask = task({
  id: "github-push-logger", // The ID you will use to trigger this task
  run: async (payload: z.infer<typeof githubPushPayloadSchema>) => {
    // Check if the push event was for the 'main' branch
    if (payload.ref === "refs/heads/main") {
      console.log(
        `[${new Date().toISOString()}] Push detected on main branch by "${payload.pusher.name}" in repository "${payload.repository.full_name}".`
      );
    }
  },
});
 