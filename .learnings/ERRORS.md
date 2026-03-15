# Errors Log

Command failures, exceptions, and unexpected errors.

## Format

```markdown
## [ERR-YYYYMMDD-XXX] skill_or_command_name

**Logged**: ISO-8601 timestamp
**Priority**: low | medium | high | critical
**Status**: pending | in_progress | resolved | wont_fix
**Area**: frontend | backend | infra | tests | docs | config

### Summary
Brief description of what failed

### Error
\`\`\`
Actual error message
\`\`\`

### Context
- Command/operation attempted
- Input or parameters used

### Suggested Fix
What might resolve this

### Metadata
- Reproducible: yes | no | unknown
- Related Files: path/to/file.ext
- See Also: ERR-20250110-001
```

---

*Auto-generated entries go below this line*
---

