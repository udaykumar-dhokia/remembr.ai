<p>
  <img src="https://drive.google.com/uc?export=view&id=1lOq-IQHEwsngXzNl6JO_CWFb-3iYN0Or" alt="" 
    width="150"
    height="150"
</p>

# Helping You Remember What Matters Most

## Objectives

- Develop an **AI-based platform** to assist dementia patients with memory recall.  
- Provide **continuous reminders and hints** tailored to individual needs.  
- Create a **user-friendly interface** accessible to both patients and caregivers.  
- Enhance **cognitive support** to manage daily life and reduce memory lapses.  
- Offer **caregiver tools** for tracking and supporting patient progress.  
- Evaluate the system’s **effectiveness** in improving memory recall and quality of life.

---

## Methodology

### Step 1: Memory Upload
Doctors upload photos and a short story describing a memory.

### Step 2: Embedding Generation
- Text is converted into **vector embeddings** using an AI model.
- Embeddings are stored in a **vector database** for semantic search.

### Step 3: AI Agent Interaction
- Patients are shown photos and asked to recall the story.
- AI compares patient responses to stored embeddings.
- If correct → AI confirms memory.  
  If incorrect → AI provides hints or prompts to try again.

### Step 4: Continuous Learning
AI continuously refines its understanding through a feedback loop, improving recall accuracy over time.

---

## Visual Workflow

> The workflow diagram below summarizes the entire system pipeline.

      ┌──────────────────────────────┐
      │ Doctor uploads memory photos │
      │ and story description        │
      └──────────────┬───────────────┘
                     │
                     ▼
       ┌────────────────────────────┐
       │ Story converted into       │
       │ vector embeddings          │
       └──────────────┬─────────────┘
                     │
                     ▼
       ┌────────────────────────────┐
       │ Embeddings stored in       │
       │ Vector Database (Pinecone) │
       └──────────────┬─────────────┘
                     │
                     ▼
       ┌────────────────────────────┐
       │ Patient views photo and    │
       │ attempts to recall memory  │
       └──────────────┬─────────────┘
                     │
                     ▼
       ┌────────────────────────────┐
       │ AI agent validates response│
       │ via vector similarity check│
       └──────────────┬─────────────┘
            ┌─────────┴─────────┐
            │                   │
     (✅ Yes - Correct)   (❌ No - Incorrect)
            │                   │
            ▼                   ▼

    ┌────────────────────┐ ┌───────────────────────────────┐
    │ Confirms memory is │ │ Provides hints and asks user  │
    │ recalled correctly │ │ to guess again                │
    └────────────────────┘ └───────────────────────────────┘

---

## Tech Stack

| Component | Technology Used | Purpose |
|------------|----------------|----------|
| **Backend** | Node.js, Express.js | API and business logic |
| **Frontend** | React.js | User interface for doctors and patients |
| **AI Models** | Python, Gemma, Google Gemini | Embedding generation and semantic understanding |
| **Database** | MongoDB | Patient and memory storage |
| **Vector DB** | Pinecone | Semantic search of embeddings |
| **Hosting** | Cloud Storage + Secure APIs | Image and data management |

---

## Outcomes (Till Date)

1. **Image Upload & Vectorization**  
   Successfully implemented photo upload and conversion of stories into vector embeddings for storage and retrieval.

2. **Reminiscence Therapy Agent**  
   Developed an AI-powered question-answer system that engages patients for memory recall.

3. **Response Analysis & Feedback**  
   Implemented timed response logic and integrated hints when incorrect answers are detected.

4. **Voice Detection Integration**  
   Added real-time speech input and analysis for natural recall sessions.

---

## Future Scope of Research

1. **On-Device Processing**  
   Edge-based AI for improved privacy and faster responses on personal devices.

2. **Privacy Enhancements**  
   Role-based access control, encryption, and secure cloud storage for sensitive memory data.

3. **AI Hallucination Mitigation**  
   Prevent false memory enforcement by verifying hints and embeddings before confirmation.

---


## References

1. *General Psychology* — Book by Baron  
2. Moon S., Lee J.M., Kang M., Kim K. M. (2020). “The effect of digital reminiscence therapy on people with dementia: A pilot study.” *The Open Nursing Journal.* [DOI:10.2174/1874434602014010231](https://doi.org/10.2174/1874434602014010231)  
3. Y Pu et al. (2025). “Reminiscence therapy delivery formats for older adults with dementia or mild cognitive impairment: A systematic review and network meta-analysis.” *Psychology Journal.* [ScienceDirect](https://www.sciencedirect.com/science/article/abs/pii/S002074892500094X)  
4. G.T. Grossberg et al. (2021). “A systematic, automated digital reminiscence therapy platform.” *Alzheimer’s Journal.* [Wiley Online Library](https://alz-journals.onlinelibrary.wiley.com/doi/10.1002/alz.054976)

---

> *"Using AI to bring back precious memories — one story at a time."*
