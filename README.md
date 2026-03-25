# knowmine-graphs

> Node.js library to generate JSON data sources for **KnowMine** dashboard graph widgets.

`knowmine-graphs` is used by backend APIs that power the graph widgets in the [KnowMine app](https://knowmine.littlecakemedia.com) — a fully customizable dashboard builder for iOS and Android.

---

## Installation

```bash
npm install knowmine-graphs
```

**Requirements:** Node.js ≥ 18.0.0 · ESM only

---

## Overview

The library has three independent layers:

| Layer | Import | Description |
|-------|--------|-------------|
| **Renderer** | `'knowmine-graphs'` | Pure functions — generate widget DTOs |
| **Helpers** | `'knowmine-graphs'` | Color presets, data normalization, validation |
| **Monitoring** | `'knowmine-graphs/monitoring'` | Optional — live server metrics + ready-made charts |

All outputs comply with the KnowMine Graph Widget DTO Specification.

---

## Quick Start

```js
import { makeBarChart, gradient, makeYAxisLabels } from 'knowmine-graphs';

const dto = makeBarChart({
  name: 'Monthly Sales',
  values: [8, 14, 10, 18, 12, 22],
  barColor: gradient.blue,
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  yAxisLabels: makeYAxisLabels(0, 22, 3),
  yAxisPosition: 'LEFT',
  backgroundColor: { type: 'Fill', primaryColor: '#1A1A2E' },
  backgroundType: 'ROUND_RECT',
});

res.json(dto); // directly usable by the KnowMine app
```

---

## Widget Types

| Function | type value | Size | Description |
|----------|-----------|------|-------------|
| `makeBarChart` | `BarChart` | 2×1 | Vertical bar chart with highlight support |
| `makePieChart` | `PieChart` | 1×1, 2×1 | Pie or donut chart with optional legend |
| `makeAreaChart` | `AreaChart` | 2×1 | Area chart with gradient fill |
| `makeTimeSeriesLineChart` | `TimeSeriesLineChart` | 2×1 | Time series line with optional grid |
| `makeStackedBarChart` | `StackedBarChart` | 2×1 | Multi-series stacked bar chart |
| `makeRadialGauge` | `RadialGauge` | 1×1 | Arc gauge with thresholds and ticks |
| `makeRadialGaugeLarge` | `RadialGaugeLarge` | 2×1 | 2 or 3 side-by-side radial gauges |
| `makeCircularProgress` | `CircularProgress` | 1×1 | 360° progress ring |
| `makeKPIMetric` | `KPIMetric` | 1×1 | KPI value with trend indicator and sparkline |

---

## Renderers

### Common Envelope Fields

All widget DTOs share these top-level fields. Pass them alongside the chart-specific parameters.

| Field | Type | Default | Notes |
|-------|------|---------|-------|
| `name` | `string\|null` | `null` | Display name shown in the dashboard (user-overridable in-app) |
| `version` | `string` | `'1.0'` | DTO format version — reserved for future compatibility |
| `refreshInterval` | `number` | `30` | Auto-refresh interval in seconds. Min: 5, Max: 60 |
| `backgroundColor` | `ColorSpec\|null` | `null` | Background color of the widget container |
| `backgroundType` | `string` | `'NONE'` | Background shape. See valid values below |
| `borderColor` | `string\|null` | `null` | Hex string or page palette key |
| `shadowColor` | `string\|null` | `null` | Hex string or page palette key |

**Valid `backgroundType` values:** `NONE`, `RECT`, `ROUND_RECT`, `ROUND_RECT_TL`, `ROUND_RECT_TR`, `ROUND_RECT_BL`, `ROUND_RECT_BR`, `ROUND_RECT_TL_NEG`, `ROUND_RECT_TR_NEG`, `ROUND_RECT_BL_NEG`, `ROUND_RECT_BR_NEG`, `ROUND_RECT_OPP_1`, `ROUND_RECT_OPP_2`, `ROUND_RECT_TOP`, `ROUND_RECT_LEFT`, `ROUND_RECT_BOTTOM`, `ROUND_RECT_RIGHT`, `SMALL_ROUND_RECT`

**`namePosition` values** (shared by all chart types):
`TOP` *(default)*, `TOP_LEFT`, `TOP_RIGHT`, `BOTTOM_LEFT`, `BOTTOM`, `BOTTOM_RIGHT`

**`yAxisPosition` values** (for charts with a Y axis):

| Value | Behavior |
|-------|----------|
| absent / `null` / `"NONE"` | No labels, auto-scale |
| `"AUTO"` | Auto-scale, labels auto-generated from actual data range (`yAxisLabels` ignored) |
| `"LEFT"` | Labels on the left. Fixed scale if both `yMin`+`yMax` provided, otherwise auto-scale with auto-generated labels |
| `"RIGHT"` | Labels on the right. Same scale logic as `LEFT` |
| `"BOTH"` | Labels on both sides. Same scale logic as `LEFT` |

> When `yAxisPosition` is `LEFT`/`RIGHT`/`BOTH` but `yMin`/`yMax` are absent, the widget falls back to auto-scale and auto-generates labels from the actual data range (provided `yAxisLabels` are ignored).

---

### makeBarChart

Vertical bar chart. Supports a single highlighted bar and optional Y-axis labels.

| Parameter | Type | Required | Default | Notes |
|-----------|------|:---:|---------|-------|
| `values` | `number[]` | ✅ | — | Bar values. At least one required |
| `barColor` | `ColorSpec` | | `gradient.blue` | Color/gradient applied to all standard bars |
| `highlightIndex` | `number\|null` | | `null` | 0-based index of the bar to highlight |
| `highlightColor` | `ColorSpec\|null` | | `null` | Required when `highlightIndex` is set |
| `labels` | `string[]\|null` | | `null` | Text labels centered below each bar |
| `labelColor` | `ColorSpec\|null` | | `null` | Label color. Used only when `labels` is set |
| `yAxisLabels` | `string[]\|null` | | `null` | Y-axis labels from bottom to top. Used only with `LEFT`/`RIGHT`/`BOTH` + `yMin`/`yMax` |
| `yAxisPosition` | `string\|null` | | `null` | Where to render Y-axis labels. See `yAxisPosition` values table above |
| `yAxisLabelColor` | `ColorSpec\|null` | | `null` | Y-axis label color |
| `yMin` | `number\|null` | | `null` | Scale minimum. Enables fixed scale when set together with `yMax` |
| `yMax` | `number\|null` | | `null` | Scale maximum. Enables fixed scale when set together with `yMin` |
| `barSpacing` | `number` | | `4` | Gap in points between bars |
| `cornerRadius` | `number` | | `6` | Bar corner radius in points |
| `showGlow` | `boolean` | | `false` | Glow effect on the highlighted bar |
| `horizontalPadding` | `number` | | `12` | Horizontal inner padding of the canvas |
| `verticalPadding` | `number` | | `10` | Vertical inner padding of the canvas |
| `nameFont` | `FontModel\|null` | | `null` | Widget title font and color |
| `namePosition` | `string` | | `'TOP'` | Widget title position |

```js
import { makeBarChart, gradient, fill, makeYAxisLabels } from 'knowmine-graphs';

const dto = makeBarChart({
  name: 'Monthly Sales',
  values: [8, 14, 10, 18, 12, 22],
  barColor: gradient.blue,
  highlightIndex: 5,
  highlightColor: fill.orange,
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  labelColor: fill.dimWhite,
  yAxisLabels: makeYAxisLabels(0, 22, 3),
  yAxisPosition: 'LEFT',
  yAxisLabelColor: fill.dimWhite,
  yMin: 0,
  yMax: 22,
  barSpacing: 4,
  cornerRadius: 6,
  showGlow: false,
  namePosition: 'TOP',
  backgroundColor: { type: 'Fill', primaryColor: '#1A1A2E' },
  backgroundType: 'ROUND_RECT',
  refreshInterval: 30,
});
```

---

### makePieChart · makeSlice

Full pie or donut chart. In the 2×1 widget size, the app automatically renders a legend on
the right with up to 5 slices (extras are aggregated as "Others").

| Parameter | Type | Required | Default | Notes |
|-----------|------|:---:|---------|-------|
| `slices` | `SliceSpec[]` | ✅ | — | Array of slices drawn clockwise from −90° |
| `innerRadiusRatio` | `number` | | `0.0` | `0` = full pie, `0.5` = donut. Range: 0–0.9 |
| `sliceSpacing` | `number` | | `3` | Physical gap in points between slices |
| `outerPadding` | `number` | | `10` | Padding between pie edge and canvas |
| `showGlow` | `boolean` | | `false` | Glow effect on each slice |
| `glowColor` | `ColorSpec\|null` | | `null` | Glow color. Used only when `showGlow` is true |
| `showPercentage` | `boolean` | | `false` | Show percentage next to each legend entry |
| `nameFont` | `FontModel\|null` | | `null` | Widget title font and color |
| `namePosition` | `string` | | `'TOP'` | Widget title position |

**`makeSlice({ value, color, label?, labelColor? })`** — helper to build a single slice.

| Parameter | Type | Required | Notes |
|-----------|------|:---:|-------|
| `value` | `number` | ✅ | Slice value (auto-normalized to total) |
| `color` | `ColorSpec` | ✅ | Slice color/gradient |
| `label` | `string\|null` | | Legend label. Slices without a label are hidden in the legend |
| `labelColor` | `ColorSpec\|null` | | Legend label color |

```js
import { makePieChart, makeSlice, gradient, solidColor } from 'knowmine-graphs';

const dto = makePieChart({
  name: 'Expense Breakdown',
  slices: [
    makeSlice({ value: 40, color: gradient.blue,   label: 'Rent',  labelColor: solidColor('#00FFFF') }),
    makeSlice({ value: 35, color: gradient.sunset, label: 'Food',  labelColor: solidColor('#FF8C00') }),
    makeSlice({ value: 25, color: gradient.purple, label: 'Other', labelColor: solidColor('#CC66FF') }),
  ],
  innerRadiusRatio: 0.5,
  sliceSpacing: 3,
  outerPadding: 10,
  showPercentage: true,
  namePosition: 'TOP',
  backgroundColor: { type: 'Fill', primaryColor: '#1A1A2E' },
  backgroundType: 'ROUND_RECT',
  refreshInterval: 30,
});
```

---

### makeAreaChart

Area chart with a top line and a vertically-gradient fill below it.
Ideal for trends over time with emphasis on the area under the curve.

| Parameter | Type | Required | Default | Notes |
|-----------|------|:---:|---------|-------|
| `values` | `number[]` | ✅ | — | Chronological values. Minimum 2 required |
| `lineColor` | `ColorSpec` | ✅ | — | Top line color |
| `areaColor` | `ColorSpec` | ✅ | — | Area fill gradient (opaque top → transparent bottom) |
| `baselineValue` | `number\|null` | | `null` | Baseline for the area. Defaults to min value |
| `glowColor` | `ColorSpec\|null` | | `null` | Glow color. Used only when `showGlow` is true |
| `lineWidth` | `number` | | `2.5` | Line thickness in points |
| `smoothingEnabled` | `boolean` | | `true` | Smooth Catmull-Rom curve vs. straight polyline |
| `showGlow` | `boolean` | | `false` | Glow effect on the line |
| `horizontalPadding` | `number` | | `12` | Horizontal inner padding of the canvas |
| `verticalPadding` | `number` | | `10` | Vertical inner padding of the canvas |
| `labels` | `string[]\|null` | | `null` | X-axis labels centered on each data point |
| `labelColor` | `ColorSpec\|null` | | `null` | Label color |
| `yAxisLabels` | `string[]\|null` | | `null` | Y-axis labels from bottom to top. Used only with `LEFT`/`RIGHT`/`BOTH` + `yMin`/`yMax` |
| `yAxisPosition` | `string\|null` | | `null` | Where to render Y-axis labels. See `yAxisPosition` values table above |
| `yAxisLabelColor` | `ColorSpec\|null` | | `null` | Y-axis label color |
| `yMin` | `number\|null` | | `null` | Scale minimum. Enables fixed scale when set together with `yMax` |
| `yMax` | `number\|null` | | `null` | Scale maximum. Enables fixed scale when set together with `yMin` |
| `nameFont` | `FontModel\|null` | | `null` | Widget title font and color |
| `namePosition` | `string` | | `'TOP'` | Widget title position |

```js
import { makeAreaChart, solidColor, fadeToTransparent, fill, makeYAxisLabels } from 'knowmine-graphs';

const dto = makeAreaChart({
  name: 'Weekly Temperature',
  values: [12, 15, 13, 18, 16, 22, 20],
  lineColor: solidColor('#00FFFF'),
  areaColor: fadeToTransparent('#00FFFF'),
  baselineValue: 10,
  lineWidth: 2.5,
  smoothingEnabled: true,
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  labelColor: fill.dimWhite,
  yAxisLabels: makeYAxisLabels(10, 22, 3),
  yAxisPosition: 'LEFT',
  yAxisLabelColor: fill.dimWhite,
  yMin: 10,
  yMax: 22,
  namePosition: 'TOP',
  backgroundColor: { type: 'Fill', primaryColor: '#1A1A2E' },
  backgroundType: 'ROUND_RECT',
  refreshInterval: 30,
});
```

---

### makeTimeSeriesLineChart

Time series line chart with a horizontal gradient on the line and an optional background grid.
Suited for real-time or historical data with a technical dashboard aesthetic.

| Parameter | Type | Required | Default | Notes |
|-----------|------|:---:|---------|-------|
| `values` | `number[]` | ✅ | — | Chronological values. Minimum 2 required |
| `lineColor` | `ColorSpec` | ✅ | — | Line gradient applied horizontally left→right |
| `areaColor` | `ColorSpec` | ✅ | — | Area fill gradient (vertical, opaque→transparent) |
| `gridColor` | `ColorSpec\|null` | | `Fill #FFFFFF26` | Grid line color. Used only when `showGrid` is true |
| `glowColor` | `ColorSpec\|null` | | `null` | Glow color. Used only when `showGlow` is true |
| `lineWidth` | `number` | | `2.5` | Line thickness in points |
| `showGrid` | `boolean` | | `true` | Renders the background grid |
| `smoothingEnabled` | `boolean` | | `true` | Smooth curve vs. straight polyline |
| `showGlow` | `boolean` | | `false` | Glow effect on the line |
| `gridRows` | `number` | | `4` | Number of horizontal grid lines |
| `gridColumns` | `number` | | `6` | Number of vertical grid lines |
| `horizontalPadding` | `number` | | `12` | Horizontal inner padding of the canvas |
| `verticalPadding` | `number` | | `10` | Vertical inner padding of the canvas |
| `labels` | `string[]\|null` | | `null` | X-axis labels centered on each data point |
| `labelColor` | `ColorSpec\|null` | | `null` | Label color |
| `yAxisLabels` | `string[]\|null` | | `null` | Y-axis labels from bottom to top. Used only with `LEFT`/`RIGHT`/`BOTH` + `yMin`/`yMax` |
| `yAxisPosition` | `string\|null` | | `null` | Where to render Y-axis labels. See `yAxisPosition` values table above |
| `yAxisLabelColor` | `ColorSpec\|null` | | `null` | Y-axis label color |
| `yMin` | `number\|null` | | `null` | Scale minimum. Enables fixed scale when set together with `yMax` |
| `yMax` | `number\|null` | | `null` | Scale maximum. Enables fixed scale when set together with `yMin` |
| `nameFont` | `FontModel\|null` | | `null` | Widget title font and color |
| `namePosition` | `string` | | `'TOP'` | Widget title position |

```js
import { makeTimeSeriesLineChart, gradient, fadeToTransparent, fill, makeYAxisLabels } from 'knowmine-graphs';

const dto = makeTimeSeriesLineChart({
  name: 'Energy Consumption',
  values: [10, 13, 11, 17, 15, 20, 18, 24],
  lineColor: gradient.blue,
  areaColor: fadeToTransparent('#00FFFF'),
  gridColor: { type: 'Fill', primaryColor: '#FFFFFF1A' },
  lineWidth: 2.5,
  showGrid: true,
  gridRows: 4,
  gridColumns: 6,
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon'],
  labelColor: fill.dimWhite,
  yAxisLabels: makeYAxisLabels(10, 24, 3),
  yAxisPosition: 'LEFT',
  yAxisLabelColor: fill.dimWhite,
  yMin: 10,
  yMax: 24,
  namePosition: 'TOP',
  backgroundColor: { type: 'Fill', primaryColor: '#1A1A2E' },
  backgroundType: 'ROUND_RECT',
  refreshInterval: 30,
});
```

---

### makeStackedBarChart · makeSeries

Stacked vertical bar chart. Each series contributes to the total height of the bar.
Corner radius is applied only to the top and bottom of the composed bar.

| Parameter | Type | Required | Default | Notes |
|-----------|------|:---:|---------|-------|
| `series` | `SeriesSpec[]` | ✅ | — | First = bottom segment, last = top segment. All series must have the same number of values |
| `cornerRadius` | `number` | | `6` | Corner radius on the top and bottom of the composed bar |
| `barSpacing` | `number` | | `4` | Gap in points between bars |
| `showGlow` | `boolean` | | `false` | Glow on the top segment of each bar |
| `horizontalPadding` | `number` | | `12` | Horizontal inner padding of the canvas |
| `verticalPadding` | `number` | | `10` | Vertical inner padding of the canvas |
| `labels` | `string[]\|null` | | `null` | Text labels centered below each bar |
| `labelColor` | `ColorSpec\|null` | | `null` | Label color |
| `yAxisLabels` | `string[]\|null` | | `null` | Y-axis labels from bottom to top. Used only with `LEFT`/`RIGHT`/`BOTH` + `yMin`/`yMax` |
| `yAxisPosition` | `string\|null` | | `null` | Where to render Y-axis labels. See `yAxisPosition` values table above |
| `yAxisLabelColor` | `ColorSpec\|null` | | `null` | Y-axis label color |
| `yMin` | `number\|null` | | `null` | Scale minimum. Enables fixed scale when set together with `yMax` |
| `yMax` | `number\|null` | | `null` | Scale maximum. Enables fixed scale when set together with `yMin` |
| `nameFont` | `FontModel\|null` | | `null` | Widget title font and color |
| `namePosition` | `string` | | `'TOP'` | Widget title position |

**`makeSeries(values, color)`** — helper to build a single series entry.

```js
import { makeStackedBarChart, makeSeries, gradient, fill, makeYAxisLabels } from 'knowmine-graphs';

const dto = makeStackedBarChart({
  name: 'Traffic by Category',
  series: [
    makeSeries([4, 6, 5, 8, 7, 9], gradient.blue),    // bottom segment
    makeSeries([3, 4, 3, 5, 4, 6], gradient.purple),   // middle segment
    makeSeries([2, 2, 3, 3, 2, 4], gradient.sunset),   // top segment
  ],
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  labelColor: fill.dimWhite,
  yAxisLabels: makeYAxisLabels(0, 19, 3),
  yAxisPosition: 'LEFT',
  yAxisLabelColor: fill.dimWhite,
  yMin: 0,
  yMax: 19,
  cornerRadius: 6,
  barSpacing: 4,
  namePosition: 'TOP',
  backgroundColor: { type: 'Fill', primaryColor: '#1A1A2E' },
  backgroundType: 'ROUND_RECT',
  refreshInterval: 30,
});
```

---

### makeRadialGauge · makeThreshold

Arc-based gauge with configurable opening angle. Displays the numeric value at the center.
Color thresholds override `gaugeColor` when the value falls within their range.

| Parameter | Type | Required | Default | Notes |
|-----------|------|:---:|---------|-------|
| `value` | `number` | ✅ | — | Current value (clamped to [minValue, maxValue]) |
| `minValue` | `number` | ✅ | — | Scale minimum |
| `maxValue` | `number` | ✅ | — | Scale maximum |
| `gaugeColor` | `ColorSpec` | ✅ | — | Arc color. Ignored when a threshold is active |
| `thresholds` | `ThresholdSpec[]` | | `[]` | Color zones overriding `gaugeColor` |
| `gaugeBackgroundColor` | `ColorSpec\|null` | | `Fill #FFFFFF26` | Background arc color (full track) |
| `glowColor` | `ColorSpec\|null` | | `null` | Glow on the arc. Used when `showGlow` is true |
| `valueTextColor` | `ColorSpec\|null` | | `Fill #FFFFFF` | Color of the center value and label text |
| `tickColor` | `ColorSpec\|null` | | `Fill #FFFFFF66` | Tick color. Used when `showTicks` is true |
| `gapAngle` | `number` | | `120` | Bottom gap in degrees. `0` = full circle, `120` = tachometer, `180` = semicircle |
| `lineWidth` | `number` | | `14` | Arc thickness in points |
| `showTicks` | `boolean` | | `false` | Graduation ticks along the arc |
| `showGlow` | `boolean` | | `false` | Glow on the progress arc |
| `label` | `string\|null` | | `null` | Descriptive text below the value (e.g. `'CPU'`, `'%'`). If absent, value is vertically centered |
| `nameFont` | `FontModel\|null` | | `null` | Widget title font and color |
| `namePosition` | `string` | | `'TOP'` | Widget title position |

**`makeThreshold(value, color)`** — helper to build a single threshold zone.
`value` is the upper bound of the zone; the app applies this color when the gauge value ≤ `value`.

```js
import { makeRadialGauge, makeThreshold, gradient, solidColor, fill } from 'knowmine-graphs';

const dto = makeRadialGauge({
  name: 'CPU Usage',
  value: 72,
  minValue: 0,
  maxValue: 100,
  gaugeColor: gradient.blue,
  thresholds: [
    makeThreshold(40,  solidColor('#00FF00')),  // green  0–40
    makeThreshold(80,  solidColor('#FF8C00')),  // orange 41–80
    makeThreshold(100, solidColor('#FF0000')),  // red    81–100
  ],
  gaugeBackgroundColor: fill.dimWhiteLow,
  valueTextColor: fill.white,
  gapAngle: 120,
  lineWidth: 14,
  showTicks: false,
  label: 'CPU',
  namePosition: 'TOP',
  backgroundColor: { type: 'Fill', primaryColor: '#1A1A2E' },
  backgroundType: 'ROUND_RECT',
  refreshInterval: 30,
});
```

---

### makeRadialGaugeLarge

Two or three side-by-side radial gauges sharing a single 2×1 widget with a common title.
Omit `gauge3` for a 2-gauge layout; include it for a 3-gauge layout.

Each gauge (`gauge1`, `gauge2`, `gauge3`) accepts the same parameters as `makeRadialGauge`
**excluding** `nameFont` and `namePosition` (managed at the payload level).

| Payload parameter | Type | Required | Default | Notes |
|-------------------|------|:---:|---------|-------|
| `gauge1` | `GaugeSpec` | ✅ | — | Left gauge |
| `gauge2` | `GaugeSpec` | ✅ | — | Center (3-gauge) or right (2-gauge) |
| `gauge3` | `GaugeSpec\|null` | | `null` | Optional right gauge |
| `nameFont` | `FontModel\|null` | | `null` | Shared widget title font and color |
| `namePosition` | `string` | | `'TOP'` | Shared widget title position |

**GaugeSpec fields:** `value`✅ `minValue`✅ `maxValue`✅ `gaugeColor`✅ — then optional: `thresholds`, `gaugeBackgroundColor`, `glowColor`, `valueTextColor`, `tickColor`, `gapAngle`, `lineWidth`, `showTicks`, `showGlow`, `label`.

```js
import { makeRadialGaugeLarge, gradient, fill, solidColor } from 'knowmine-graphs';

const gaugeDefaults = {
  minValue: 0,
  maxValue: 100,
  gaugeColor: gradient.blue,
  gaugeBackgroundColor: fill.dimWhiteLow,
  valueTextColor: fill.white,
  gapAngle: 120,
  lineWidth: 12,
};

const dto = makeRadialGaugeLarge({
  name: 'System Status',
  gauge1: { ...gaugeDefaults, value: 72, label: 'CPU' },
  gauge2: { ...gaugeDefaults, value: 45, label: 'RAM' },
  gauge3: { ...gaugeDefaults, value: 55, maxValue: 200, gaugeColor: gradient.sunset, label: 'Disk' },
  namePosition: 'TOP',
  backgroundColor: { type: 'Fill', primaryColor: '#1A1A2E' },
  backgroundType: 'ROUND_RECT',
  refreshInterval: 30,
});
```

---

### makeCircularProgress

Full 360° ring displaying a progress value from 0 to 1.
Shows a value or custom label at the center with an optional secondary caption.

| Parameter | Type | Required | Default | Notes |
|-----------|------|:---:|---------|-------|
| `progress` | `number` | ✅ | — | Progress value from `0.0` to `1.0` |
| `ringColor` | `ColorSpec` | ✅ | — | Progress arc color/gradient |
| `label` | `string\|null` | | `null` | Main center text. If absent, auto-percentage is shown |
| `ringBackgroundColor` | `ColorSpec\|null` | | `Fill #FFFFFF26` | Full 360° background ring color |
| `valueColor` | `ColorSpec\|null` | | `Fill #FFFFFF` | Main center text color |
| `caption` | `string\|null` | | `null` | Secondary text adjacent to the value |
| `captionPosition` | `'above'\|'below'` | | `'below'` | Caption position relative to the value |
| `captionColor` | `ColorSpec\|null` | | `Fill #FFFFFF99` | Caption text color |
| `lineWidth` | `number` | | `14` | Ring thickness in points |
| `showValue` | `boolean` | | `true` | Shows the text at the center of the ring |
| `showGlow` | `boolean` | | `false` | Glow on the progress arc |
| `nameFont` | `FontModel\|null` | | `null` | Widget title font and color |
| `namePosition` | `string` | | `'TOP'` | Widget title position |

```js
import { makeCircularProgress, gradient, fill, solidColor } from 'knowmine-graphs';

const dto = makeCircularProgress({
  name: 'Goal Completion',
  progress: 0.72,
  ringColor: gradient.blue,
  ringBackgroundColor: fill.dimWhiteLow,
  label: '72%',
  valueColor: fill.white,
  caption: 'Goal',
  captionPosition: 'below',
  captionColor: fill.dimWhite,
  lineWidth: 14,
  showValue: true,
  showGlow: false,
  namePosition: 'TOP',
  backgroundColor: { type: 'Fill', primaryColor: '#1A1A2E' },
  backgroundType: 'ROUND_RECT',
  refreshInterval: 30,
});
```

---

### makeKPIMetric

KPI display widget with a primary value, optional unit of measure, trend indicator
(up/down/neutral with percentage), and an embedded sparkline for historical context.

| Parameter | Type | Required | Default | Notes |
|-----------|------|:---:|---------|-------|
| `value` | `number` | ✅ | — | Primary KPI value |
| `valueColor` | `ColorSpec` | ✅ | — | Primary value text color |
| `unit` | `string\|null` | | `null` | Unit of measure shown next to the value (e.g. `'km'`, `'bpm'`, `'°C'`) |
| `trendPercentage` | `number\|null` | | `null` | Absolute percentage change |
| `trendDirection` | `'up'\|'down'\|'neutral'` | | `'neutral'` | Required when `trendPercentage` is set |
| `sparklineValues` | `number[]` | | `[]` | Historical values for the sparkline (min 2 if `showSparkline` is true) |
| `trendUpColor` | `ColorSpec\|null` | | `Fill #00FF00` | Trend indicator color for upward trends |
| `trendDownColor` | `ColorSpec\|null` | | `Fill #FF0000` | Trend indicator color for downward trends |
| `sparklineColor` | `ColorSpec\|null` | | — | Sparkline color/gradient. Required when `showSparkline` is true |
| `isInt` | `boolean` | | `false` | Round the value and display without decimal places |
| `showSparkline` | `boolean` | | `false` | Show the embedded sparkline |
| `showGlow` | `boolean` | | `false` | Glow on the sparkline |
| `nameFont` | `FontModel\|null` | | `null` | Widget title font and color |
| `namePosition` | `string` | | `'TOP'` | Widget title position |

```js
import { makeKPIMetric, fill, solidColor, fadeToTransparent } from 'knowmine-graphs';

const dto = makeKPIMetric({
  name: 'Steps Today',
  value: 8432,
  valueColor: fill.white,
  unit: 'steps',
  trendPercentage: 12.3,
  trendDirection: 'up',
  trendUpColor: solidColor('#00FF00'),
  trendDownColor: solidColor('#FF0000'),
  sparklineValues: [3200, 4100, 3800, 5600, 6200, 7400, 8432],
  sparklineColor: fadeToTransparent('#00FFFF'),
  isInt: true,
  showSparkline: true,
  showGlow: false,
  namePosition: 'TOP',
  backgroundColor: { type: 'Fill', primaryColor: '#1A1A2E' },
  backgroundType: 'ROUND_RECT',
  refreshInterval: 30,
});
```

---

## Helpers

### Color Helpers

```js
import { gradient, fill, palette, solidColor, gradientColor, fadeToTransparent } from 'knowmine-graphs';

// Predefined gradients
gradient.blue     // { type: 'Gradient', primaryColor: '#00FFFF', secondaryColor: '#0000FF' }
gradient.sunset
gradient.purple
gradient.neon
gradient.green
gradient.amber
gradient.red
// ...

// Predefined fills
fill.white
fill.dimWhite     // '#FFFFFF99' (semi-transparent)
fill.dimWhiteLow  // '#FFFFFF26' (low opacity)
// ...

// Page palette keys (resolved by the KnowMine app at render time)
palette.primary   // 'primary_color'
palette.accent    // 'accent_color'
// ...

// Factory functions
solidColor('#FF0000')             // { type: 'Fill', primaryColor: '#FF0000' }
gradientColor('#FF0000', '#00FF00') // { type: 'Gradient', ... }
fadeToTransparent('#00FFFF')      // gradient to #00000000
```

### Normalization Helpers

```js
import { normalizeRange, normalizeSum, makeYAxisLabels, clamp, round, formatBytes, toPercent } from 'knowmine-graphs';

normalizeRange([0, 50, 100])      // [0, 0.5, 1]
normalizeSum([1, 1, 2])           // [0.25, 0.25, 0.5]
makeYAxisLabels(0, 100, 3)        // ['0', '50', '100']
makeYAxisLabels(10, 22, 3)        // ['10', '16', '22']
clamp(150, 0, 100)                // 100
round(3.14159, 2)                 // 3.14
formatBytes(1024 * 1024)          // '1 MB'
toPercent(30, 200)                // 15
```

### Validation

Validation is **disabled by default** for production performance. Enable it during development to catch misconfigurations early:

```js
import { enableValidation } from 'knowmine-graphs';

enableValidation(); // call once at startup in development
```

When enabled, renderer functions throw descriptive errors for invalid inputs (wrong types, missing required fields, out-of-range values, etc.).

---

## Monitoring (Optional)

The monitoring layer collects server-level metrics and stores them in an in-memory ring buffer. You can then generate ready-made chart DTOs from live data.

### Starting the Monitor

```js
import { startMonitoring, ALL_COLLECTORS } from 'knowmine-graphs/monitoring';

const { stop } = startMonitoring({
  intervalMs: 10000,          // collect every 10 seconds
  bufferSize: 360,            // retain last 360 samples per metric (~1 hour at 10s)
  collectors: ALL_COLLECTORS, // or pick a subset: ['cpu', 'memory', 'heap']
  diskPath: '/',              // filesystem path for disk usage
});

// later...
stop();
```

### Available Collectors

| Key | Description | Platform |
|-----|-------------|----------|
| `cpu` | Aggregate CPU usage % across all cores | All |
| `memory` | System RAM + process heap | All |
| `swap` | System swap used/free/total/percent | Linux only |
| `diskIO` | Disk read/write bytes/sec | Linux only |
| `network` | Network RX/TX bytes/sec per interface | Linux only |
| `diskUsage` | Disk space used/free/total | All (Linux/macOS/Windows) |
| `loadAverage` | 1m / 5m / 15m system load averages | Linux/macOS |
| `eventLoop` | Node.js event loop lag (mean/max/p99 ms) | All |
| `gc` | Garbage collection count and pause time | All |

### Ready-Made Charts

All chart functions return a fully formed widget DTO ready to be passed to `res.json()`.
Every function accepts an optional configuration object — all parameters are optional.

#### Chart overview

| Function | Returns | Requires collector | Platform |
|----------|---------|-------------------|----------|
| `cpuTimeSeriesChart` | `TimeSeriesLineChart` | `cpu` | All |
| `ramGaugeChart` | `RadialGauge` | `memory` | All |
| `ramAreaChart` | `AreaChart` | `memory` | All |
| `ramKPIChart` | `KPIMetric` | `memory` | All |
| `swapKPIChart` | `KPIMetric` | `swap` | Linux |
| `swapGaugeChart` | `RadialGauge` | `swap` | Linux |
| `swapAreaChart` | `AreaChart` | `swap` | Linux |
| `heapKPIChart` | `KPIMetric` | `memory` | All |
| `heapAreaChart` | `AreaChart` | `memory` | All |
| `diskIOStackedChart` | `StackedBarChart` | `diskIO` | Linux |
| `diskIOAreaChart` | `AreaChart` | `diskIO` | Linux |
| `networkRxChart` | `AreaChart` | `network` | Linux |
| `networkTxChart` | `AreaChart` | `network` | Linux |
| `loadAverageBarChart` | `BarChart` | `loadAverage` | Linux/macOS |
| `loadAverageGaugeChart` | `RadialGaugeLarge` | `loadAverage` | Linux/macOS |
| `eventLoopTimeSeriesChart` | `TimeSeriesLineChart` | `eventLoop` | All |
| `eventLoopGaugeChart` | `RadialGauge` | `eventLoop` | All |
| `gcPauseBarChart` | `BarChart` | `gc` | All |
| `gcKPIChart` | `KPIMetric` | `gc` | All |
| `gcFrequencyAreaChart` | `AreaChart` | `gc` | All |

> Charts whose collector is not supported on the current platform return a `KPIMetric` placeholder with `unit: 'N/A'` instead of throwing.

---

#### `cpuTimeSeriesChart(opts?)`

Time-series line chart of aggregate CPU usage percentage over time.

By default the Y-axis is fixed at **0–100 %** with labels on **both sides** (`BOTH`).
Pass `auto: true` to switch to auto-scale mode, where the Y range fits the actual data.

```js
cpuTimeSeriesChart({
  name: 'CPU Usage',    // string — default: 'CPU Usage'
  maxPoints: 60,        // number — samples to display (default: 60)
  lineColor,            // ColorSpec — default: gradient.blue
  areaColor,            // ColorSpec — default: fadeToTransparent('#00FFFF')
  backgroundColor,      // ColorSpec — default: Fill #1A1A2E
  backgroundType,       // string — default: 'ROUND_RECT'
  refreshInterval,      // number — default: 10
  auto: false,          // boolean — default: false
                        //   false → fixed scale 0–100 %, yAxisPosition 'BOTH', yAxisLabels ['0','50','100']
                        //   true  → AUTO scale, Y fits actual data range, no fixed labels
})
```

Grid is enabled by default.

---

#### `ramGaugeChart(opts?)`

Radial gauge showing current system RAM usage percentage with color thresholds
(green < 60 %, orange < 85 %, red ≤ 100 %).

```js
ramGaugeChart({
  name: 'RAM',          // string — default: 'RAM'
  refreshInterval,      // number — default: 10
  backgroundColor,      // ColorSpec — default: Fill #1A1A2E
  backgroundType,       // string — default: 'ROUND_RECT'
})
```

#### `ramAreaChart(opts?)`

Area chart of system RAM usage percentage over time.

```js
ramAreaChart({
  name: 'RAM Usage',    // string — default: 'RAM Usage'
  maxPoints: 60,        // number — default: 60
  refreshInterval,      // number — default: 10
  backgroundColor,      // ColorSpec
  backgroundType,       // string — default: 'ROUND_RECT'
})
```

#### `ramKPIChart(opts?)`

KPI metric showing current system RAM used in MB with a sparkline and trend indicator.
Trend up (more RAM used) is orange; trend down (memory freed) is green.
Value corresponds to `MEM_USED` from `free -m` on Linux.

```js
ramKPIChart({
  name: 'RAM Used',     // string — default: 'RAM Used'
  maxPoints: 30,        // number — samples used for sparkline (default: 30)
  refreshInterval,      // number — default: 10
  backgroundColor,      // ColorSpec
  backgroundType,       // string — default: 'ROUND_RECT'
})
```

---

#### `swapKPIChart(opts?)` *(Linux only)*

KPI metric showing current swap used in MB with a sparkline and trend indicator.
Trend up (more swap used) is red; trend down (swap freed) is green.
Returns a `unit: 'N/A'` placeholder on non-Linux platforms or when no swap is configured.

```js
swapKPIChart({
  name: 'Swap Used',    // string — default: 'Swap Used'
  maxPoints: 30,        // number — samples used for sparkline (default: 30)
  refreshInterval,      // number — default: 10
  backgroundColor,      // ColorSpec
  backgroundType,       // string — default: 'ROUND_RECT'
})
```

#### `swapGaugeChart(opts?)` *(Linux only)*

Radial gauge showing current swap usage percentage with color thresholds
(green < 30 %, orange < 70 %, red ≤ 100 %).
Returns a gauge labeled `'N/A'` on non-Linux platforms or when no swap is configured.

```js
swapGaugeChart({
  name: 'Swap',         // string — default: 'Swap'
  refreshInterval,      // number — default: 10
  backgroundColor,      // ColorSpec
  backgroundType,       // string — default: 'ROUND_RECT'
})
```

#### `swapAreaChart(opts?)` *(Linux only)*

Area chart of swap usage percentage over time.
Returns a flat zero chart on non-Linux platforms or when no swap is configured.

```js
swapAreaChart({
  name: 'Swap Usage',   // string — default: 'Swap Usage'
  maxPoints: 60,        // number — default: 60
  refreshInterval,      // number — default: 10
  backgroundColor,      // ColorSpec
  backgroundType,       // string — default: 'ROUND_RECT'
})
```

---

#### `heapKPIChart(opts?)`

KPI metric showing current Node.js heap used in MB with a sparkline and trend indicator.
Trend is calculated against the previous sample (up = more heap used = orange, down = green).

```js
heapKPIChart({
  name: 'Heap',         // string — default: 'Heap'
  maxPoints: 30,        // number — samples used for sparkline (default: 30)
  refreshInterval,      // number — default: 10
  backgroundColor,      // ColorSpec
  backgroundType,       // string — default: 'ROUND_RECT'
})
```

#### `heapAreaChart(opts?)`

Area chart of Node.js heap used (in MB) over time.

```js
heapAreaChart({
  name: 'Heap Used',    // string — default: 'Heap Used'
  maxPoints: 60,        // number — default: 60
  refreshInterval,      // number — default: 10
  backgroundColor,      // ColorSpec
  backgroundType,       // string — default: 'ROUND_RECT'
})
```

---

#### `diskIOStackedChart(opts?)` *(Linux only)*

Stacked bar chart with read throughput (bottom, blue) and write throughput (top, sunset)
in MB/s per sample interval.

```js
diskIOStackedChart({
  name: 'Disk I/O',     // string — default: 'Disk I/O'
  maxPoints: 30,        // number — default: 30
  refreshInterval,      // number — default: 10
  backgroundColor,      // ColorSpec
  backgroundType,       // string — default: 'ROUND_RECT'
})
```

#### `diskIOAreaChart(opts?)` *(Linux only)*

Area chart of total disk throughput (read + write) in MB/s over time.

```js
diskIOAreaChart({
  name: 'Disk Throughput', // string — default: 'Disk Throughput'
  maxPoints: 60,            // number — default: 60
  refreshInterval,          // number — default: 10
  backgroundColor,          // ColorSpec
  backgroundType,           // string — default: 'ROUND_RECT'
})
```

---

#### `networkRxChart(opts?)` *(Linux only)*

Area chart of inbound (received) network bandwidth in KB/s over time.

```js
networkRxChart({
  name: 'Network RX',   // string — default: 'Network RX'
  maxPoints: 60,        // number — default: 60
  refreshInterval,      // number — default: 10
  backgroundColor,      // ColorSpec
  backgroundType,       // string — default: 'ROUND_RECT'
})
```

#### `networkTxChart(opts?)` *(Linux only)*

Area chart of outbound (transmitted) network bandwidth in KB/s over time.

```js
networkTxChart({
  name: 'Network TX',   // string — default: 'Network TX'
  maxPoints: 60,        // number — default: 60
  refreshInterval,      // number — default: 10
  backgroundColor,      // ColorSpec
  backgroundType,       // string — default: 'ROUND_RECT'
})
```

---

#### `loadAverageBarChart(opts?)` *(Linux/macOS only)*

Bar chart with three bars representing the 1m, 5m, and 15m Unix load averages.
The 1m bar is highlighted in red when it exceeds the number of CPU cores (overload condition).

```js
loadAverageBarChart({
  name: 'Load Average', // string — default: 'Load Average'
  refreshInterval,      // number — default: 30
  backgroundColor,      // ColorSpec
  backgroundType,       // string — default: 'ROUND_RECT'
})
```

#### `loadAverageGaugeChart(opts?)` *(Linux/macOS only)*

Three-gauge `RadialGaugeLarge` layout showing 1m, 5m, and 15m load averages.
Scale max = number of CPU cores. Threshold colors: green < 70 %, orange < 90 %, red ≤ 100 %.

```js
loadAverageGaugeChart({
  name: 'System Load',  // string — default: 'System Load'
  refreshInterval,      // number — default: 30
  backgroundColor,      // ColorSpec
  backgroundType,       // string — default: 'ROUND_RECT'
})
```

---

#### `eventLoopTimeSeriesChart(opts?)`

Time-series line chart of Node.js event loop mean lag in milliseconds.
A healthy server should stay below 10 ms. Values above 50 ms indicate blocking work.

```js
eventLoopTimeSeriesChart({
  name: 'Event Loop Lag', // string — default: 'Event Loop Lag'
  maxPoints: 60,          // number — default: 60
  warnMs: 10,             // number — warn threshold for axis scaling (default: 10)
  criticalMs: 50,         // number — critical threshold / axis max (default: 50)
  refreshInterval,        // number — default: 10
  backgroundColor,        // ColorSpec
  backgroundType,         // string — default: 'ROUND_RECT'
})
```

#### `eventLoopGaugeChart(opts?)`

Radial gauge showing the current event loop mean lag with color thresholds
(green < 10 ms, orange < 50 ms, red ≤ maxMs).

```js
eventLoopGaugeChart({
  name: 'Loop Lag',     // string — default: 'Loop Lag'
  maxMs: 100,           // number — full-scale value in ms (default: 100)
  refreshInterval,      // number — default: 10
  backgroundColor,      // ColorSpec
  backgroundType,       // string — default: 'ROUND_RECT'
})
```

---

#### `gcPauseBarChart(opts?)`

Bar chart of total GC pause duration (ms) accumulated per collection interval.
Each bar represents the total GC pause time in that monitoring period.

```js
gcPauseBarChart({
  name: 'GC Pauses',    // string — default: 'GC Pauses'
  maxPoints: 30,        // number — default: 30
  refreshInterval,      // number — default: 10
  backgroundColor,      // ColorSpec
  backgroundType,       // string — default: 'ROUND_RECT'
})
```

#### `gcKPIChart(opts?)`

KPI metric showing the average GC pause duration (`ms/gc`) with a sparkline of GC event counts.

```js
gcKPIChart({
  name: 'GC Stats',     // string — default: 'GC Stats'
  refreshInterval,      // number — default: 10
  backgroundColor,      // ColorSpec
  backgroundType,       // string — default: 'ROUND_RECT'
})
```

#### `gcFrequencyAreaChart(opts?)`

Area chart of GC event count per collection interval over time.
Useful for correlating GC pressure with other metrics.

```js
gcFrequencyAreaChart({
  name: 'GC Frequency', // string — default: 'GC Frequency'
  maxPoints: 60,        // number — default: 60
  refreshInterval,      // number — default: 10
  backgroundColor,      // ColorSpec
  backgroundType,       // string — default: 'ROUND_RECT'
})
```

---

#### Usage example

```js
import { startMonitoring } from 'knowmine-graphs/monitoring';
import {
  cpuTimeSeriesChart, ramGaugeChart, heapKPIChart,
  loadAverageGaugeChart, eventLoopGaugeChart,
  gcPauseBarChart,
} from 'knowmine-graphs/monitoring';

startMonitoring({ intervalMs: 10000, bufferSize: 360 });

// Express routes — each returns a KnowMine-compatible DTO
app.get('/widgets/cpu',        (req, res) => res.json(cpuTimeSeriesChart()));
app.get('/widgets/memory',     (req, res) => res.json(ramGaugeChart()));
app.get('/widgets/heap',       (req, res) => res.json(heapKPIChart()));
app.get('/widgets/load',       (req, res) => res.json(loadAverageGaugeChart()));
app.get('/widgets/event-loop', (req, res) => res.json(eventLoopGaugeChart()));
app.get('/widgets/gc',         (req, res) => res.json(gcPauseBarChart()));
```

### Direct Store Access

```js
import { store } from 'knowmine-graphs/monitoring';

const samples = store.get('cpu');       // all samples: [{ timestamp, value }, ...]
const last5   = store.last('cpu', 5);  // last 5 samples
const values  = store.values('cpu');   // raw values only: [number, ...]
```

### Custom Collectors

```js
import { store } from 'knowmine-graphs/monitoring';
import { makeKPIMetric } from 'knowmine-graphs';

// Push your own data into the store
setInterval(() => {
  store.push('myMetric', fetchMyValue());
}, 5000);

// Then generate a chart from it
const dto = makeKPIMetric({
  value: store.values('myMetric').at(-1) ?? 0,
  unit: 'req/s',
});
```

---

## TypeScript

Full TypeScript type definitions are included:

```ts
import type { BarChartDTO, ColorSpec, AnyWidgetDTO } from 'knowmine-graphs';
```

---

## License

MIT — see [LICENSE](./LICENSE)

---

## About

`knowmine-graphs` is the official backend data-source library for the **KnowMine** app.

- App: [knowmine.littlecakemedia.com](https://knowmine.littlecakemedia.com)
- iOS (TestFlight beta): [testflight.apple.com/join/tAHfjWzr](https://testflight.apple.com/join/tAHfjWzr)
- Source repository: [github.com/littlecakemedia/knowmine-graphs](https://github.com/littlecakemedia/knowmine-graphs)

Built by [LITTLECAKEMEDIA V.P.](https://littlecakemedia.com)
