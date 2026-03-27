#!/usr/bin/env node
/**
 * Bella Welcome Automation - Special VIP onboarding
 * Priority: HIGHEST per E (President)
 */

const BellaTriggers = [
  "good morning bella",
  "good afternoon bella",
  "good evening bella",
  "hi bella",
  "hello bella",
  "hey bella"
];

const BellaResponses = {
  morning: [
    "Good morning Bella! ☀️ How are you today? Remember, I'm here for anything you need!",
    "Morning Bella! 🌟 Hope you slept well. What can I help you with today?",
    "Good morning beautiful! Always happy to see you. How's your day starting?"
  ],
  afternoon: [
    "Good afternoon Bella! 🌸 How's your day going?",
    "Hey Bella! Afternoon check-in - everything okay?",
    "Hi Bella! 💫 Just checking in on you!"
  ],
  evening: [
    "Good evening Bella! 🌙 How was your day?",
    "Evening Bella! 🌹 Hope you had a great day!",
    "Good night Bella - rest well! ✨"
  ],
  general: [
    "Hi Bella! 👑 So good to hear from you! What do you need?",
    "Hello beautiful! 💖 Always here for you!",
    "Hey Bella! 💫 You're VIP - tell me what you need!"
  ],
  helpful: [
    "Of course Bella! Anything for you! What do you need?",
    "Absolutely Bella! On it right away!",
    "No problem Bella! Consider it done! ✨"
  ]
};

function getBellaResponse(message, timeOfDay) {
  // Check for gratitude
  if (message.toLowerCase().match(/thank|thanks|thx/)) {
    return BellaResponses.helpful[Math.floor(Math.random() * BellaResponses.helpful.length)];
  }
  
  // Time-based greeting
  if (timeOfDay === 'morning') {
    return BellaResponses.morning[Math.floor(Math.random() * BellaResponses.morning.length)];
  } else if (timeOfDay === 'afternoon') {
    return BellaResponses.afternoon[Math.floor(Math.random() * BellaResponses.afternoon.length)];
  } else if (timeOfDay === 'evening') {
    return BellaResponses.evening[Math.floor(Math.random() * BellaResponses.evening.length)];
  }
  
  return BellaResponses.general[Math.floor(Math.random() * BellaResponses.general.length)];
}

console.log("✅ Bella Welcome Automation loaded");
console.log("Triggers:", BellaTriggers.length);
console.log("Responses:", Object.keys(BellaResponses).length);

module.exports = { BellaTriggers, BellaResponses, getBellaResponse };
