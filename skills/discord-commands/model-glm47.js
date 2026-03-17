/**
 * /model-glm47 - Switch to GLM 4.7
 */
exports.invoke = async (context) => {
  const { agent, session } = context;

  // Update session model
  const result = await agent.session_status({
    model: "zai/glm-4.7"
  });

  return {
    text: `🔄 Switched to **GLM 4.7** (zai/glm-4.7)\nNote: Make sure this model exists in your models.json configuration!`
  };
};
