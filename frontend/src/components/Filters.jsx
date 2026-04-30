import styles from './Filters.module.css'

/**
 * @param {Object} options
 * @param {Object} filters
 * @param {Function} onChange
 */
export default function Filters({ options, filters, onChange }) {
  function handleChange(key) {
    return (event) => {
      const value = event.target.value || undefined
      onChange({ ...filters, [key]: value })
    }
  }

  function handleClear() {
    onChange({})
  }

  const dateMin = options?.date_range?.min
  const dateMax = options?.date_range?.max

  return (
    <div className={styles.bar}>
      <div className={styles.field}>
        <label className={styles.label}>Data inicial</label>
        <input
          type="date"
          className={styles.control}
          min={dateMin}
          max={dateMax}
          value={filters.startDate ?? ''}
          onChange={handleChange('startDate')}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Data final</label>
        <input
          type="date"
          className={styles.control}
          min={dateMin}
          max={dateMax}
          value={filters.endDate ?? ''}
          onChange={handleChange('endDate')}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Categoria</label>
        <select
          className={styles.control}
          value={filters.category ?? ''}
          onChange={handleChange('category')}
        >
          <option value="">Todas as categorias</option>
          {options?.categories?.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Pais</label>
        <select
          className={styles.control}
          value={filters.country ?? ''}
          onChange={handleChange('country')}
        >
          <option value="">Todos os paises</option>
          {options?.countries?.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
      </div>

      <button type="button" className={styles.clearButton} onClick={handleClear}>
        Limpar filtros
      </button>
    </div>
  )
}
