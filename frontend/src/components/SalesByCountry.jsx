import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
} from 'recharts'

import styles from './ChartCard.module.css'
import { formatCurrencyShort, formatCurrencyFull } from '../utils/formatters'

const COUNTRY_COLORS = [
  'var(--color-purple)', 'var(--color-teal)', 'var(--color-red)',
  'var(--color-yellow)', '#a855f7', '#3b82f6', '#f97316',
  '#ec4899', '#84cc16', '#06b6d4', '#f59e0b', '#10b981',
  '#8b5cf6', '#ef4444', '#14b8a6',
]

function CountryTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null

  return (
    <div className={styles.tooltip}>
      <p className={styles.tooltipLabel}>{label}</p>
      <p className={styles.tooltipValue} style={{ color: 'var(--color-yellow)' }}>
        {formatCurrencyFull(payload[0].value)}
      </p>
    </div>
  )
}

export default function SalesByCountry({ data }) {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Receita por pais</h3>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 30 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--color-border)"
            horizontal
            vertical={false}
          />
          <XAxis
            dataKey="country"
            tick={{ fill: 'var(--color-muted)', fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            angle={-35}
            textAnchor="end"
            interval={0}
          />
          <YAxis
            tickFormatter={formatCurrencyShort}
            tick={{ fill: 'var(--color-muted)', fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            width={55}
          />
          <Tooltip content={<CountryTooltip />} cursor={{ fill: 'var(--color-border)' }} />
          <Bar dataKey="revenue" radius={[6, 6, 0, 0]} barSize={22}>
            {data.map((_, index) => (
              <Cell key={index} fill={COUNTRY_COLORS[index % COUNTRY_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
