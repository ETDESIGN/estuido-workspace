# 📞 Calling Skills Implementation Plan

**Date:** 2026-03-28 07:30 HKT
**Purpose:** Add phone/calling capabilities to Sourcing Agent
**Priority:** HIGH - "Always go for excellence"

---

## 🎯 Objective

Enable the Sourcing Agent to make and receive phone calls to suppliers, improving communication speed and effectiveness.

---

## 🛠️ Implementation Options

### Option 1: VoIP Integration (Twilio/SIP)
**Timeline:** 1-2 weeks
**Cost:** Low-Medium
**Capability:** Full calling features

**Requirements:**
- Twilio account or SIP provider
- Phone number (Chinese +86 number)
- WebRTC or SIP client integration
- Voice recording (for transcription)

**Tools:**
- Python: `twilio` library
- SIP: `pjsip` or `linphone`
- Audio: OpenClaw audio pipeline
- Transcription: Whisper (already configured)

**Architecture:**
```
User (Agent) → OpenClaw Gateway → Twilio/SIP → Supplier Phone
                              ↓
                        Audio Recording
                              ↓
                        Transcription (Whisper)
                              ↓
                        Conversation Log
```

**Advantages:**
- Full phone calling capability
- Can call any phone number
- Professional appearance
- Call recording and logging

**Disadvantages:**
- Requires VoIP provider setup
- Per-minute calling costs
- More complex implementation

---

### Option 2: VoIP Communication (Easier)
**Timeline:** 3-5 days
**Cost:** Low
**Capability:** Voice messaging

**Requirements:**
- WeChat voice messaging (already have)
- Or integrate voice recording tool
- Send audio files via messaging apps

**Tools:**
- WeChat API (for voice messages)
- Or Telegram/WhatsApp Business API
- Audio recording: already configured

**Advantages:**
- Quick implementation
- Low cost
- Uses existing tools
- Familiar to Chinese suppliers

**Disadvantages:**
- Not real-time calling
- Delayed communication
- Less professional

---

### Option 3: Click-to-Call (Manual Trigger)
**Timeline:** 1 week
**Cost:** Low
**Capability:** Agent initiates, user talks

**Requirements:**
- Click-to-call button in dashboard
- User's phone (your mobile)
- Supplier number dialing

**Tools:**
- Dashboard UI enhancement
- Phone integration (tel: links)
- Call logging after call

**Advantages:**
- Very simple
- No VoIP setup needed
- You handle the talking
- Low cost

**Disadvantages:**
- Requires manual user action
- No automated calling
- You must be available

---

## 📋 Recommended Implementation

### Phase 1: Click-to-Call (This Week)
**Quick win - immediate value**

**Features:**
1. **Supplier cards** with "Call" button
2. **Click-to-call** via tel: links
3. **Call logging** form after call
4. **Automatic note** creation

**Dashboard Enhancement:**
```python
# In dashboard (Suppliers page)
if st.button("📞 Call Supplier"):
    st.markdown(f"<a href='tel:{supplier_phone}'>Call {supplier_name}</a>", unsafe_allow_html=True)
    # Show call logging form
    st.text_input("Call Summary")
    st.selectbox("Outcome", ["Quote Received", "Follow-up Required", "Not Interested"])
```

**Benefits:**
- Fast implementation (1 day)
- You talk, system logs
- Better than nothing
- Learn calling patterns

---

### Phase 2: VoIP Integration (Month 1)
**Full calling capability**

**Implementation Steps:**

1. **Set up Twilio Account**
   - Get Twilio account
   - Purchase Chinese phone number (+86)
   - Configure voice webhook

2. **Integrate with OpenClaw**
   ```python
   # Add calling skill
   from twilio.rest import Client

   def call_supplier(phone_number, script):
       client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
       call = client.calls.create(
           to=phone_number,
           from_=TWILIO_PHONE_NUMBER,
           url=script  # TwiML or webhook URL
       )
       return call.sid
   ```

3. **Add Speech-to-Text Pipeline**
   - Record call audio
   - Transcribe with Whisper (already have)
   - Log to conversation history
   - Extract action items

4. **Dashboard Integration**
   - "Auto-Call" button for supplier outreach
   - Call progress monitoring
   - Live transcription display
   - Post-call summary generation

