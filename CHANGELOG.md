# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [1.0.0] — 2026-03-23

### Added

- **Renderer layer** — 9 chart types: `BarChart`, `PieChart`, `AreaChart`, `TimeSeriesLineChart`, `StackedBarChart`, `RadialGauge`, `RadialGaugeLarge`, `CircularProgress`, `KPIMetric`
- **Helpers** — color presets (`gradient`, `fill`, `palette`), factory functions (`solidColor`, `gradientColor`, `fadeToTransparent`), normalization utilities (`normalizeRange`, `normalizeSum`, `makeYAxisLabels`, `clamp`, `round`, `formatBytes`, `toPercent`), optional input validation (`enableValidation`)
- **Monitoring layer** (`knowmine-graphs/monitoring`) — 8 metric collectors: CPU, Memory, Disk I/O, Network I/O, Disk Usage, Load Average, Event Loop Lag, GC Stats
- **Monitoring charts** — 16 ready-made chart functions powered by live server metrics
- **In-memory store** — `RingBuffer`-backed time-series store with automatic eviction
- **TypeScript definitions** — full type coverage in `types.d.ts`
- **Unit tests** — 115 tests using the Node.js built-in test runner (zero dependencies)
- **Examples** — `basic.js` and `monitoring.js`
