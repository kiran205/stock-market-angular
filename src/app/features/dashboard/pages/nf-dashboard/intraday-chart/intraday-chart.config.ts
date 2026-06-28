import { EChartsOption } from 'echarts';
import { IntradayChartViewModel, IntradayPoint, IntradaySentiment } from './intraday-chart.types';

export function createIntradayViewModel(points: readonly IntradayPoint[]): IntradayChartViewModel {
  const labels = points.map((point) => point.time);
  const priceData = points.map((point) => point.price);
  const maxOiAbs = Math.max(...points.map((point) => Math.abs(point.oiChange)), 1);
  const oiAxisLimit = Math.ceil((maxOiAbs * 1.16) / 10000) * 10000;
  const priceMinValue = Math.min(...priceData);
  const priceMaxValue = Math.max(...priceData);
  const pricePadding = Math.max((priceMaxValue - priceMinValue) * 0.08, 25);

  return {
    labels,
    priceData,
    positiveOiData: points.map((point) => point.oiChange >= 0 ? point.oiChange : null),
    negativeOiData: points.map((point) => point.oiChange < 0 ? point.oiChange : null),
    oiAxisLimit,
    priceMin: Math.floor((priceMinValue - pricePadding) / 50) * 50,
    priceMax: Math.ceil((priceMaxValue + pricePadding) / 50) * 50,
    sentiment: points.at(-1)?.sentiment ?? 'LONG_UNWINDING'
  };
}

export function createIntradayChartOption(points: readonly IntradayPoint[], expiry: string): EChartsOption {
  const model = createIntradayViewModel(points);

  return {
    backgroundColor: 'transparent',
    animation: true,
    animationDuration: 420,
    animationEasing: 'cubicOut',
    title: createTitle(model.sentiment, expiry),
    tooltip: createTooltip(points),
    legend: createLegend(),
    grid: { left: 68, right: 74, top: 84, bottom: 78 },
    axisPointer: { link: [{ xAxisIndex: 'all' }] },
    dataZoom: [
      {
        type: 'inside',
        xAxisIndex: 0,
        start: 0,
        end: 100,
        zoomOnMouseWheel: true,
        moveOnMouseWheel: true,
        moveOnMouseMove: true,
        preventDefaultMouseMove: true
      },
      {
        type: 'slider',
        xAxisIndex: 0,
        start: 0,
        end: 100,
        bottom: 30,
        height: 18,
        borderColor: 'rgba(148, 163, 184, 0.28)',
        fillerColor: 'rgba(119, 214, 173, 0.18)',
        handleStyle: { color: '#77D6AD', borderColor: '#77D6AD' },
        selectedDataBackground: {
          lineStyle: { color: '#77D6AD' },
          areaStyle: { color: 'rgba(119, 214, 173, 0.14)' }
        },
        textStyle: { color: '#64748B', fontSize: 10 }
      }
    ],
    xAxis: createXAxis(model.labels),
    yAxis: createYAxis(model),
    series: createSeries(model),
    progressive: 500,
    progressiveThreshold: 500
  };
}

export function createIntradayChartUpdateOption(points: readonly IntradayPoint[], expiry: string): EChartsOption {
  const model = createIntradayViewModel(points);

  return {
    animation: true,
    title: createTitle(model.sentiment, expiry),
    xAxis: { data: [...model.labels] },
    yAxis: [
      { min: -model.oiAxisLimit, max: model.oiAxisLimit },
      { min: model.priceMin, max: model.priceMax }
    ],
    series: [
      { data: [...model.positiveOiData] },
      { data: [...model.negativeOiData] },
      { data: [...model.priceData] }
    ]
  };
}

export function getSentimentColor(sentiment: IntradaySentiment): string {
  if (sentiment === 'LONG_BUILDUP') {
    return '#00B85C';
  }

  if (sentiment === 'SHORT_BUILDUP') {
    return '#F59E0B';
  }

  if (sentiment === 'SHORT_COVERING') {
    return '#0EA5E9';
  }

  return '#DC2626';
}

function createTitle(sentiment: IntradaySentiment, expiry: string): EChartsOption['title'] {
  return [
    {
      text: 'INTRADAY TREND (OI VS PRICE)',
      subtext: `CURRENT SENTIMENT: ${formatSentiment(sentiment)}`,
      left: 18,
      top: 14,
        textStyle: { color: '#F8FAFC', fontSize: 13, fontWeight: 900 },
      subtextStyle: { color: getSentimentColor(sentiment), fontSize: 11, fontWeight: 900 }
    },
    {
      text: expiry,
      right: 22,
      top: 14,
      textStyle: { color: '#94A3B8', fontSize: 14, fontWeight: 900 }
    }
  ];
}

