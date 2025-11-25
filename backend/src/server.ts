import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 8080;

// Metrics tracking
let requestCount = 0;
let errorCount = 0;
const startTime = Date.now();
const responseTimes: number[] = [];

// Middleware to track requests
app.use((_req, res, next) => {
  const start = Date.now();
  requestCount++;
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    responseTimes.push(duration);
    if (responseTimes.length > 1000) {
      responseTimes.shift();
    }
    
    if (res.statusCode >= 400) {
      errorCount++;
    }
  });
  
  next();
});

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get(["/health", "/api/health"], (_req, res) => {
  res.json({
    status: "ok",
    time: new Date().toISOString(),
    service: "spartan-backend",
    uptime: process.uptime(),
  });
});

// API Routes
app.get("/api/hello", (_req, res) => {
  res.json({ message: "Hello from Spartan Capital — deployed by Luis Jorge" });
});

// Portfolio metrics endpoint
app.get("/api/portfolio/metrics", (_req, res) => {
  const now = new Date();
  const metrics = {
    totalValue: 1250000 + Math.random() * 50000,
    dailyChange: (Math.random() - 0.5) * 10000,
    dailyChangePercent: (Math.random() - 0.5) * 2,
    positions: [
      {
        symbol: "AAPL",
        shares: 150,
        price: 175.5 + Math.random() * 5,
        change: (Math.random() - 0.5) * 2,
      },
      {
        symbol: "GOOGL",
        shares: 80,
        price: 142.3 + Math.random() * 5,
        change: (Math.random() - 0.5) * 2,
      },
      {
        symbol: "MSFT",
        shares: 120,
        price: 380.2 + Math.random() * 5,
        change: (Math.random() - 0.5) * 2,
      },
      {
        symbol: "TSLA",
        shares: 200,
        price: 245.8 + Math.random() * 5,
        change: (Math.random() - 0.5) * 2,
      },
      {
        symbol: "NVDA",
        shares: 50,
        price: 485.6 + Math.random() * 5,
        change: (Math.random() - 0.5) * 2,
      },
    ],
    timestamp: now.toISOString(),
  };
  res.json(metrics);
});

// Performance data for charts
app.get("/api/portfolio/performance", (req, res) => {
  const days = parseInt(req.query.days as string) || 30;
  const data = [];
  const baseValue = 1200000;

  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toISOString().split("T")[0],
      value:
        baseValue +
        Math.sin(i / 5) * 50000 +
        Math.random() * 30000 +
        (days - i) * 200,
    });
  }

  res.json({ data, period: days });
});

// System metrics
app.get("/api/system/metrics", (_req, res) => {
  const memUsage = process.memoryUsage();
  const uptimeSeconds = process.uptime();
  const runtimeSeconds = (Date.now() - startTime) / 1000;
  
  // Calculate response time percentiles
  const sortedTimes = [...responseTimes].sort((a, b) => a - b);
  const getPercentile = (arr: number[], percentile: number) => {
    if (arr.length === 0) return 0;
    const index = Math.ceil((percentile / 100) * arr.length) - 1;
    return arr[Math.max(0, index)];
  };
  
  const avgResponseTime = responseTimes.length > 0
    ? Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length)
    : 0;
  
  const requestsPerSecond = runtimeSeconds > 0 ? (requestCount / runtimeSeconds).toFixed(2) : "0.00";
  const errorRate = requestCount > 0 ? ((errorCount / requestCount) * 100).toFixed(2) : "0.00";
  
  // Simulate CPU usage (in production, use os.loadavg() or similar)
  const cpuUsage = Math.min(100, Math.max(5, (memUsage.heapUsed / memUsage.heapTotal) * 100 + Math.random() * 10));
  
  res.json({
    memory: {
      used: Math.round(memUsage.heapUsed / 1024 / 1024),
      total: Math.round(memUsage.heapTotal / 1024 / 1024),
      external: Math.round(memUsage.external / 1024 / 1024),
    },
    cpu: {
      usage: Math.round(cpuUsage * 10) / 10,
    },
    requests: {
      total: requestCount,
      perSecond: parseFloat(requestsPerSecond),
      errors: errorCount,
      errorRate: parseFloat(errorRate),
    },
    responseTime: {
      average: avgResponseTime,
      p50: getPercentile(sortedTimes, 50),
      p95: getPercentile(sortedTimes, 95),
      p99: getPercentile(sortedTimes, 99),
    },
    uptime: Math.round(uptimeSeconds),
    nodeVersion: process.version,
    platform: process.platform,
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error("Error:", err);
    res
      .status(500)
      .json({ error: "Internal server error", message: err.message });
  }
);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Not found", path: req.path });
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
