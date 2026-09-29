# New Features Added

## 1. Advanced Sales Analytics
- Complete new dashboard available under "Analytics" section.
- Displays Total Revenue, Total Sales, Avg Selling Price, and Pending Payments.
- Bar chart visualising revenue by crop.
- Basic sales forecasting based on historical trend data.

## 2. Inventory Insights
- New "Inventory" tab added.
- Stock level breakdown visually graphed by crop.

## 3. e-Mandi AI Assistant
- Interactive Chatbot widget available in the lower right corner.
- Powered by a backend Chatbot API that accesses real analytics data.
- Built-in suggested prompts for easy interaction ("Show my sales summary", "What is my best-selling crop?").

## 4. Smart Insights on Dashboard
- Automatic dynamic insights generated from sales data are now displayed on the main dashboard overview page.

## 5. Historical Data Generation
- Added `DataSeeder` backend component to automatically populate 6 months of logical historical data for `ProduceLot`, `Sale`, `MarketPrice` upon starting up with an empty database.

## 6. Full Stack Integration
- New JPA Entities (`ProduceLot`, `Sale`, `Mandi`, `MarketPrice`).
- Custom aggregated SQL queries via `JpaRepository` for analytics.
- Real-time React API integration for dynamic charting and responses.
