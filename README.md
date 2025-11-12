# 📊 Competitive Intelligence Dashboard

A professional business intelligence dashboard for tracking real-time stock performance of major technology competitors. Built for deployment on Vercel with serverless architecture.

![Dashboard Preview](https://img.shields.io/badge/Status-Production%20Ready-success)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-black)
![WCAG](https://img.shields.io/badge/Accessibility-WCAG%20AA-blue)

## 🎯 Business Value

This dashboard provides business professionals with:
- **Real-time competitive intelligence** across major tech companies
- **Visual highlighting** of market leaders and laggards
- **Export functionality** for integration into reports and presentations
- **Professional presentation-ready** design suitable for executive briefings
- **Mobile-responsive** interface for on-the-go decision making

## 📈 Tracked Companies

- **Apple Inc.** (AAPL)
- **Microsoft Corporation** (MSFT)
- **Alphabet Inc. / Google** (GOOGL)
- **Meta Platforms Inc.** (META)
- **Amazon.com Inc.** (AMZN)

## 🏗️ Architecture

```
business-intelligence/
├── api/
│   └── stocks.js          # Serverless function for API calls
├── index.html             # Interactive frontend dashboard
├── vercel.json            # Vercel deployment configuration
└── README.md              # This file
```

### Technology Stack

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Backend**: Vercel Serverless Functions (Node.js)
- **API**: API Ninjas Stock Price API
- **Deployment**: Vercel
- **Design**: High-contrast, WCAG AA compliant

## 🚀 Deployment Instructions

### Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **API Ninjas Account**: Get your free API key at [api-ninjas.com](https://api-ninjas.com)
3. **Git Repository**: This project in a Git repository

### Step 1: Get Your API Key

1. Visit [API Ninjas](https://api-ninjas.com)
2. Sign up for a free account
3. Navigate to your profile to find your API key
4. Copy the API key for the next step

### Step 2: Deploy to Vercel

#### Option A: Deploy via Vercel Dashboard (Recommended)

1. Visit [vercel.com/new](https://vercel.com/new)
2. Import your Git repository
3. Configure your project:
   - **Framework Preset**: Other
   - **Build Command**: (leave empty)
   - **Output Directory**: (leave empty)
4. Add Environment Variable:
   - **Key**: `API_KEY`
   - **Value**: Your API Ninjas API key
5. Click "Deploy"

#### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from project directory
cd business-intelligence
vercel

# Add environment variable during deployment
# When prompted, add:
# API_KEY = your-api-ninjas-key

# Deploy to production
vercel --prod
```

### Step 3: Configure Environment Variables

If you didn't add the API key during initial deployment:

1. Go to your project in Vercel Dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add new variable:
   - **Key**: `API_KEY`
   - **Value**: Your API Ninjas API key
   - **Environment**: Production, Preview, Development
4. Click "Save"
5. Redeploy your application

### Step 4: Verify Deployment

1. Visit your deployed URL (e.g., `https://your-project.vercel.app`)
2. The dashboard should automatically load stock data
3. Test the "Refresh Data" button
4. Test the "Export to CSV" functionality
5. Verify mobile responsiveness

## 🔧 Local Development

To run the dashboard locally for testing:

```bash
# Install Vercel CLI
npm install -g vercel

# Clone the repository
git clone <your-repo-url>
cd business-intelligence

# Create .env file with your API key
echo "API_KEY=your-api-ninjas-key" > .env

# Run development server
vercel dev

# Open browser to http://localhost:3000
```

## 📱 Features

### Dashboard Capabilities

- ✅ **Real-time Data Fetching**: Automatic data load on page open
- ✅ **Manual Refresh**: One-click data refresh button
- ✅ **Visual Indicators**: Green highlight for highest price, red for lowest
- ✅ **Export to CSV**: Download data for external analysis and reporting
- ✅ **Loading States**: Professional loading animations
- ✅ **Error Handling**: Graceful error messages with retry capability
- ✅ **Responsive Design**: Optimized for desktop, tablet, and mobile
- ✅ **Keyboard Shortcuts**:
  - Press `R` to refresh data
  - Press `E` to export CSV
- ✅ **Accessibility**: WCAG AA compliant with high contrast and keyboard navigation

### API Function Features

- ✅ **Parallel Requests**: Fetches all stocks simultaneously for speed
- ✅ **Error Resilience**: Individual stock failures don't break entire request
- ✅ **Security**: API key stored as environment variable
- ✅ **CORS Support**: Proper headers for cross-origin requests
- ✅ **Detailed Logging**: Console logs for debugging
- ✅ **Data Validation**: Ensures data integrity before returning

## 🎨 Design Philosophy

The dashboard follows these design principles:

1. **High Contrast**: Ensures readability in various lighting conditions
2. **Professional Aesthetics**: Suitable for executive presentations
3. **Data-First**: Information hierarchy prioritizes key metrics
4. **Accessibility**: WCAG AA compliant for inclusive access
5. **Performance**: Lightweight vanilla JavaScript for fast load times
6. **Mobile-First**: Responsive design that works on all devices

## 🔒 Security Considerations

- API keys are stored as environment variables (never in code)
- Input sanitization prevents XSS attacks
- CORS configured for security
- No client-side API key exposure
- Serverless functions provide additional security layer

## 📊 Business Use Cases

1. **Executive Briefings**: Display real-time competitive landscape
2. **Investment Analysis**: Track technology sector performance
3. **Market Research**: Monitor competitor valuations
4. **Strategic Planning**: Analyze market trends and positioning
5. **Reporting**: Export data for quarterly reports and presentations

## 🐛 Troubleshooting

### Issue: "Unable to load data" error

**Solutions:**
- Verify API_KEY environment variable is set correctly
- Check API Ninjas account has available quota
- Verify API key is active (not expired)
- Check browser console for specific error messages

### Issue: No data appears after clicking Refresh

**Solutions:**
- Check browser network tab for failed requests
- Verify serverless function is deployed (`/api/stocks`)
- Test the API endpoint directly: `https://your-domain.vercel.app/api/stocks`
- Review Vercel function logs for errors

### Issue: CSV export not working

**Solutions:**
- Ensure data has been loaded first (click Refresh Data)
- Check browser allows downloads from the domain
- Try a different browser if issue persists

## 📈 Future Enhancements

Potential improvements for future versions:

- Historical data tracking and trend charts
- Price change calculations (% change over time)
- Customizable stock list
- Email/SMS alerts for price thresholds
- Integration with additional data sources
- Multi-currency support
- Dark/light theme toggle

## 🤝 Contributing

This is a production-ready business intelligence tool. For enhancements:

1. Fork the repository
2. Create a feature branch
3. Make your improvements
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is provided as-is for business intelligence purposes.

## 🙋 Support

For issues or questions:
1. Check the Troubleshooting section above
2. Review Vercel deployment logs
3. Verify API Ninjas service status
4. Check browser console for errors

## 🌟 Acknowledgments

- **API Ninjas** for providing reliable stock price data
- **Vercel** for serverless deployment platform
- Built with modern web standards for maximum compatibility

---

**Status**: Production Ready ✅
**Last Updated**: 2025-11-10
**Deployment**: Vercel Serverless
**Accessibility**: WCAG AA Compliant
