from functools import lru_cache
from pathlib import Path

import pandas as pd

# Constantes de colunas usadas ao longo das transformacoes.
CSV_PATH = Path(__file__).resolve().parent.parent / "data" / "sales_data_sample.csv"

COL_PRODUCT_LINE = "PRODUCTLINE"
COL_DATE = "ORDERDATE"
COL_SALES = "SALES"
COL_ORDER = "ORDERNUMBER"
COL_CUSTOMER = "CUSTOMERNAME"
COL_PRODUCT = "PRODUCTCODE"
COL_COUNTRY = "COUNTRY"
COL_TERRITORY = "TERRITORY"


# Carregamento e limpeza dos dados.
@lru_cache(maxsize=1)
def load_data() -> pd.DataFrame:
    """
    Le o CSV uma unica vez e mantem o resultado em cache durante o ciclo da aplicacao.
    lru_cache(maxsize=1) garante que o DataFrame seja reutilizado entre requisicoes.
    """
    df = pd.read_csv(CSV_PATH, encoding="latin-1")
    return _clean(df)


def _clean(df: pd.DataFrame) -> pd.DataFrame:
    """Aplica regras de limpeza e tipagem no DataFrame bruto."""
    df[COL_DATE] = pd.to_datetime(df[COL_DATE], errors="coerce")
    df[COL_TERRITORY] = df[COL_TERRITORY].fillna("North America")
    return df


# Filtros compartilhados pelos endpoints analiticos.
def apply_filters(
    df: pd.DataFrame,
    start_date: str | None,
    end_date: str | None,
    category: str | None,
    country: str | None,
) -> pd.DataFrame:
    """
    Aplica filtros opcionais no DataFrame.
    Cada parametro e opcional; quando None, o filtro correspondente e ignorado.
    """
    if start_date:
        parsed_start_date = pd.to_datetime(start_date, errors="coerce")
        if not pd.isna(parsed_start_date):
            df = df[df[COL_DATE] >= parsed_start_date]

    if end_date:
        parsed_end_date = pd.to_datetime(end_date, errors="coerce")
        if not pd.isna(parsed_end_date):
            df = df[df[COL_DATE] <= parsed_end_date]

    if category:
        df = df[df[COL_PRODUCT_LINE] == category]
    if country:
        df = df[df[COL_COUNTRY] == country]
    return df


# Funcoes analiticas (uma por endpoint).
def get_kpis(df: pd.DataFrame) -> dict:
    """Retorna os quatro KPIs principais."""
    total_revenue = round(df[COL_SALES].sum(), 2)
    total_orders = df[COL_ORDER].nunique()
    average_ticket = round(total_revenue / total_orders, 2) if total_orders > 0 else 0
    unique_customers = df[COL_CUSTOMER].nunique()

    return {
        "total_revenue": total_revenue,
        "total_orders": total_orders,
        "average_ticket": average_ticket,
        "unique_customers": unique_customers,
    }


def get_revenue_by_month(df: pd.DataFrame) -> list[dict]:
    """Agrupa receita total por mes calendario em ordem cronologica."""
    df = df.copy()
    df["month"] = df[COL_DATE].dt.to_period("M").astype(str)
    result = (
        df.groupby("month")[COL_SALES]
        .sum()
        .round(2)
        .reset_index()
        .rename(columns={COL_SALES: "revenue"})
        .sort_values("month")
    )
    return result.to_dict(orient="records")


def get_top_products(df: pd.DataFrame, limit: int = 10) -> list[dict]:
    """Retorna os N produtos com maior receita total."""
    result = (
        df.groupby(COL_PRODUCT)[COL_SALES]
        .sum()
        .round(2)
        .reset_index()
        .rename(columns={COL_PRODUCT: "product", COL_SALES: "revenue"})
        .sort_values("revenue", ascending=False)
        .head(limit)
    )
    return result.to_dict(orient="records")


def get_revenue_by_category(df: pd.DataFrame) -> list[dict]:
    """Agrupa receita total por linha de produto (categoria)."""
    result = (
        df.groupby(COL_PRODUCT_LINE)[COL_SALES]
        .sum()
        .round(2)
        .reset_index()
        .rename(columns={COL_PRODUCT_LINE: "category", COL_SALES: "revenue"})
        .sort_values("revenue", ascending=False)
    )
    return result.to_dict(orient="records")


def get_top_customers(df: pd.DataFrame, limit: int = 10) -> list[dict]:
    """Retorna os N clientes com maior receita total."""
    result = (
        df.groupby(COL_CUSTOMER)[COL_SALES]
        .sum()
        .round(2)
        .reset_index()
        .rename(columns={COL_CUSTOMER: "customer", COL_SALES: "revenue"})
        .sort_values("revenue", ascending=False)
        .head(limit)
    )
    return result.to_dict(orient="records")


def get_sales_by_country(df: pd.DataFrame) -> list[dict]:
    """Agrupa receita total por pais."""
    result = (
        df.groupby(COL_COUNTRY)[COL_SALES]
        .sum()
        .round(2)
        .reset_index()
        .rename(columns={COL_COUNTRY: "country", COL_SALES: "revenue"})
        .sort_values("revenue", ascending=False)
    )
    return result.to_dict(orient="records")


def get_filter_options(df: pd.DataFrame) -> dict:
    """Retorna os valores disponiveis para preencher os filtros da interface."""
    return {
        "categories": sorted(df[COL_PRODUCT_LINE].unique().tolist()),
        "countries": sorted(df[COL_COUNTRY].unique().tolist()),
        "date_range": {
            "min": df[COL_DATE].min().strftime("%Y-%m-%d"),
            "max": df[COL_DATE].max().strftime("%Y-%m-%d"),
        },
    }
