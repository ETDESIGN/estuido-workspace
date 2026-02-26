# 📓 NotebookLM Skill

**Description:** Use Google NotebookLM for research, audio summaries, and podcast generation.
**When to use:** When you need to analyze documents, generate audio overviews, or create podcasts from content.

---

## Setup

### 1. Get NotebookLM API Key
- Go to https://notebooklm.google.com 
- Enable API access (if available)
- Or use the unofficial package with OAuth

### 2. Install Package
```bash
npm install notebooklm
```

### 3. Environment Variables
```bash
export NOTEBOOKLM_API_KEY="your-key"
```

---

## Capabilities

| Feature | Description |
|---------|-------------|
| **Audio Overview** | Generate podcast-style audio from documents |
| **Source Analysis** | Analyze uploaded PDFs, URLs, Google Docs |
| **Summarization** | Create concise summaries of long content |
| **Q&A** | Ask questions against your sources |
| **Podcast** | Generate 2-speaker audio summary |

---

## Usage

### Generate Audio Overview
```
Use NotebookLM to create an audio overview from these documents: [paste content or URLs]
```

### Analyze Sources
```
Analyze these sources with NotebookLM and summarize key findings: [URLs or text]
```

### Create Podcast
```
Create a 2-speaker podcast summary of [topic/document]
```

---

## Cost
- NotebookLM API: Check Google pricing
- Unofficial package is free to use

---

## Token Efficiency
This skill is NOT auto-loaded. Only load when:
- User explicitly asks for NotebookLM
- Research task requires audio/podcast output
- Document analysis is needed

**Default: DISABLED** → Enable only on demand