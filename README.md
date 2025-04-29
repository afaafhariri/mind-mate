# 🧠 MindCare - Online Mental Health Tracker

**MindCare** is a simple, privacy-focused mental health tracking application that helps users monitor their emotional well-being through daily journal entries and sentiment analysis. Designed for ease of use and clarity, MindCare enables users to better understand their mental health over time.

## 🌟 Features

- 📅 **Daily Journal Entries**  
  Users can write daily reflections or logs in a secure space.

- 📊 **Sentiment Analysis**  
  Automatically detects and classifies journal entries as **Positive** or **Negative** to gauge mental state.

- 🔒 **Privacy First**  
  Data is stored securely. No sharing without consent.

- 📈 **Mood Trends**  
  Visual summaries to help track patterns in mental health over days/weeks.

- 🧩 **Tech Stack**
  - **Frontend**: Next.js
  - **Backend**: REST API
  - **Database**: PostgreSQL
  - **AI Model**: Custom lightweight NLP model for sentiment classification

## 🚀 Getting Started

### Prerequisites
- Node.js
- PostgreSQL instance
- Python / Jupyter Notebook (for training/updating sentiment model)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/afaafhariri/mindcare.git
   cd mindcare
2. **Start the frontend**
   ```bash
   cd next
   npm i
   npm run dev
3. **Start the model (on another terminal)**
   ```bash
   cd model
   python app.py

