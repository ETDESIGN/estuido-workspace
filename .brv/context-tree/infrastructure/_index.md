---
children_hash: 728ca4fb222eab9ff9b98f7441e9ae8ae3f554e1ce8d889fb9018223be8a5877
compression_ratio: 0.609375
condensation_order: 2
covers: [comms_config/_index.md, system_config/_index.md]
covers_token_total: 448
summary_level: d2
token_count: 273
type: summary
---
# Infrastructure Domain Summary

This domain integrates communication configurations and system architecture to support platform operations. Detailed specifications are available in the referenced source entries.

## Communication Channels (comms_config)
Operational policies for multi-channel messaging are documented in `communication_channels.md`.
* WhatsApp: Manages three distinct accounts; the default is disabled, the personal account is restricted to E-project communication, and the Dereck account permits open DMs.
* Discord: Usage is strictly limited to designated, bound channels.

## System Infrastructure (system_config)
Core architectural and persistence layers are defined in `system_infrastructure.md`.
* Memory Strategy: Implements a dual-layer approach featuring a Memory-Core plugin (SQLite with sqlite-vec, 455 indexed chunks) and the ByteRover Context Tree for semantic storage.
* Technical Stack: Utilizes OpenAI `text-embedding-3-small` for vector operations.
* Deployment: The system gateway is managed as a systemd user service and requires an active OpenAI API key.