name: "Autonomous Feature Pipeline"
version: "1.0"
description: "CTO builds → QA reviews → GM approval. Auto-retry on timeout, boardroom discussion after 2 QA rejections."

args:
  feature_request:
    required: true
    description: "Feature description for CTO to implement"
  task_file:
    default: "agents/TASK-current.md"
    description: "Optional: TASK.md file to reference"

env:
  LOBSTER_ITERATION: "0"
  LOBSTER_APPROVED: "false"

steps:
  # ============================================================
  # STAGE 1: CTO Build
  # ============================================================
  - id: cto_build
    name: "CTO Implementation"
    run: |
      openclaw.invoke \
        --agent cto \
        --json \
        --args-json "{
          \"task\": \"Implement the following feature: ${LOBSTER_ARG_FEATURE_REQUEST}\n\nReturn JSON response with:\n- status: 'complete' | 'failed'\n- files_changed: [list of modified files]\n- checkpoint: 'description of progress'\n- issues: [any blockers encountered]\"
        }"
    timeoutMs: 300000  # 5 minutes
    on_success: qa_review
    on_fail: cto_retry_1

  # ============================================================
  # CTO Retry Logic (Auto-retry up to 2 times)
  # ============================================================
  - id: cto_retry_1
    name: "CTO Retry 1"
    run: |
      echo "CTO failed, retrying (1/2)..."
      openclaw.invoke \
        --agent cto \
        --json \
        --args-json "{
          \"task\": \"Resume your previous work. Continue implementing: ${LOBSTER_ARG_FEATURE_REQUEST}\"
        }"
    timeoutMs: 300000
    on_success: qa_review
    on_fail: cto_retry_2

  - id: cto_retry_2
    name: "CTO Retry 2"
    run: |
      echo "CTO failed twice, final retry..."
      openclaw.invoke \
        --agent cto \
        --json \
        --args-json "{
          \"task\": \"Second retry. Implement: ${LOBSTER_ARG_FEATURE_REQUEST}. If this fails, report blocker.\"
        }"
    timeoutMs: 300000
    on_success: qa_review
    on_fail: notify_gm_cto_failed

  # ============================================================
  # STAGE 2: QA Review
  # ============================================================
  - id: qa_review
    name: "QA Code Review"
    run: |
      openclaw.invoke \
        --agent qa \
        --json \
        --args-json "{
          \"task\": \"Review the CTO's implementation of: ${LOBSTER_ARG_FEATURE_REQUEST}\n\nCheck:\n- Code quality (syntax, types, no console.log)\n- Functionality (works as specified)\n- Integration (no conflicts)\n\nReturn JSON:\n- status: 'PASS' | 'NEEDS_FIX' | 'BLOCKER'\n- issues: [list of problems]\n- required_changes: [specific fixes needed]\"
        }"
    timeoutMs: 180000  # 3 minutes
    condition: |
      # Parse QA response and route accordingly
      if [ "$QA_STATUS" = "PASS" ]; then
        goto gm_approval
      elif [ "$LOBSTER_ITERATION" -lt 2 ]; then
        goto cto_build
      else
        goto boardroom_discussion
      fi
    env:
      LOBSTER_ITERATION: "$((LOBSTER_ITERATION + 1))"

  # ============================================================
  # STAGE 3: Boardroom Discussion (After 2 QA rejections)
  # ============================================================
  - id: boardroom_discussion
    name: "Boardroom Discussion"
    description: "QA rejected work 2+ times. Dereck facilitates discussion between CTO and QA."
    approval:
      prompt: "QA has rejected CTO work 2+ times. Boardroom discussion required.\n\nDereck will:\n1. Gather CTO context\n2. Gather QA issues\n3. Facilitate discussion\n4. Agree on solution\n\nApprove to resume pipeline with agreed fix?"
      on_approve: cto_build
      on_reject: notify_gm_boardroom_failed

  # ============================================================
  # STAGE 4: GM Approval
  # ============================================================
  - id: gm_approval
    name: "GM Final Approval"
    description: "Feature complete. Present to E (President) for approval."
    approval:
      prompt: "✅ Feature Build Complete\n\nCTO implemented: ${LOBSTER_ARG_FEATURE_REQUEST}\nQA status: PASS\n\nReview changes and approve for production?"
      on_approve: notify_success
      on_reject: request_changes

  - id: request_changes
    name: "Request Changes"
    run: |
      echo "E requested changes. Sending back to CTO..."
      openclaw.invoke \
        --agent cto \
        --json \
        --args-json "{\"task\": \"E requested changes. Address feedback and rebuild.\"}"
    on_success: qa_review

  # ============================================================
  # Notifications & Error Handling
  # ============================================================
  - id: notify_gm_cto_failed
    name: "CTO Failed - Notify GM"
    run: |
      echo "❌ CTO failed after 3 retries. Escalating to GM..."
      openclaw.invoke \
        --agent main \
        --json \
        --args-json "{\"task\": \"CTO failed to implement: ${LOBSTER_ARG_FEATURE_REQUEST} after 3 retries. Manual intervention required.\"}"

  - id: notify_gm_boardroom_failed
    name: "Boardroom Failed - Notify GM"
    run: |
      echo "❌ Boardroom discussion failed to resolve blocker. Systemic failure."
      openclaw.invoke \
        --agent main \
        --json \
        --args-json "{\"task\": \"Boardroom discussion failed. Blocker unresolved. System failure declared.\"}"

  - id: notify_success
    name: "Pipeline Complete"
    run: |
      echo "✅ Feature pipeline complete: ${LOBSTER_ARG_FEATURE_REQUEST}"
      echo "Ready for production deployment."
