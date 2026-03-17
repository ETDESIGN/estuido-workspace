/**
 * /model-minimax - Switch to MiniMax M2.5 via OpenRouter
 */
exports.invoke = async (context) => {
  const { agent } = context;

  const result = await agent.session_status({
    model: "openrouter/minimax/minimax-m2.5"
  });

  return {
    text: `🔄 Switched to **MiniMax M2.5** via OpenRouter\nModel: openrouter/minimax/minimax-m2.5`
  };
};
