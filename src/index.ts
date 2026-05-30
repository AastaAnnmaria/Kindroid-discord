import dotenv from "dotenv";
import { initializeAllBots, shutdownAllBots } from "./discordManager";
import { scheduleMorningReminder } from "./morningReminder";
import { BotConfig } from "./types";

dotenv.config();

/**
 * Load bot configurations from environment variables
 * Looks for pairs of SHARED_AI_CODE_N and BOT_TOKEN_N where N starts from 1
 * @returns Array of bot configurations
 */
function loadBotConfigs(): BotConfig[] {
  const configs: BotConfig[] = [];
  let currentIndex = 1;

  let hasMoreConfigs = true;
  while (hasMoreConfigs) {
    const sharedAiCode = process.env[`SHARED_AI_CODE_${currentIndex}`];
    const botToken = process.env[`BOT_TOKEN_${currentIndex}`];

    // If either required value is missing, we've reached the end of our configs
    if (!sharedAiCode || !botToken) {
      hasMoreConfigs = false;
      break;
    }

    // Get optional settings
    const enableFilter =
      process.env[`ENABLE_FILTER_${currentIndex}`]?.toLowerCase() === "true";

    configs.push({
      id: `bot${currentIndex}`,
      discordBotToken: botToken,
      sharedAiCode,
      enableFilter,
    });

    currentIndex++;
  }

  return configs;
}

/**
 * Validate environment variables.
 * Requires either full Kindroid bot config or MORNING_REMINDER_WEBHOOK_URL (or both).
 */
function validateEnv(): void {
  const hasKindroid = !!(
    process.env.KINDROID_INFER_URL &&
    process.env.KINDROID_API_KEY &&
    process.env.SHARED_AI_CODE_1 &&
    process.env.BOT_TOKEN_1
  );
  const hasMorningReminder = !!process.env.MORNING_REMINDER_WEBHOOK_URL;

  if (!hasKindroid && !hasMorningReminder) {
    console.error(
      "No valid configuration found. Provide either the Kindroid bot variables " +
        "(KINDROID_INFER_URL, KINDROID_API_KEY, SHARED_AI_CODE_1, BOT_TOKEN_1) " +
        "or MORNING_REMINDER_WEBHOOK_URL."
    );
    process.exit(1);
  }

  if (hasKindroid) {
    // Validate that each SHARED_AI_CODE_N has a matching BOT_TOKEN_N
    let currentIndex = 1;
    while (true) {
      const hasCode = !!process.env[`SHARED_AI_CODE_${currentIndex}`];
      const hasToken = !!process.env[`BOT_TOKEN_${currentIndex}`];
      if (!hasCode && !hasToken) break;
      if (hasCode !== hasToken) {
        console.error(
          `Error: Bot ${currentIndex} must have both SHARED_AI_CODE_${currentIndex} and BOT_TOKEN_${currentIndex} defined`
        );
        process.exit(1);
      }
      currentIndex++;
    }
  }
}

async function main(): Promise<void> {
  try {
    // Validate environment
    validateEnv();

    // Start the daily morning reminder scheduler (no-op if webhook URL not set)
    scheduleMorningReminder();

    // Load and initialize Discord bots (optional when running reminder-only)
    const botConfigs = loadBotConfigs();

    if (botConfigs.length === 0) {
      console.log("No Kindroid bot configurations found — running in reminder-only mode.");
    } else {
      console.log(`Found ${botConfigs.length} bot configuration(s)`);
      await initializeAllBots(botConfigs);
      console.log("All bots initialized successfully!");
    }

    // Handle graceful shutdown
    process.on("SIGINT", async () => {
      console.log("\nReceived SIGINT. Shutting down...");
      await shutdownAllBots();
      process.exit(0);
    });

    process.on("SIGTERM", async () => {
      console.log("\nReceived SIGTERM. Shutting down...");
      await shutdownAllBots();
      process.exit(0);
    });
  } catch (error) {
    console.error("Fatal error during initialization:", error);
    process.exit(1);
  }
}

// Start the application
main().catch((error) => {
  console.error("Unhandled error:", error);
  process.exit(1);
});
