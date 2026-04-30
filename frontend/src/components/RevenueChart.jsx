import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'

import styles from './ChartCard.module.css'
import { formatCurrencyShort, formatCurrencyFull } from '../utils/formatters'

function RevenueTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null

  return (
    <div className={styles.tooltip}>
      <p className={styles.tooltipLabel}>{label}</p>
      <p className={styles.tooltipValue} style={{ color: 'var(--color-purple)' }}>
        {formatCurrencyFull(payload[0].value)}
      </p>
    </div>
  )
}

export default function RevenueChart({ data }) {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Receita ao longo do tempo</h3>

      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="var(--color-purple)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="var(--color-purple)" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />

          <XAxis
            dataKey="month"
            tick={{ fill: 'var(--color-muted)', fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tickFormatter={formatCurrencyShort}
            tick={{ fill: 'var(--color-muted)', fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            width={55}
          />

          <Tooltip content={<RevenueTooltip />} />

          <Area
            type="monotone"
            dataKey="revenue"
            stroke="var(--color-purple)"
            strokeWidth={2.5}
            fill="url(#revenueGradient)"
            dot={false}
            activeDot={{ r: 5, fill: 'var(--color-purple)' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
