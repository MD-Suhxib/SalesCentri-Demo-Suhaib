# Multi-GPT Environment Variables Complete Guide

## 📋 All Environment Variables Needed

### ✅ Currently Configured (From Your .env.local)

```env
# OpenAI (ChatGPT / GPT-4o)
OPENAI_API_KEY=sk-proj-...

# Google (Gemini)
GOOGLE_API_KEY=AIzaSy...

# Perplexity
PERPLEXITY_API_KEY=pplx-...

# Tavily (Web Search)
TAVILY_API_KEY=tvly-dev-...

# Groq (Llama/Mixtral)
GROQ_API_KEY=gsk_...

# xAI (Grok)
XAI_API_KEY=xai-...
```

### ⚠️ Missing (Optional but Recommended)

```env
# DeepSeek
DEEPSEEK_API_KEY=

# Anthropic (Claude)
ANTHROPIC_API_KEY=
```

---

## 🔑 Complete .env.local Template for Multi-GPT

```env
# ============================================================
# AI Model APIs - Multi-GPT Research Integration
# ============================================================

# 1. OPENAI (ChatGPT / GPT-4o) - REQUIRED
# Where to get: https://platform.openai.com/api-keys
# Format: Starts with "sk-"
# Example: sk-proj-...
OPENAI_API_KEY=sk-your_openai_key_here

# 2. GOOGLE (Gemini) - REQUIRED
# Where to get: https://aistudio.google.com/app/apikey
# Format: Alphanumeric string, starts with "AIza"
# Example: AIzaSy...
GOOGLE_API_KEY=AIza_your_google_key_here

# 3. PERPLEXITY - REQUIRED
# Where to get: https://www.perplexity.ai/settings/api
# Format: Starts with "pplx-"
# Example: pplx-...
PERPLEXITY_API_KEY=pplx-your_perplexity_key_here

# 4. TAVILY (Web Search Enhancement) - RECOMMENDED
# Where to get: https://tavily.com/
# Format: Alphanumeric string, starts with "tvly-"
# Example: tvly-dev-...
TAVILY_API_KEY=tvly-dev-your_tavily_key_here

# 5. GROQ (Llama/Mixtral Models) - RECOMMENDED
# Where to get: https://console.groq.com
# Format: Starts with "gsk_"
# Example: gsk_...
# Model: llama-3.1-70b-versatile
GROQ_API_KEY=gsk_your_groq_key_here

# 6. XAI (Grok Model) - RECOMMENDED
# Where to get: https://console.x.ai/
# Format: Starts with "xai-"
# Example: xai-...
# Model: grok-4-fast-reasoning
XAI_API_KEY=xai-your_xai_key_here

# 7. DEEPSEEK - OPTIONAL (for enhanced reasoning)
# Where to get: https://platform.deepseek.com/
# Format: Typically alphanumeric string
# Example: sk-...
# Model: deepseek-chat
DEEPSEEK_API_KEY=sk-your_deepseek_key_here

# 8. ANTHROPIC (Claude) - OPTIONAL (for premium analysis)
# Where to get: https://console.anthropic.com/
# Format: Starts with "sk-ant-"
# Example: sk-ant-...
# Model: claude-3-5-sonnet-20241022
ANTHROPIC_API_KEY=sk-ant-your_anthropic_key_here

# ============================================================
# Other Configurations
# ============================================================

# App Configuration
NEXT_PUBLIC_APP_URL=https://salescentri.com
NEXT_PUBLIC_DASHBOARD_URL=https://dashboard.salescentri.com
NEXT_PUBLIC_REQUIRE_LOCALHOST_REDIRECT=yes

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=1:your_app_id:web:your_web_id
```

---

## 📊 Model Specifications

### 1. **OPENAI_API_KEY** (Required)
```
API Provider: OpenAI
Model: gpt-4o (GPT-4 Omni)
Temperature: 0.3 (factual)
Max Tokens: 4000
Speed: ⚡⚡ Fast
Cost: $ Medium-High
Best For: Complex analysis, reasoning
```