**Benefits:**
- Automated supplier outreach
- Call all suppliers quickly
- Record and transcribe calls
- Extract key information

---

## 🎯 Calling Skills Features

### Skill 1: Outbound Calling
**Purpose:** Call suppliers to introduce RFQ

**Script Template:**
```
"您好，我是Etia，我们有一个电池充电底座项目。
我们有80个充电柜和1200个电池的年度需求。
需要了解您的报价能力。
我刚刚通过邮件/1688发送了RFQ文档。
请问您方便现在讨论一下吗？"
```

**Automation:**
1. Load supplier list
2. Call each supplier
3. Play introduction (text-to-speech)
4. Transfer to human if needed
5. Log call result

---

### Skill 2: Inbound Call Handling
**Purpose:** Receive calls from suppliers

**Features:**
- Answer incoming calls
- Greet and identify caller
- Route to human or take message
- Transcribe conversation
- Extract key info (price, timeline)

---

### Skill 3: Call Follow-up
**Purpose:** Follow up on quotations

**Automation:**
- Check RFQ sent dates
- Auto-call if no response in 3 days
- Remind about deadline
- Log supplier response

---

### Skill 4: Multi-Language Support
**Purpose:** Call suppliers in Chinese

**Capabilities:**
- Text-to-speech in Chinese
- Speech recognition (Chinese)
- Bilingual conversation support
- Cultural greeting protocols

---

## 📊 Integration with Mission Control

### Dashboard Enhancements

**1. Supplier Cards**
```
┌─────────────────────────────┐
│ STW - Shared Power Bank     │
│ ⭐ 95% Match                │
│                             │
│ [📧 Email] [💬 WeChat]       │
│ [📞 Call] [🎤 Auto-Call]    │
│                             │
│ RFQ Sent: ✅ Mar 28         │
│ Response: ⏳ Awaiting       │
└─────────────────────────────┘
```

**2. Call Center Page**
```
┌─────────────────────────────┐
│ 📞 Call Center              │
├─────────────────────────────┤
│                             │
│ Supplier: [Select]          │
│                             │
│ [📞 Manual Call]            │
│ [🤖 Auto-Call All]          │
│                             │
│ Call History:               │
│ • STW - Mar 28 - Quote Rx   │
│ • Goochain - Mar 28 - TBD   │
└─────────────────────────────┘
```

**3. Call Log**
```
| Time      | Supplier    | Duration | Outcome          | Notes          |
|-----------|-------------|----------|------------------|----------------|
| Mar 28 10:30 | STW    | 5:23     | Quote Received   | Will send by 4/1 |
| Mar 28 11:15 | Goochain | 3:45     | Follow-up Needed | Checking stock |
```

---

## 💰 Cost Analysis

### Twilio (Option 1)
- Setup: Free
- Chinese number: ~$5/month
- Calls: ~$0.05/minute (within China)
- Estimated monthly: $20-50 for supplier calls

### SIP Provider (Alternative)
- Setup: ~$100
- Monthly: ~$20
- Calls: ~$0.03/minute
- Estimated monthly: $30-60

### Click-to-Call (Option 3)
- Setup: $0
- Calls: Use your existing phone plan
- Monthly: $0 extra

---

## 🚀 Implementation Priority

### Week 1 (This Week)
**✅ Click-to-Call** (Immediate value)
- Add "Call" button to supplier cards
- Implement call logging form
- Track call outcomes

### Week 2-3
**📞 VoIP Integration** (Full capability)
- Set up Twilio account
- Integrate calling API
- Add transcription pipeline

### Week 4
**🤖 Automation** (Auto-dial suppliers)
- Auto-call feature
- Follow-up automation
- Multi-language support

---

## 📝 Next Steps

1. **Decide on option:**
   - Click-to-Call (fastest, cheapest)
   - VoIP (full capability)
   - Both (start simple, upgrade later)

2. **Get your preference:**
   - Should I start with Click-to-Call?
   - Or go directly to VoIP integration?
   - What's your budget for calling features?

3. **Start implementation:**
   - I'll add calling skills to the agent
   - Update Mission Control dashboard
   - Create call logging system

---

**"Always go for excellence" - Let's add professional calling capability!**

*Created: 2026-03-28 07:30 HKT*
*Priority: HIGH*
*Goal: World-class supplier communication*
