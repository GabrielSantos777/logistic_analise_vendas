import styles from './KpiCard.module.css'

/**
 * @param {string} title
 * @param {number | string} value
 * @param {string} prefix
 * @param {string} suffix
 * @param {string} color
 * @param {string} icon
 */
export default function KpiCard({ title, value, prefix = '', suffix = '', color, icon }) {
  const formattedValue = typeof value === 'number'
    ? value.toLocaleString('pt-BR', { maximumFractionDigits: 2 })
    : value

  const accentStyle = color ? { '--accent-color': color } : {}

  return (
    <div className={styles.card} style={accentStyle}>
      <div className={styles.header}>
        <p className={styles.label}>{title}</p>
        {icon && <span className={styles.icon}>{icon}</span>}
      </div>
      <p className={styles.value}>
        {prefix}
        {formattedValue}
        {suffix}
      </p>
    </div>
  )
}