### 2. **GOOGLE_API_KEY** (Required)
```
API Provider: Google AI
Model: Gemini 2.0 / Gemini Pro
Temperature: 0.3 (factual)
Max Tokens: 4000
Speed: ⚡⚡ Fast
Cost: $ Low
Best For: General research, web grounding
```

### 3. **PERPLEXITY_API_KEY** (Required)
```
API Provider: Perplexity AI
Model: sonar-deep-research
Temperature: 0.3 (factual)
Max Tokens: 4000
Speed: ⚡⚡ Fast
Cost: $ Medium
Best For: Real-time web search, current events
```

### 4. **TAVILY_API_KEY** (Recommended)
```
API Provider: Tavily
Model: Web Search Aggregation
Temperature: N/A
Max Tokens: Varies
Speed: ⚡ Very Fast
Cost: $ Low
Best For: Enhanced web search results
```

### 5. **GROQ_API_KEY** (Recommended)
```
API Provider: Groq Inc.
Model: llama-3.1-70b-versatile
Alternative: llama-3.1-8b-instant, mixtral-8x7b
Temperature: 0.3 (factual)
Max Tokens: 4000
Speed: ⚡⚡⚡ Very Fast
Cost: $ Very Low (free tier available)
Best For: High-performance inference, speed
```

### 6. **XAI_API_KEY** (Recommended)
```
API Provider: xAI
Model: grok-4-fast-reasoning
Temperature: 0.3 (factual)
Max Tokens: 4000
Speed: ⚡⚡ Fast
Cost: $ Low-Medium
Best For: Reasoning, analysis
```

### 7. **DEEPSEEK_API_KEY** (Optional)
```
API Provider: DeepSeek
Model: deepseek-chat
Temperature: 0.7 (default, should be 0.3 for research)
Max Tokens: 4000
Speed: ⚡⚡ Fast
Cost: $ Very Low
Best For: Cost-effective analysis
```

### 8. **ANTHROPIC_API_KEY** (Optional)
```
API Provider: Anthropic
Model: claude-3-5-sonnet-20241022
Temperature: 1.0 (default, should be 0.3 for research)
Max Tokens: 4000
Speed: ⚡⚡ Fast
Cost: $ Medium
Best For: Creative analysis, nuanced reasoning
```

---

## 🚀 How to Get Each API Key

### OpenAI (OPENAI_API_KEY)
1. Go to: https://platform.openai.com/api-keys
2. Click "Create new secret key"
3. Copy the key (format: `sk-proj-...`)
4. Add to `.env.local`

### Google (GOOGLE_API_KEY)
1. Go to: https://aistudio.google.com/app/apikey
2. Click "Create API Key"
3. Choose project or create new one
4. Copy the key (format: `AIza...`)
5. Add to `.env.local`

### Perplexity (PERPLEXITY_API_KEY)
1. Go to: https://www.perplexity.ai/settings/api
2. Click "Generate new API key"
3. Copy the key (format: `pplx-...`)
4. Add to `.env.local`

### Tavily (TAVILY_API_KEY)
1. Go to: https://tavily.com/
2. Sign up and get API key
3. Copy the key (format: `tvly-dev-...`)
4. Add to `.env.local`

### Groq (GROQ_API_KEY)
1. Go to: https://console.groq.com
2. Sign up and navigate to API Keys
3. Click "Generate API Key"
4. Copy the key (format: `gsk_...`)
5. Add to `.env.local`

### xAI (XAI_API_KEY)
1. Go to: https://console.x.ai/
2. Sign up and get API key
3. Copy the key (format: `xai-...`)
4. Add to `.env.local`

### DeepSeek (DEEPSEEK_API_KEY) - Optional
1. Go to: https://platform.deepseek.com/
2. Sign up and get API key
3. Copy the key
4. Add to `.env.local`

### Anthropic (ANTHROPIC_API_KEY) - Optional
1. Go to: https://console.anthropic.com/
2. Sign up and get API key
3. Copy the key (format: `sk-ant-...`)
4. Add to `.env.local`

