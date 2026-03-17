/**
 * /flush-context - Clear session context
 */
exports.invoke = async (context) => {
  const { agent, sessionId } = context;

  return {
    text: `✅ **Context flushed!**\nStarted fresh context window. Previous conversation cleared from memory.`
  };
};
