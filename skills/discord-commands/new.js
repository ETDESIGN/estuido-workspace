/**
 * /new - Create a new Discord session
 */
exports.invoke = async (context) => {
  const { agent, sessionId, userId, channelId } = context;

  // Create new session via sessions_spawn
  const result = await agent.sessions_spawn({
    task: "New Discord session created via /new command.",
    mode: "session",
    thread: false
  });

  return {
    text: `✅ Created new session!\nSession: ${result.sessionKey || "Starting..."}`
  };
};
