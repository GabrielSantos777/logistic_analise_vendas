import pandas as pd
from functools import lru_cache

# Carregamento e limpeza dos dados

@lru_cache(maxsize=1)
def load_data() -> pd.DataFrame:
    # Carrega o CSV uma única vez e mantém em memória (cache).
    # lru_cache garante que o arquivo não seja lido a cada requisição.

    df = pd.read_csv('../data/sales_data_sample.csv', encoding='latin-1')

    # Converte a coluna 'ORDERDATE' para o formato datetime, facilitando análises temporais.
    df['ORDERDATE'] = pd.to_datetime(df['ORDERDATE'], format='%m/%d/%y')

    # Trata a coluna TERRITORY
    df['TERRITORY'] = df['TERRITORY'].fillna('North America')

    return df

def apply_filters(
    df: pd.DataFrame,
    start_date: str | None,
    end_date: str | None,
    category: str | None,
    country: str | None
) -> pd.DataFrame:
    if start_date:
        df = df[df['ORDERDATE'] >= pd.to_datetime(start_date)]
    if end_date:
        df = df[df['ORDERDATE'] <= pd.to_datetime(end_date)]
    if category:
        df = df[df['CATEGORY'] == category]
    if country:
        df = df[df['COUNTRY'] == country]
    return df


# Funções de análise de dados (uma por endpoint)

def get_kpis(df: pd.DataFrame) -> dict:
    total_revenue = round(df['SALES'].sum(), 2)
    total_orders = df["ORDERNUMBER"].nunique()
    avg_ticket = round(total_revenue / total_orders, 2) if total_orders > 0 else 0
    unique_customers = df['CUSTOMERNAME'].nunique()
    return {
        'total_revenue': total_revenue,
        'total_orders': total_orders,
        'avg_ticket': avg_ticket,
        'unique_customers': unique_customers
    }

def get_revenue_by_month(df: pd.DataFrame) -> list[dict]:
    # Agrupa receita por ano-mês e retorna lista ordenada.

    df = df.copy()
    df['month'] = df['ORDERDATE'].dt.to_period('M').astype(str)
    result = (
        df.groupby('month')['SALES']
        .sum()
        .round(2)
        .reset_index()
        .rename(columns={'SALES': 'revenue'})
        .sort_values('month')
    )
    return result.to_dict(orient='records')

def get_top_products(df: pd.DataFrame, limit: int = 10) -> list[dict]:
    # Retorna os produtos mais vendidos por receita.
    result = (
        df.groupby('PRODUCTCODE')['SALES']
        .sum()
        .round(2)
        .reset_index()
        .rename(columns={'SALES': 'revenue', 'PRODUCTCODE': 'product'})
        .sort_values('revenue', ascending=False)
        .head(limit)
    )
    return result.to_dict(orient='records')

def get_revenue_by_category(df: pd.DataFrame) -> list[dict]:
    result = (
        df.groupby("PRODUCTLINE")["SALES"]
        .sum()
        .round(2)
        .reset_index()
        .rename(columns={"PRODUCTLINE": "category", "SALES": "revenue"})
        .sort_values("revenue", ascending=False)
    )
    return result.to_dict(orient="records")

def get_top_customers(df: pd.DataFrame, limit: int = 10) -> list[dict]:
    # Retorna os clientes que mais gastaram.
    result = (
        df.groupby('CUSTOMERNAME')['SALES']
        .sum()
        .round(2)
        .reset_index()
        .rename(columns={'SALES': 'revenue', 'CUSTOMERNAME': 'customer'})
        .sort_values('revenue', ascending=False)
        .head(limit)
    )
    return result.to_dict(orient='records')

def get_sales_by_country(df: pd.DataFrame) -> list[dict]:
    # Agrupa receita por país e retorna lista ordenada.
    result = (
        df.groupby('COUNTRY')['SALES']
        .sum()
        .round(2)
        .reset_index()
        .rename(columns={'SALES': 'revenue', "COUNTRY": "country"})
        .sort_values('revenue', ascending=False)
    )
    return result.to_dict(orient='records')

def get_filter_options(df: pd.DataFrame) -> dict:
    # Retorna opções únicas para filtros de categoria e país.

    df = load_data()

    return{
        "categories": sorted(df['CATEGORY'].unique().tolist()),
        "countries": sorted(df['COUNTRY'].unique().tolist()),
        "data_ran": {
            "min": df['ORDERDATE'].min().strftime('%Y-%m-%d'),
            "max": df['ORDERDATE'].max().strftime('%Y-%m-%d')
        }
    }
    