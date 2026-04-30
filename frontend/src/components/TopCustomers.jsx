import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts'

import styles from './ChartCard.module.css'
import { formatCurrencyShort, formatCurrencyFull } from '../utils/formatters'

function CustomerTooltip({ active, payload }) {
  if (!active || !payload?.length) return null

  return (
    <div className={styles.tooltip}>
      <p className={styles.tooltipLabel}>{payload[0].payload.customer}</p>
      <p className={styles.tooltipValue} style={{ color: 'var(--color-purple)' }}>
        {formatCurrencyFull(payload[0].value)}
      </p>
    </div>
  )
}

function barColor(index) {
  return `hsl(${250 + index * 8}, 70%, ${60 - index * 2}%)`
}

export default function TopCustomers({ data }) {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>10 principais clientes por receita</h3>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 0, right: 20, left: 140, bottom: 0 }}
        >
          <XAxis
            type="number"
            tickFormatter={formatCurrencyShort}
            tick={{ fill: 'var(--color-muted)', fontSize: 11 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            type="category"
            dataKey="customer"
            tick={{ fill: 'var(--color-text)', fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            width={135}
          />
          <Tooltip content={<CustomerTooltip />} cursor={{ fill: 'var(--color-border)' }} />
          <Bar dataKey="revenue" radius={[0, 6, 6, 0]} barSize={14}>
            {data.map((_, index) => (
              <Cell key={index} fill={barColor(index)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
