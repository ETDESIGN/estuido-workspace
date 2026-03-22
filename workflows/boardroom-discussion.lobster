name: "Boardroom Discussion"
version: "1.0"
description: "Triggered when QA rejects CTO work 2+ times. Facilitates blocker resolution."

args:
  feature_request:
    required: true
    description: "Original feature that's stuck"
  qa_rejection_count:
    default: "2"
    description: "Number of times QA has rejected the work"
  previous_attempts:
    default: ""
    description: "Summary of previous failed attempts"

steps:
  # ============================================================
  # PHASE 1: Gather Context
  # ============================================================
  - id: gather_cto_context
    name: "CTO Perspective"
    run: |
      openclaw.invoke \
        --agent cto \
        --json \
        --args-json "{
          \"task\": \"BOARDROOM DISCUSSION\n\nYour work has been rejected ${LOBSTER_ARG_QA_REJECTION_COUNT} times.\n\nFeature: ${LOBSTER_ARG_FEATURE_REQUEST}\n\nExplain:\n1. Your architectural approach\n2. What you've tried so far\n3. Why you think QA is rejecting it\n4. What you need to unblock this\n\nBe specific. This is a discussion to find a solution.\"
        }"
    timeoutMs: 120000  # 2 minutes

  - id: gather_qa_context
    name: "QA Perspective"
    run: |
      openclaw.invoke \
        --agent qa \
        --json \
        --args-json "{
          \"task\": \"BOARDROOM DISCUSSION\n\nYou have rejected CTO work ${LOBSTER_ARG_QA_REJECTION_COUNT} times.\n\nFeature: ${LOBSTER_ARG_FEATURE_REQUEST}\n\nExplain:\n1. Why you're rejecting the work\n2. Specific issues you're finding\n3. What acceptance criteria are not met\n4. What would make this pass\n\nBe specific. Help the CTO understand what needs to change.\"
        }"
    timeoutMs: 120000  # 2 minutes

  # ============================================================
  # PHASE 2: Facilitated Discussion
  # ============================================================
  - id: facilitate_discussion
    name: "GM Facilitates Discussion"
    description: "Dereck (GM) reviews both perspectives and facilitates agreement."
    approval:
      prompt: |
        === BOARDROOM DISCUSSION ===

        Feature: ${LOBSTER_ARG_FEATURE_REQUEST}
        QA Rejections: ${LOBSTER_ARG_QA_REJECTION_COUNT}

        CTO Perspective: [See cto_context output]
        QA Perspective: [See qa_context output]

        As GM, review both sides and decide:

        1. Is the blocker technical or architectural?
        2. Does CTO need clearer requirements?
        3. Is QA being too strict or missing context?
        4. What's the AGREED solution going forward?

        Options:
        - Approve: Send CTO back with clear direction
        - Reject: Escalate to E (President) for decision
      on_approve: propose_solution
      on_reject: escalate_to_president

  # ============================================================
  # PHASE 3: Execute Solution
  # ============================================================
  - id: propose_solution
    name: "Agreed Solution - Resume Pipeline"
    run: |
      echo "✅ Boardroom reached consensus."
      echo ""
      echo "Agreed solution: [GM to document]"
      echo ""
      echo "Resuming feature-build pipeline with clear direction..."
      openclaw.invoke \
        --agent cto \
        --json \
        --args-json "{
          \"task\": \"BOARDROOM RESOLUTION\n\nThe boardroom discussed the blocker and agreed on a solution.\n\nImplement: ${LOBSTER_ARG_FEATURE_REQUEST}\n\nDirection: [GM provides clear requirements based on discussion]\n\nProceed with implementation using this clarified approach.\"
        }"
    on_success: trigger_qa_review

  - id: trigger_qa_review
    name: "QA Reviews Revised Work"
    run: |
      echo "CTO has implemented the agreed solution. QA reviewing..."
      openclaw.invoke \
        --agent qa \
        --json \
        --args-json "{
          \"task\": \"The CTO has implemented the boardroom-agreed solution for: ${LOBSTER_ARG_FEATURE_REQUEST}\n\nReview against the agreed criteria from the boardroom discussion.\n\nReturn JSON:\n- status: 'PASS' | 'NEEDS_FIX' | 'BLOCKER'\n- If PASS, feature is complete\n- If NEEDS_FIX, specify what's still missing\"
        }"
    timeoutMs: 180000
    on_success: final_decision

  - id: final_decision
    name: "Final Decision"
    run: |
      echo "=== Boardroom Resolution Complete ==="
      echo ""
      echo "QA reviewed the boardroom-guided implementation."
      echo "If PASS: Feature complete, ready for GM approval"
      echo "If NEEDS_FIX: May need another boardroom or escalation"
      echo ""
      echo "Pipeline outcome determined."

  # ============================================================
  # Escalation
  # ============================================================
  - id: escalate_to_president
    name: "Escalate to President"
    run: |
      echo "❌ Boardroom discussion failed to reach consensus."
      echo ""
      echo "Escalating to E (President) for decision."
      openclaw.invoke \
        --agent main \
        --json \
        --args-json "{
          \"task\": \"BOARDROOM FAILED\n\nFeature: ${LOBSTER_ARG_FEATURE_REQUEST}\nQA Rejections: ${LOBSTER_ARG_QA_REJECTION_COUNT}\n\nCTO and QA could not agree on a path forward.\n\nPresident intervention required. Please decide:\n1. Clarify requirements\n2. Override QA (accept as-is)\n3. Cancel feature\n4. Other direction\"
        }"
