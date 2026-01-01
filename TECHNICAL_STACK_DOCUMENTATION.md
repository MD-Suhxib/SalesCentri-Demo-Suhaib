# SalesCentri Technical Stack Documentation

## Overview
This document provides a comprehensive technical breakdown of the SalesCentri platform, covering both the main website and the SalesGPT solution (`/solutions/psa-suite-one-stop-solution`).

---

## 1. MAIN WEBSITE TECHNICAL STACK

### Frontend Technology Stack
- **Framework**: Next.js 15.5.0 (React 19.1.0)
- **Language**: TypeScript 5.x
- **Styling**: 
  - TailwindCSS 4.x
  - PostCSS 4.x for processing
  - Custom CSS modules with glass morphism effects
  - Google Fonts integration (Poppins, Inter, DM Sans)

### UI/UX Components & Libraries
- **3D Graphics**: 
  - Three.js (0.167.1) 
  - React Three Fiber (@react-three/fiber 9.2.0)
  - React Three Drei (@react-three/drei 10.6.0)
  - Post-processing effects (postprocessing 6.37.6)
- **Animations**:
  - Framer Motion (12.23.9)
  - GSAP (3.13.0)
  - Custom CSS animations with blur and glow effects
  - Lenis smooth scrolling (@studio-freight/lenis 1.0.42)
- **UI Components**:
  - Lucide React icons (0.525.0)
  - Swiper.js (11.2.10) for carousels
  - Custom glass morphism components
  - React Intersection Observer (9.16.0)

### Backend Architecture
- **Runtime**: Node.js
- **Framework**: Next.js App Router (Server Components)
- **API Routes**: RESTful APIs built with Next.js API routes
- **Email Service**: Nodemailer (7.0.5) for contact forms and notifications

### Content Management
- **CMS**: Sanity.io (4.3.0)
- **Blog System**: WordPress.com integration via REST API
- **Markdown Processing**: @wcj/markdown-to-html (3.0.4)
- **Static Generation**: Next.js ISR (Incremental Static Regeneration)

### Database & Storage
- **Primary Database**: File-based storage system
- **Content Storage**: Sanity.io for structured content
- **Blog Content**: WordPress.com via REST API
- **Static Assets**: Vercel/Next.js built-in optimization

### Deployment & Infrastructure
- **Hosting**: Vercel (implied from next.config.ts)
- **CDN**: Vercel Edge Network
- **Environment**: Serverless functions
- **Domain Management**: Custom routing with middleware
- **SSL**: Automatic HTTPS via Vercel

### SEO & Performance
- **Meta Management**: Next.js built-in SEO optimization
- **Sitemap**: Dynamic sitemap generation (`sitemap.ts`)
- **Image Optimization**: Next.js Image component with WebP support
- **Performance**: 
  - Code splitting via Next.js
  - Bundle optimization with Turbopack
  - Dynamic imports for component loading

---

## 2. SALESGPT SOLUTION TECHNICAL STACK

### AI & Machine Learning Infrastructure
- **Primary LLM Providers**:
  - **Google Gemini**: Models include Gemini-2.0-flash, Gemini-2.5-flash, Gemini-1.5-flash
  - **OpenAI**: GPT-4o-mini, GPT-3.5-turbo for fallback and specific tasks
- **AI Framework**: LangChain ecosystem
  - @langchain/core (0.3.66)
  - @langchain/community (0.3.49)
  - @langchain/openai (0.6.3)
  - @langchain/google-genai (0.2.16)
  - @langchain/google-vertexai (0.2.16)
  - @langchain/langgraph (0.4.2)
  - @langchain/tavily (0.1.4)
  - @langchain/textsplitters (0.1.0)

### Vector Database & RAG System
- **Vector Store**: MemoryVectorStore (in-memory for development)
- **Embeddings**: Google Generative AI Embeddings
- **Document Processing**: 
  - CheerioWebBaseLoader for web scraping
  - RecursiveCharacterTextSplitter for text chunking
  - Contextual compression retrieval
- **Search Integration**: ChromaDB (3.0.9) for vector storage
- **RAG Pipeline**: Custom RAG system with contextual compression

### Web Search & Research Capabilities
- **Primary Search**: Tavily Search API (@langchain/tavily)
- **Fallback Search**: DuckDuckGo API
- **SerpApi**: Google Search API integration
- **Web Scraping**: Cheerio-based content extraction
- **Multi-provider Search**: Intelligent routing between search providers

### Chat & Memory Management
- **Chat Memory**: LangChain memory management with conversation persistence
- **Context Management**: Custom orchestration system
- **Session Handling**: File-based chat memory storage (`chat-memory.txt`)
- **Conversation Summarization**: Automated chat summarization

### API Integrations & Third-Party Services
- **Search APIs**:
  - Tavily Search API
  - Google Search API (SerpApi)
  - DuckDuckGo Instant Answer API
- **AI APIs**:
  - Google Gemini API (@google/genai 1.10.0, @google/generative-ai 0.24.1)
  - OpenAI API
