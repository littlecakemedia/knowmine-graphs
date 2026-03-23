/**
 * knowmine-graphs — TypeScript type definitions
 * Compatible with the KnowMine Graph Widget DTO specification v1.0
 */

// ---------------------------------------------------------------------------
// Shared types
// ---------------------------------------------------------------------------

/** Hex color string (#RRGGBB or #RRGGBBAA) or a page palette key. */
export type ColorString =
  | string
  | 'primary_color'
  | 'secondary_color'
  | 'background_color'
  | 'text_color'
  | 'accent_color'
  | 'custom_color';

/** Solid fill or two-color gradient color specification. */
export interface ColorSpec {
  type: 'Fill' | 'Gradient';
  primaryColor: ColorString;
  secondaryColor?: ColorString;
}

/** Widget title font and color configuration. */
export interface FontModel {
  font: string;
  color: {
    type: 'FILL' | 'GRADIENT' | 'NONE';
    color: ColorString;
    secondaryColor?: ColorString;
  };
}

/** Y-axis label position. */
export type YAxisPosition = 'LEFT' | 'RIGHT' | 'BOTH';

/** Widget title position relative to the chart. */
export type NamePosition =
  | 'TOP_LEFT'
  | 'TOP'
  | 'TOP_RIGHT'
  | 'BOTTOM_LEFT'
  | 'BOTTOM'
  | 'BOTTOM_RIGHT';

/** Widget background shape. */
export type BackgroundType =
  | 'NONE' | 'RECT' | 'ROUND_RECT'
  | 'ROUND_RECT_TL' | 'ROUND_RECT_TR' | 'ROUND_RECT_BL' | 'ROUND_RECT_BR'
  | 'ROUND_RECT_TL_NEG' | 'ROUND_RECT_TR_NEG' | 'ROUND_RECT_BL_NEG' | 'ROUND_RECT_BR_NEG'
  | 'ROUND_RECT_OPP_1' | 'ROUND_RECT_OPP_2'
  | 'ROUND_RECT_TOP' | 'ROUND_RECT_LEFT' | 'ROUND_RECT_BOTTOM' | 'ROUND_RECT_RIGHT'
  | 'SMALL_ROUND_RECT';

/** Common envelope fields present on every widget DTO. */
export interface WidgetEnvelope {
  nome: string | null;
  type: string;
  version: string | null;
  refreshInterval: number;
  backgroundColor: ColorSpec | null;
  backgroundType: BackgroundType;
  borderColor: ColorString | null;
  shadowColor: ColorString | null;
}

// ---------------------------------------------------------------------------
// BarChart
// ---------------------------------------------------------------------------

export interface BarChartPayload {
  values: number[];
  barColor: ColorSpec;
  highlightIndex: number | null;
  highlightColor: ColorSpec | null;
  labels: string[] | null;
  labelColor: ColorSpec | null;
  yAxisLabels: string[] | null;
  yAxisPosition: YAxisPosition | null;
  yAxisLabelColor: ColorSpec | null;
  barSpacing: number;
  cornerRadius: number;
  showGlow: boolean;
  horizontalPadding: number;
  verticalPadding: number;
  nameFont: FontModel | null;
  namePosition: NamePosition;
}

export interface BarChartDTO extends WidgetEnvelope {
  type: 'BarChart';
  payload: BarChartPayload;
}

// ---------------------------------------------------------------------------
// PieChart
// ---------------------------------------------------------------------------

export interface SliceSpec {
  value: number;
  color: ColorSpec;
  label: string | null;
  labelColor: ColorSpec | null;
}

export interface PieChartPayload {
  slices: SliceSpec[];
  innerRadiusRatio: number;
  sliceSpacing: number;
  outerPadding: number;
  showGlow: boolean;
  glowColor: ColorSpec | null;
  showPercentage: boolean;
  nameFont: FontModel | null;
  namePosition: NamePosition;
}

export interface PieChartDTO extends WidgetEnvelope {
  type: 'PieChart';
  payload: PieChartPayload;
}

// ---------------------------------------------------------------------------
// AreaChart
// ---------------------------------------------------------------------------

export interface AreaChartPayload {
  values: number[];
  baselineValue: number | null;
  lineColor: ColorSpec;
  areaColor: ColorSpec;
  glowColor: ColorSpec | null;
  lineWidth: number;
  smoothingEnabled: boolean;
  showGlow: boolean;
  horizontalPadding: number;
  verticalPadding: number;
  labels: string[] | null;
  labelColor: ColorSpec | null;
  yAxisLabels: string[] | null;
  yAxisPosition: YAxisPosition | null;
  yAxisLabelColor: ColorSpec | null;
  nameFont: FontModel | null;
  namePosition: NamePosition;
}

