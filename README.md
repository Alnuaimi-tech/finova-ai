# FINOVA AI

**An AI-powered financial wellness platform for UAE students and young adults.**

FINOVA AI helps young people in the UAE understand and improve their financial health through a data-driven Financial Health Score, an AI financial coach grounded in real UAE living costs, a risk-free virtual investing simulator, and bite-sized financial literacy lessons.

## Features

- **Financial Health Score (0-100)** — a weighted scoring model (`src/lib/financialEngine.js`) combining savings rate, expense ratio, risky spending patterns, and emergency fund coverage, with a Low/Medium/High risk classification
- **AI Coach** — a custom AI agent (`finova_analyst`) with a UAE-specific system prompt covering local banking, RTA transport costs, and BNPL risks, dynamically grounded in the user's real financial profile
- **Live market data** — a scheduled backend function fetches real global indices, crypto, and forex prices (Twelve Data API), using a distributed lease/lock pattern and daily credit budgeting to safely respect third-party rate limits. UAE market data is shown via TradingView's official embeddable widgets where licensed (ADX), with DFM stocks clearly labeled as demo data given real-time DFM licensing isn't available at this project's scale
- **Virtual Portfolio** — practice UAE stock investing with virtual funds and live P&L tracking
- **Learn hub** — lessons on budgeting, emergency funds, debt, and UAE lifestyle costs, plus an investment-readiness check and a compound growth simulator
- **Bilingual (English/Arabic)** with full RTL layout support
- **Admin analytics dashboard** for usage tracking

## Architecture

Built on [Base44](https://base44.com), with:
- React frontend (`src/`)
- Serverless backend functions (`base44/functions/`) for market data fetching and PDF report generation
- A scheduled workflow for periodic price refreshes
- An entity data model: `FinancialProfile`, `VirtualHolding`, `AppEvent`, `ContactMessage`, `User`, each secured with role-based access control

## Author

Built by Ali Alnuaimi.

## Disclaimer

FINOVA AI is an educational tool. Market and portfolio data are for practice purposes and do not constitute investment advice.

---

## Running this locally

This project was built with [Base44](http://Base44.com) and can also be run locally.

**Prerequisites:**

1. Clone the repository using the project's Git URL
2. Navigate to the project directory
3. Install dependencies: `npm install`
4. Create an `.env.local` file and set the right environment variables

```
VITE_BASE44_APP_ID=your_app_id
VITE_BASE44_APP_BASE_URL=your_backend_url
```

Run the app: `npm run dev`

**Publish your changes**

Open [Base44.com](http://Base44.com) and click on Publish.

**Docs & Support**

Documentation: [https://docs.base44.com/Integrations/Using-GitHub](https://docs.base44.com/Integrations/Using-GitHub)
