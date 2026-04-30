import { useEffect, useState } from 'react'

import CategoryChart from './components/CategoryChart'
import Filters from './components/Filters'
import KpiCard from './components/KpiCard'
import RevenueChart from './components/RevenueChart'
import SalesByCountry from './components/SalesByCountry'
import TopCustomers from './components/TopCustomers'
import TopProducts from './components/TopProducts'
import {
  fetchFilterOptions,
  fetchKpis,
  fetchRevenueByCategory,
  fetchRevenueByMonth,
  fetchSalesByCountry,
  fetchTopCustomers,
  fetchTopProducts,
} from './services/api'
import styles from './App.module.css'

function Skeleton({ height = 240 }) {
  return <div className={styles.skeleton} style={{ height }} />
}

function SkeletonKpi() {
  return (
    <div className={styles.skeletonKpi}>
      <Skeleton height={96} />
    </div>
  )
}

const INITIAL_DATA = {
  kpis: null,
  revenueByMonth: [],
  topProducts: [],
  revenueByCategory: [],
  topCustomers: [],
  salesByCountry: [],
}

const KPI_CONFIG = [
  {
    key: 'total_revenue',
    title: 'Receita total',
    prefix: '$',
    color: 'var(--color-purple)',
    icon: '$',
  },
  {
    key: 'total_orders',
    title: 'Total de pedidos',
    color: 'var(--color-teal)',
    icon: '#',
  },
  {
    key: 'average_ticket',
    title: 'Ticket medio',
    prefix: '$',
    color: 'var(--color-yellow)',
    icon: 'AVG',
  },
  {
    key: 'unique_customers',
    title: 'Clientes unicos',
    color: 'var(--color-red)',
    icon: 'USR',
  },
]

export default function App() {
  const [filters, setFilters] = useState({})
  const [filterOptions, setFilterOptions] = useState(null)
  const [data, setData] = useState(INITIAL_DATA)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    fetchFilterOptions()
      .then(setFilterOptions)
      .catch((error) => {
        console.error('Falha ao carregar filtros:', error)
        setErrorMessage('Nao foi possivel carregar os filtros no momento.')
      })
  }, [])

  useEffect(() => {
    let isCancelled = false

    async function loadDashboardData() {
      setIsLoading(true)
      setErrorMessage('')

      try {
        const [
          kpis,
          revenueByMonth,
          topProducts,
          revenueByCategory,
          topCustomers,
          salesByCountry,
        ] = await Promise.all([
          fetchKpis(filters),
          fetchRevenueByMonth(filters),
          fetchTopProducts(filters),
          fetchRevenueByCategory(filters),
          fetchTopCustomers(filters),
          fetchSalesByCountry(filters),
        ])

        if (!isCancelled) {
          setData({
            kpis,
            revenueByMonth,
            topProducts,
            revenueByCategory,
            topCustomers,
            salesByCountry,
          })
        }
      } catch (error) {
        if (!isCancelled) {
          console.error('Falha ao carregar dados do painel:', error)
          setErrorMessage('Nao foi possivel atualizar os dados. Tente novamente em instantes.')
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false)
        }
      }
    }

    const timerId = setTimeout(() => {
      void loadDashboardData()
    }, 0)

    return () => {
      isCancelled = true
      clearTimeout(timerId)
    }
  }, [filters])

  const { kpis, revenueByMonth, topProducts, revenueByCategory, topCustomers, salesByCountry } = data

  const dateRange = filterOptions?.date_range
  const subtitleText = dateRange
    ? `Periodo disponivel: ${dateRange.min} ate ${dateRange.max}`
    : 'Carregando periodo...'

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Painel de Vendas</h1>
          <p className={styles.subtitle}>{subtitleText}</p>
        </div>
        <div className={styles.liveIndicator}>
          <span className={styles.liveDot} />
          <span className={styles.liveLabel}>Ao vivo</span>
        </div>
      </header>

      {errorMessage && (
        <div className={styles.errorBanner} role="alert">
          {errorMessage}
        </div>
      )}

      <Filters options={filterOptions} filters={filters} onChange={setFilters} />

      <div className={styles.kpiRow}>
        {isLoading || !kpis ? (
          [1, 2, 3, 4].map((key) => <SkeletonKpi key={key} />)
        ) : (
          KPI_CONFIG.map((kpi) => (
            <KpiCard
              key={kpi.key}
              title={kpi.title}
              value={kpis[kpi.key]}
              prefix={kpi.prefix}
              color={kpi.color}
              icon={kpi.icon}
            />
          ))
        )}
      </div>

      <div className={styles.gridWideNarrow}>
        {isLoading ? <Skeleton height={290} /> : <RevenueChart data={revenueByMonth} />}
        {isLoading ? <Skeleton height={290} /> : <CategoryChart data={revenueByCategory} />}
      </div>

      <div className={styles.gridHalf}>
        {isLoading ? <Skeleton height={330} /> : <TopProducts data={topProducts} />}
        {isLoading ? <Skeleton height={330} /> : <TopCustomers data={topCustomers} />}
      </div>

      <div className={styles.gridFull}>
        {isLoading ? <Skeleton height={310} /> : <SalesByCountry data={salesByCountry} />}
      </div>

      <footer className={styles.footer}>
        Painel de Vendas · React + FastAPI · Gabriel Santos
      </footer>
    </div>
  )
}