export interface AreaChartDTO extends WidgetEnvelope {
  type: 'AreaChart';
  payload: AreaChartPayload;
}

// ---------------------------------------------------------------------------
// TimeSeriesLineChart
// ---------------------------------------------------------------------------

export interface TimeSeriesLineChartPayload {
  values: number[];
  lineColor: ColorSpec;
  areaColor: ColorSpec;
  gridColor: ColorSpec | null;
  glowColor: ColorSpec | null;
  lineWidth: number;
  showGrid: boolean;
  smoothingEnabled: boolean;
  showGlow: boolean;
  gridRows: number;
  gridColumns: number;
  horizontalPadding: number;
  verticalPadding: number;
  labels: string[] | null;
  labelColor: ColorSpec | null;
  yAxisLabels: string[] | null;
  yAxisPosition: YAxisPosition | null;
  yAxisLabelColor: ColorSpec | null;
  nameFont: FontModel | null;
  namePosition: NamePosition;
}

export interface TimeSeriesLineChartDTO extends WidgetEnvelope {
  type: 'TimeSeriesLineChart';
  payload: TimeSeriesLineChartPayload;
}

// ---------------------------------------------------------------------------
// StackedBarChart
// ---------------------------------------------------------------------------

export interface SeriesSpec {
  values: number[];
  color: ColorSpec;
}

export interface StackedBarChartPayload {
  series: SeriesSpec[];
  cornerRadius: number;
  barSpacing: number;
  showGlow: boolean;
  horizontalPadding: number;
  verticalPadding: number;
  labels: string[] | null;
  labelColor: ColorSpec | null;
  yAxisLabels: string[] | null;
  yAxisPosition: YAxisPosition | null;
  yAxisLabelColor: ColorSpec | null;
  nameFont: FontModel | null;
  namePosition: NamePosition;
}

export interface StackedBarChartDTO extends WidgetEnvelope {
  type: 'StackedBarChart';
  payload: StackedBarChartPayload;
}

// ---------------------------------------------------------------------------
// RadialGauge
// ---------------------------------------------------------------------------

export interface ThresholdSpec {
  value: number;
  color: ColorSpec;
}

export interface RadialGaugePayload {
  value: number;
  minValue: number;
  maxValue: number;
  gaugeColor: ColorSpec;
  thresholds: ThresholdSpec[];
  gaugeBackgroundColor: ColorSpec | null;
  glowColor: ColorSpec | null;
  valueTextColor: ColorSpec | null;
  tickColor: ColorSpec | null;
  gapAngle: number;
  lineWidth: number;
  showTicks: boolean;
  showGlow: boolean;
  label: string | null;
  nameFont: FontModel | null;
  namePosition: NamePosition;
}

export interface RadialGaugeDTO extends WidgetEnvelope {
  type: 'RadialGauge';
  payload: RadialGaugePayload;
}

// ---------------------------------------------------------------------------
// RadialGaugeLarge
// ---------------------------------------------------------------------------

/** A single gauge spec within a RadialGaugeLarge widget (no nameFont/namePosition). */
export type GaugeSpec = Omit<RadialGaugePayload, 'nameFont' | 'namePosition'>;

export interface RadialGaugeLargePayload {
  gauge1: GaugeSpec;
  gauge2: GaugeSpec;
  gauge3?: GaugeSpec;
  nameFont: FontModel | null;
  namePosition: NamePosition;
}

export interface RadialGaugeLargeDTO extends WidgetEnvelope {
  type: 'RadialGaugeLarge';
  payload: RadialGaugeLargePayload;
}

// ---------------------------------------------------------------------------
// CircularProgress
// ---------------------------------------------------------------------------

export interface CircularProgressPayload {
  progress: number;
  label: string | null;
  ringColor: ColorSpec;
  ringBackgroundColor: ColorSpec | null;
  valueColor: ColorSpec | null;
  caption: string | null;
  captionPosition: 'above' | 'below';
  captionColor: ColorSpec | null;
  lineWidth: number;
  showValue: boolean;
  showGlow: boolean;
  nameFont: FontModel | null;
  namePosition: NamePosition;
}

export interface CircularProgressDTO extends WidgetEnvelope {
  type: 'CircularProgress';
  payload: CircularProgressPayload;
}

// ---------------------------------------------------------------------------
// KPIMetric
// ---------------------------------------------------------------------------

export interface KPIMetricPayload {
  value: number;
  valueColor: ColorSpec;
  unit: string | null;
  trendPercentage: number | null;
  trendDirection: 'up' | 'down' | 'neutral';
  sparklineValues: number[];
  trendUpColor: ColorSpec | null;
  trendDownColor: ColorSpec | null;
  sparklineColor: ColorSpec | null;
  isInt: boolean;
  showSparkline: boolean;
  showGlow: boolean;
  nameFont: FontModel | null;
  namePosition: NamePosition;
}

