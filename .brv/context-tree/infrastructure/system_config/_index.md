---
children_hash: e5a47b61092f56263258eb36e8f08dab61d5e0f2ec92f14c48bb94ffd5611673
compression_ratio: 0.905
condensation_order: 1
covers: [system_infrastructure.md]
covers_token_total: 200
summary_level: d1
token_count: 181
type: summary
---
# System Infrastructure Overview

This domain manages the core architectural configuration and memory persistence layers of the system. For comprehensive details, refer to the source entry `system_infrastructure.md`.

### Core Memory Architecture
The system utilizes a dual-layer memory strategy:
* **Memory-Core Plugin**: Employs SQLite with sqlite-vec for vector-based retrieval, currently indexing 455 chunks.
* **ByteRover Context Tree**: Acts as the primary semantic knowledge repository.
* **Embedding Model**: Utilizes OpenAI's `text-embedding-3-small`.

### Operational Infrastructure
* **Gateway**: Deployed as a systemd user service.
* **Dependencies**: Requires an active OpenAI API key for embedding operations.