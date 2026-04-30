import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts'
import styles from './ChartCard.module.css'
import { formatCurrencyFull } from '../utils/formatters'

const SLICE_COLORS = [
  'var(--color-purple)',
  'var(--color-teal)',
  'var(--color-red)',
  'var(--color-yellow)',
  '#a855f7',
  '#3b82f6',
  '#f97316',
]

function CategoryTooltip({ active, payload }) {
  if (!active || !payload?.length) return null

  const entry      = payload[0].payload
  const percentage = (entry.share * 100).toFixed(1)

  return (
    <div className={styles.tooltip}>
      <p className={styles.tooltipLabel}>{entry.category}</p>
      <p className={styles.tooltipValue} style={{ color: entry.color }}>
        {formatCurrencyFull(entry.revenue)}
      </p>
      <p className={styles.tooltipMeta}>{percentage}% do total</p>
    </div>
  )
}

function LegendText(value) {
  return <span style={{ color: 'var(--color-muted)', fontSize: 12 }}>{value}</span>
}

export default function CategoryChart({ data }) {
  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0)

  const enrichedData = data.map((item, index) => ({
    ...item,
    share: totalRevenue > 0 ? item.revenue / totalRevenue : 0,
    color: SLICE_COLORS[index % SLICE_COLORS.length],
  }))

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Vendas por categoria</h3>

      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={enrichedData}
            dataKey="revenue"
            nameKey="category"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={95}
            paddingAngle={3}
            strokeWidth={0}
          >
            {enrichedData.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Pie>

          <Tooltip content={<CategoryTooltip />} />
          <Legend formatter={LegendText} iconType="circle" iconSize={8} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
