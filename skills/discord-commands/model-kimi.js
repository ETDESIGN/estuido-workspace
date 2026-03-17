/**
 * /model-kimi - Switch to Kimi K2.5 via OpenRouter
 */
exports.invoke = async (context) => {
  const { agent } = context;

  const result = await agent.session_status({
    model: "openrouter/moonshotai/kimi-k2.5"
  });

  return {
    text: `🔄 Switched to **Kimi K2.5** via OpenRouter\nModel: openrouter/moonshotai/kimi-k2.5`
  };
};
