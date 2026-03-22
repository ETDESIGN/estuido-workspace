name: "Quick Code Review"
version: "1.0"
description: "Fast QA review without full build. Use for code checks, PR reviews, quick validation."

args:
  review_target:
    required: true
    description: "Files, branches, or description of code to review"
  review_type:
    default: "quick"
    description: "Type: quick, thorough, security, performance"

steps:
  # ============================================================
  # STAGE 1: QA Review
  # ============================================================
  - id: qa_review
    name: "QA Code Review"
    run: |
      openclaw.invoke \
        --agent qa \
        --json \
        --args-json "{
          \"task\": \"Review the following code: ${LOBSTER_ARG_REVIEW_TARGET}\n\nReview type: ${LOBSTER_ARG_REVIEW_TYPE}\n\nCheck:\n- Code quality (syntax, types, structure)\n- Best practices\n- Potential bugs\n- Security issues (if security review)\n- Performance concerns (if performance review)\n\nReturn JSON:\n- status: 'PASS' | 'NEEDS_FIX' | 'BLOCKER'\n- findings: [detailed observations]\n- issues: [specific problems found]\n- suggestions: [improvement recommendations]\"
        }"
    timeoutMs: 180000  # 3 minutes
    on_success: report_results
    on_fail: notify_failed

  # ============================================================
  # STAGE 2: Report Results
  # ============================================================
  - id: report_results
    name: "Generate QA Report"
    run: |
      echo "=== QA Review Report ==="
      echo "Target: ${LOBSTER_ARG_REVIEW_TARGET}"
      echo "Type: ${LOBSTER_ARG_REVIEW_TYPE}"
      echo "Status: See QA response above"
      echo ""
      echo "Pipeline complete. Review QA findings for action items."

  - id: notify_failed
    name: "Review Failed"
    run: |
      echo "❌ QA review failed. Check error logs and retry."