- **Fuzzy Matching**: Fuzzball (2.2.2) for text similarity
- **UUID Generation**: UUID (11.1.0) for session management

### Data Processing & Analytics
- **Lead Generation**: Custom research agent with buyer-intent query generation
- **Company Analysis**: Automated company research and competitive analysis
- **ICP Development**: Ideal Customer Profile generation
- **Data Enrichment**: Multi-source data aggregation
- **Knowledge Base**: Company knowledge system with contextual search

### Authentication & Security
- **Auth System**: Custom authentication with JWT-style tokens
- **User Profiles**: Comprehensive user and organization profiling
- **Query Limiting**: Rate limiting and usage tracking
- **Session Management**: Secure session handling with token validation

### Specialized AI Modules
- **Smart Router**: Intelligent query routing based on intent analysis
- **Research Agent**: Multi-step research orchestration
- **LLM Router**: Dynamic model selection based on task complexity
- **Onboarding Router**: Conversational onboarding flow
- **Progress Emitter**: Real-time progress tracking for long-running tasks

### Frontend Chat Interface
- **Real-time Chat**: WebSocket-style communication
- **Typing Indicators**: Live typing animation
- **Message Rendering**: Markdown support with syntax highlighting
- **Progress Tracking**: Visual progress indicators for research tasks
- **Source Attribution**: Detailed source tracking and display

### Performance & Scalability
- **Caching**: Multi-level caching strategy
- **Streaming**: Real-time response streaming
- **Error Handling**: Comprehensive error recovery and fallback systems
- **Timeout Management**: Intelligent timeout handling for API calls
- **Memory Management**: Efficient memory usage with cleanup

---

## 3. SHARED INFRASTRUCTURE

### Code Quality & Development
- **Linting**: ESLint with Next.js configuration
- **Type Safety**: Full TypeScript implementation
- **Package Management**: PNPM for dependency management
- **Build System**: Next.js with Turbopack for development

### Monitoring & Analytics
- **Performance Monitoring**: Next.js built-in analytics
- **Error Tracking**: Console-based logging with structured error handling
- **Usage Analytics**: Custom query tracking and user behavior analysis

### Environment Configuration
- **Environment Variables**: Comprehensive .env.local configuration
- **API Keys Management**: Secure API key handling for multiple services
- **Configuration**: Centralized configuration management

### Data Management
- **Knowledge Base**: Structured company and industry knowledge
- **Chat Persistence**: Conversation history and memory management
- **User Data**: Profile and onboarding data management
- **Research Data**: Cached research results and company analysis

---

## 4. KEY TECHNICAL FEATURES

### Advanced AI Capabilities
- **Multi-Model Orchestration**: Intelligent routing between Gemini and OpenAI
- **Context-Aware Responses**: User profile and company context integration
- **Research Automation**: Automated lead generation and company research
- **Web Search Integration**: Real-time web search with source attribution
- **Conversation Memory**: Persistent conversation context and history

### Performance Optimizations
- **Edge Computing**: Vercel Edge Functions for global performance
- **Image Optimization**: Automatic WebP conversion and responsive images
- **Code Splitting**: Automatic code splitting and lazy loading
- **Bundle Optimization**: Tree shaking and dependency optimization

### User Experience
- **Responsive Design**: Mobile-first responsive design
- **Smooth Animations**: Hardware-accelerated animations
- **Real-time Feedback**: Live progress indicators and typing animations
- **Accessibility**: WCAG compliance and keyboard navigation

---

## 5. ENVIRONMENT VARIABLES & CONFIGURATION

### Required API Keys
```env
# AI Services
GEMINI_API_KEY=
OPENAI_API_KEY=

# Search Services
TAVILY_API_KEY=
SERPAPI_KEY=

# Content Management
SANITY_PROJECT_ID=
SANITY_DATASET=
WORDPRESS_SITE_ID=

# Infrastructure
NEXT_PREVIEW_SECRET=
VERCEL_URL=
```

### Configuration Files
- `next.config.ts` - Next.js configuration with redirects and image optimization
- `tsconfig.json` - TypeScript configuration
- `eslint.config.mjs` - ESLint rules and settings
- `postcss.config.mjs` - PostCSS and TailwindCSS processing
- `package.json` - Dependencies and scripts

---

## 6. DEPLOYMENT ARCHITECTURE

### Production Environment
- **Platform**: Vercel Cloud Platform
- **Runtime**: Node.js 18+ serverless functions
- **Database**: Serverless architecture with file-based storage
- **CDN**: Global edge network for static assets
- **SSL**: Automatic HTTPS with certificate management

### Development Workflow
- **Local Development**: Next.js development server with hot reload
- **Build Process**: Static generation with dynamic API routes
- **Testing**: Component-based testing with TypeScript validation
- **Deployment**: Git-based deployment with automatic builds

---

This documentation represents the current state of the SalesCentri platform as of September 2025, showcasing a modern, AI-powered sales automation platform built with cutting-edge web technologies and advanced AI capabilities.