function createTooltip(points: readonly IntradayPoint[]): EChartsOption['tooltip'] {
  return {
    trigger: 'axis',
    axisPointer: { type: 'cross', crossStyle: { color: '#64748B' } },
    backgroundColor: 'rgba(17, 24, 39, 0.96)',
    borderColor: 'rgba(148, 163, 184, 0.24)',
    textStyle: { color: '#F8FAFC' },
    formatter: (params: unknown) => {
      const items = Array.isArray(params) ? params as Array<{ dataIndex: number }> : [];
      const point = points[items[0]?.dataIndex ?? 0];

      if (!point) {
        return '';
      }

      return `
        <strong>${point.time}</strong><br/>
        Price: ${point.price.toFixed(2)}<br/>
        OI Change: ${formatMillionAxis(point.oiChange)}<br/>
        Sentiment: ${formatSentiment(point.sentiment)}<br/>
        Volume: ${point.volume.toLocaleString('en-IN')}
      `;
    }
  };
}

function createLegend(): EChartsOption['legend'] {
  return {
    bottom: 12,
    left: 24,
    icon: 'circle',
    itemWidth: 9,
    itemHeight: 9,
    textStyle: { color: '#94A3B8', fontSize: 11, fontWeight: 700 },
    data: ['OI Increase (Buildup)', 'OI Decrease (Unwinding/Covering)']
  };
}

function createXAxis(labels: readonly string[]): EChartsOption['xAxis'] {
  return {
    type: 'category',
    data: [...labels],
    boundaryGap: true,
    axisLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.32)' } },
    axisTick: { show: false },
    axisLabel: {
      color: '#94A3B8',
      fontSize: 10,
      hideOverlap: true,
      interval: 'auto',
      margin: 12,
      rotate: 0
    },
    splitLine: { show: false }
  };
}

function createYAxis(model: IntradayChartViewModel): EChartsOption['yAxis'] {
  return [
    {
      type: 'value',
      name: 'OI Change',
      min: -model.oiAxisLimit,
      max: model.oiAxisLimit,
      axisLine: { show: false },
      axisTick: { show: false },
      nameTextStyle: { color: '#94A3B8', fontSize: 10, align: 'left' },
      axisLabel: { color: '#94A3B8', fontSize: 10, formatter: (value: number) => formatMillionAxis(value) },
      splitLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.24)', type: 'dotted' } }
    },
    {
      type: 'value',
      name: 'Price',
      position: 'right',
      min: model.priceMin,
      max: model.priceMax,
      axisLine: { show: false },
      axisTick: { show: false },
      nameTextStyle: { color: '#94A3B8', fontSize: 10, align: 'right' },
      axisLabel: { color: '#94A3B8', fontSize: 10, formatter: (value: number) => value.toFixed(0) },
      splitLine: { show: false }
    }
  ];
}

function createSeries(model: IntradayChartViewModel): EChartsOption['series'] {
  return [
    {
      name: 'OI Increase (Buildup)',
      type: 'bar',
      data: [...model.positiveOiData],
      yAxisIndex: 0,
      barMaxWidth: 10,
      barMinWidth: 1,
      large: true,
      largeThreshold: 500,
      itemStyle: { color: 'rgba(34, 197, 94, 0.68)' },
      markLine: {
        silent: true,
        symbol: 'none',
        lineStyle: { color: 'rgba(31, 41, 55, 0.72)', width: 1 },
        data: [{ yAxis: 0 }]
      }
    },
    {
      name: 'OI Decrease (Unwinding/Covering)',
      type: 'bar',
      data: [...model.negativeOiData],
      yAxisIndex: 0,
      barMaxWidth: 10,
      barMinWidth: 1,
      large: true,
      largeThreshold: 500,
      itemStyle: { color: 'rgba(239, 68, 68, 0.64)' }
    },
    {
      name: 'Price',
      type: 'line',
      data: [...model.priceData],
      yAxisIndex: 1,
      smooth: true,
      showSymbol: false,
      animationDurationUpdate: 240,
      lineStyle: { color: '#77D6AD', width: 2.4 },
      emphasis: { focus: 'series' }
    }
  ];
}

function formatSentiment(sentiment: IntradaySentiment): string {
  return sentiment.replaceAll('_', ' ');
}

function formatMillionAxis(value: number): string {
  if (value === 0) {
    return '0.00M';
  }

  return `${(value / 1000000).toFixed(2)}M`;
}
