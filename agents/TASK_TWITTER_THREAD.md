# TASK: Twitter Thread Generation

## Trigger
New markdown file added to `/home/e/nb-studio/20_GROWTH/CONTENT_DRAFTS/`

## Input
File path to the content draft (passed as argument)

## Process

1. **Read the content draft**
   - Parse the markdown file
   - Extract key points, insights, and narrative
   - Identify the core message and hook

2. **Generate Twitter Thread** (3-5 tweets)
   - Tweet 1: Hook/attention grabber (strong opener)
   - Tweet 2-3: Core insights/value from the content
   - Tweet 4: Supporting point or example
   - Tweet 5 (optional): Call-to-action or closing thought
   
3. **Thread Requirements**
   - Each tweet ≤ 280 characters
   - Use line breaks for readability
   - Include 1-2 relevant hashtags where natural
   - Maintain consistent voice (bold, growth-focused)
   - Make it shareable and engaging

4. **Output Format**
   Save to: `/home/e/nb-studio/20_GROWTH/SOCIAL_QUEUE/`
   Filename: `{original-name}-thread-{YYYY-MM-DD}.md`
   
   Structure:
   ```markdown
   # Twitter Thread: {Title}
   
   Source: {original-file-path}
   Generated: {timestamp}
   Status: PENDING_REVIEW
   
   ---
   
   🧵 {Thread opener}
   
   1/ {Tweet 1}
   
   2/ {Tweet 2}
   
   3/ {Tweet 3}
   
   4/ {Tweet 4}
   
   5/ {Tweet 5 (optional)}
   
   ---
   
   ## Notes for Reviewer
   - Key hook: {brief description}
   - Target audience: {who this resonates with}
   - Suggested timing: {optimal post time}
   ```

5. **Notify**
   - Send Discord notification to Growth channel
   - Tag HYPE agent for review

## Success Criteria
- [ ] Thread has 3-5 tweets
- [ ] All tweets ≤ 280 characters
- [ ] Strong hook in first tweet
- [ ] Clear value proposition
- [ ] Saved to SOCIAL_QUEUE with proper naming
- [ ] Discord notification sent