---

## ✅ Configuration Priority

### Must Have (Core Multi-GPT)
- ✅ `OPENAI_API_KEY` - GPT-4o
- ✅ `GOOGLE_API_KEY` - Gemini
- ✅ `PERPLEXITY_API_KEY` - Web search

### Should Have (Enhanced Features)
- ✅ `GROQ_API_KEY` - Llama (very fast)
- ✅ `XAI_API_KEY` - Grok reasoning
- ✅ `TAVILY_API_KEY` - Better search

### Nice to Have (Extra Options)
- ⭕ `DEEPSEEK_API_KEY` - Alternative reasoning
- ⭕ `ANTHROPIC_API_KEY` - Claude analysis

---

## 🔍 API Key Validation

Your system automatically validates all keys. You'll see:

```
✅ Valid Providers:
   ✓ OpenAI/ChatGPT
   ✓ Google/Gemini
   ✓ Perplexity
   ✓ Tavily (Web Search)
   ✓ Groq (Llama/Mixtral)
   ✓ xAI (Grok)

❌ Invalid Providers:
   ✗ DeepSeek: DEEPSEEK_API_KEY environment variable is not set
   ✗ Anthropic: ANTHROPIC_API_KEY environment variable is not set
```

---

## 🛠️ Environment File Structure

### Recommended .env.local Layout
```env
# ===== AI APIs (Production Keys) =====
OPENAI_API_KEY=...
GOOGLE_API_KEY=...
PERPLEXITY_API_KEY=...
TAVILY_API_KEY=...
GROQ_API_KEY=...
XAI_API_KEY=...
DEEPSEEK_API_KEY=...        # Optional
ANTHROPIC_API_KEY=...       # Optional

# ===== App Configuration =====
NEXT_PUBLIC_APP_URL=...
NEXT_PUBLIC_DASHBOARD_URL=...

# ===== Firebase Configuration =====
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
# ... other Firebase vars
```

---

## 📝 DeepSeek Integration Details

### Current Implementation
```typescript
// deepseekApi.ts
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

export async function callDeepSeek(
  prompt: string,
  systemPrompt: string
): Promise<string> {
  const response = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      max_tokens: 4000,
      temperature: 0.7,  // ⚠️ Should be 0.3 for research
      stream: false
    })
  });
  // ... error handling
}
```

### ⚠️ Note: DeepSeek Temperature
- Current: 0.7 (creative)
- Recommended for research: 0.3 (factual)

---

## 🔐 Security Notes

1. **Never commit `.env.local`** - It contains sensitive API keys
2. **Check `.gitignore`** - Ensure `.env.local` is ignored
3. **Rotate keys regularly** - Especially if compromised
4. **Use production keys** - Different from development keys
5. **Restrict key permissions** - Limit API key usage to needed models only

---

## 🚀 Quick Setup Checklist

- [ ] Add `OPENAI_API_KEY` to `.env.local`
- [ ] Add `GOOGLE_API_KEY` to `.env.local`
- [ ] Add `PERPLEXITY_API_KEY` to `.env.local`
- [ ] Add `GROQ_API_KEY` to `.env.local`
- [ ] Add `XAI_API_KEY` to `.env.local`
- [ ] Add `TAVILY_API_KEY` to `.env.local`
- [ ] (Optional) Add `DEEPSEEK_API_KEY` to `.env.local`
- [ ] (Optional) Add `ANTHROPIC_API_KEY` to `.env.local`
- [ ] Restart dev server: `npm run dev`
- [ ] Check console for validation messages
- [ ] Test multi-GPT request

---

## 📞 Support

If API key setup fails:
1. Check key format matches expected pattern
2. Verify key is valid from provider's dashboard
3. Check key has sufficient quota/credits
4. Restart dev server after adding key
5. Check console logs for detailed error messages

Each provider's console shows:
- Key status (active/inactive)
- Usage quotas
- Rate limits
- Error logs
