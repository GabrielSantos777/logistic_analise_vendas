/**
 * Fonte unica para chamadas HTTP da aplicacao.
 * Cada funcao representa um endpoint do backend.
 */

import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 10_000,
})

/**
 * Converte o estado de filtros da interface para os parametros esperados pela API.
 * @param {Object} filters - { startDate, endDate, category, country }
 * @returns {Object}
 */
function buildQueryParams(filters = {}) {
  const params = {}
  if (filters.startDate) params.start_date = filters.startDate
  if (filters.endDate) params.end_date = filters.endDate
  if (filters.category) params.category = filters.category
  if (filters.country) params.country = filters.country
  return params
}

export async function fetchFilterOptions() {
  const { data } = await client.get('/api/filter-options')
  return data
}

export async function fetchKpis(filters) {
  const { data } = await client.get('/api/kpis', { params: buildQueryParams(filters) })
  return data
}

export async function fetchRevenueByMonth(filters) {
  const { data } = await client.get('/api/revenue-by-month', { params: buildQueryParams(filters) })
  return data
}

export async function fetchTopProducts(filters) {
  const { data } = await client.get('/api/top-products', { params: buildQueryParams(filters) })
  return data
}

export async function fetchRevenueByCategory(filters) {
  const { data } = await client.get('/api/revenue-by-category', { params: buildQueryParams(filters) })
  return data
}

export async function fetchTopCustomers(filters) {
  const { data } = await client.get('/api/top-customers', { params: buildQueryParams(filters) })
  return data
}

export async function fetchSalesByCountry(filters) {
  const { data } = await client.get('/api/sales-by-country', { params: buildQueryParams(filters) })
  return data
}