export interface KPIMetricDTO extends WidgetEnvelope {
  type: 'KPIMetric';
  payload: KPIMetricPayload;
}

// ---------------------------------------------------------------------------
// Union type
// ---------------------------------------------------------------------------

export type AnyWidgetDTO =
  | BarChartDTO
  | PieChartDTO
  | AreaChartDTO
  | TimeSeriesLineChartDTO
  | StackedBarChartDTO
  | RadialGaugeDTO
  | RadialGaugeLargeDTO
  | CircularProgressDTO
  | KPIMetricDTO;

// ---------------------------------------------------------------------------
// Renderer functions
// ---------------------------------------------------------------------------

export declare function makeBarChart(opts: Partial<BarChartPayload> & {
  values: number[];
  nome?: string | null;
  backgroundColor?: ColorSpec | null;
  backgroundType?: BackgroundType;
  borderColor?: ColorString | null;
  shadowColor?: ColorString | null;
  refreshInterval?: number;
}): BarChartDTO;

export declare function makePieChart(opts: {
  slices: SliceSpec[];
  nome?: string | null;
  innerRadiusRatio?: number;
  sliceSpacing?: number;
  outerPadding?: number;
  showGlow?: boolean;
  glowColor?: ColorSpec | null;
  showPercentage?: boolean;
  nameFont?: FontModel | null;
  namePosition?: NamePosition;
  backgroundColor?: ColorSpec | null;
  backgroundType?: BackgroundType;
  borderColor?: ColorString | null;
  shadowColor?: ColorString | null;
  refreshInterval?: number;
}): PieChartDTO;

export declare function makeSlice(opts: {
  value: number;
  color?: ColorSpec;
  label?: string | null;
  labelColor?: ColorSpec | null;
}): SliceSpec;

export declare function makeAreaChart(opts: {
  values: number[];
  lineColor?: ColorSpec;
  areaColor?: ColorSpec;
  nome?: string | null;
  baselineValue?: number | null;
  glowColor?: ColorSpec | null;
  lineWidth?: number;
  smoothingEnabled?: boolean;
  showGlow?: boolean;
  horizontalPadding?: number;
  verticalPadding?: number;
  labels?: string[] | null;
  labelColor?: ColorSpec | null;
  yAxisLabels?: string[] | null;
  yAxisPosition?: YAxisPosition | null;
  yAxisLabelColor?: ColorSpec | null;
  nameFont?: FontModel | null;
  namePosition?: NamePosition;
  backgroundColor?: ColorSpec | null;
  backgroundType?: BackgroundType;
  borderColor?: ColorString | null;
  shadowColor?: ColorString | null;
  refreshInterval?: number;
}): AreaChartDTO;

export declare function makeTimeSeriesLineChart(opts: {
  values: number[];
  lineColor?: ColorSpec;
  areaColor?: ColorSpec;
  nome?: string | null;
  gridColor?: ColorSpec | null;
  glowColor?: ColorSpec | null;
  lineWidth?: number;
  showGrid?: boolean;
  smoothingEnabled?: boolean;
  showGlow?: boolean;
  gridRows?: number;
  gridColumns?: number;
  horizontalPadding?: number;
  verticalPadding?: number;
  labels?: string[] | null;
  labelColor?: ColorSpec | null;
  yAxisLabels?: string[] | null;
  yAxisPosition?: YAxisPosition | null;
  yAxisLabelColor?: ColorSpec | null;
  nameFont?: FontModel | null;
  namePosition?: NamePosition;
  backgroundColor?: ColorSpec | null;
  backgroundType?: BackgroundType;
  borderColor?: ColorString | null;
  shadowColor?: ColorString | null;
  refreshInterval?: number;
}): TimeSeriesLineChartDTO;

export declare function makeStackedBarChart(opts: {
  series: SeriesSpec[];
  nome?: string | null;
  cornerRadius?: number;
  barSpacing?: number;
  showGlow?: boolean;
  horizontalPadding?: number;
  verticalPadding?: number;
  labels?: string[] | null;
  labelColor?: ColorSpec | null;
  yAxisLabels?: string[] | null;
  yAxisPosition?: YAxisPosition | null;
  yAxisLabelColor?: ColorSpec | null;
  nameFont?: FontModel | null;
  namePosition?: NamePosition;
  backgroundColor?: ColorSpec | null;
  backgroundType?: BackgroundType;
  borderColor?: ColorString | null;
  shadowColor?: ColorString | null;
  refreshInterval?: number;
}): StackedBarChartDTO;

