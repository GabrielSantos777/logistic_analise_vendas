/**
 * Funcoes de formatacao compartilhadas entre os componentes de graficos.
 */

const compactFormatter = new Intl.NumberFormat('pt-BR', {
  notation: 'compact',
  compactDisplay: 'short',
  maximumFractionDigits: 1,
})

const fullFormatter = new Intl.NumberFormat('pt-BR', {
  maximumFractionDigits: 0,
})

/**
 * Formata valor monetario para eixos (versao compacta).
 */
export function formatCurrencyShort(value) {
  return `$${compactFormatter.format(value)}`
}

/**
 * Formata valor monetario para tooltips (valor completo com separadores).
 */
export function formatCurrencyFull(value) {
  return `$${fullFormatter.format(value)}`
}