export declare function makeSeries(values: number[], color: ColorSpec): SeriesSpec;

export declare function makeRadialGauge(opts: {
  value: number;
  minValue: number;
  maxValue: number;
  gaugeColor?: ColorSpec;
  nome?: string | null;
  thresholds?: ThresholdSpec[];
  gaugeBackgroundColor?: ColorSpec | null;
  glowColor?: ColorSpec | null;
  valueTextColor?: ColorSpec | null;
  tickColor?: ColorSpec | null;
  gapAngle?: number;
  lineWidth?: number;
  showTicks?: boolean;
  showGlow?: boolean;
  label?: string | null;
  nameFont?: FontModel | null;
  namePosition?: NamePosition;
  backgroundColor?: ColorSpec | null;
  backgroundType?: BackgroundType;
  borderColor?: ColorString | null;
  shadowColor?: ColorString | null;
  refreshInterval?: number;
}): RadialGaugeDTO;

export declare function makeThreshold(value: number, color: ColorSpec): ThresholdSpec;

export declare function makeRadialGaugeLarge(opts: {
  gauge1: GaugeSpec;
  gauge2: GaugeSpec;
  gauge3?: GaugeSpec | null;
  nome?: string | null;
  nameFont?: FontModel | null;
  namePosition?: NamePosition;
  backgroundColor?: ColorSpec | null;
  backgroundType?: BackgroundType;
  borderColor?: ColorString | null;
  shadowColor?: ColorString | null;
  refreshInterval?: number;
}): RadialGaugeLargeDTO;

export declare function makeCircularProgress(opts: {
  progress: number;
  ringColor?: ColorSpec;
  nome?: string | null;
  label?: string | null;
  ringBackgroundColor?: ColorSpec | null;
  valueColor?: ColorSpec | null;
  caption?: string | null;
  captionPosition?: 'above' | 'below';
  captionColor?: ColorSpec | null;
  lineWidth?: number;
  showValue?: boolean;
  showGlow?: boolean;
  nameFont?: FontModel | null;
  namePosition?: NamePosition;
  backgroundColor?: ColorSpec | null;
  backgroundType?: BackgroundType;
  borderColor?: ColorString | null;
  shadowColor?: ColorString | null;
  refreshInterval?: number;
}): CircularProgressDTO;

export declare function makeKPIMetric(opts: {
  value: number;
  valueColor?: ColorSpec;
  nome?: string | null;
  unit?: string | null;
  trendPercentage?: number | null;
  trendDirection?: 'up' | 'down' | 'neutral';
  sparklineValues?: number[];
  trendUpColor?: ColorSpec | null;
  trendDownColor?: ColorSpec | null;
  sparklineColor?: ColorSpec | null;
  isInt?: boolean;
  showSparkline?: boolean;
  showGlow?: boolean;
  nameFont?: FontModel | null;
  namePosition?: NamePosition;
  backgroundColor?: ColorSpec | null;
  backgroundType?: BackgroundType;
  borderColor?: ColorString | null;
  shadowColor?: ColorString | null;
  refreshInterval?: number;
}): KPIMetricDTO;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export declare const gradient: Record<string, ColorSpec>;
export declare const fill: Record<string, ColorSpec>;
export declare const palette: Record<string, string>;
export declare function solidColor(hex: string): ColorSpec;
export declare function gradientColor(from: string, to: string): ColorSpec;
export declare function fadeToTransparent(color: string): ColorSpec;

export declare function normalizeRange(values: number[]): number[];
export declare function normalizeSum(values: number[]): number[];
export declare function makeYAxisLabels(min: number, max: number, steps?: number, decimals?: number): string[];
export declare function clamp(value: number, min: number, max: number): number;
export declare function round(value: number, decimals?: number): number;
export declare function formatBytes(bytes: number, decimals?: number): string;
export declare function toPercent(value: number, total: number, decimals?: number): number;

export declare function enableValidation(): void;
export declare function disableValidation(): void;
export declare function isValidationEnabled(): boolean;

// ---------------------------------------------------------------------------
// Monitoring
// ---------------------------------------------------------------------------

export type CollectorName =
  | 'cpu'
  | 'memory'
  | 'diskIO'
  | 'network'
  | 'diskUsage'
  | 'loadAverage'
  | 'eventLoop'
  | 'gc';

export declare const ALL_COLLECTORS: CollectorName[];

export declare function startMonitoring(opts?: {
  intervalMs?: number;
  bufferSize?: number;
  collectors?: CollectorName[];
  diskPath?: string;
}): { stop: () => void };

export declare function stopMonitoring(): void;
export declare function isMonitoring(): boolean;
