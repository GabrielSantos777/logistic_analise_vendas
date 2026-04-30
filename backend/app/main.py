from os import getenv

from fastapi import Depends, FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware

from app.data_service import (
    apply_filters,
    get_filter_options,
    get_kpis,
    get_revenue_by_category,
    get_revenue_by_month,
    get_sales_by_country,
    get_top_customers,
    get_top_products,
    load_data,
)

app = FastAPI()

origins = [
    "http://localhost:8080",
    "http://127.0.0.1:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_filters(
    start_date: str | None = Query(None, description="Data inicial no formato YYYY-MM-DD"),
    end_date: str | None = Query(None, description="Data final no formato YYYY-MM-DD"),
    category: str | None = Query(None, description="Linha de produto, ex: Classic Cars"),
    country: str | None = Query(None, description="Pais, ex: USA"),
) -> dict[str, str | None]:
    """Padroniza os filtros recebidos na query string."""
    return {
        "start_date": start_date,
        "end_date": end_date,
        "category": category,
        "country": country,
    }


def get_filtered_df(filters: dict[str, str | None] = Depends(get_filters)):
    """Aplica filtros sobre uma copia do DataFrame em cache."""
    return apply_filters(load_data().copy(), **filters)


@app.get("/api", tags=["Saude"])
def health_check() -> dict[str, str]:
    return {"status": "ok", "version": "1.1.0"}


@app.get("/api/filter-options", tags=["Filtros"])
def filter_options():
    return get_filter_options(load_data().copy())


@app.get("/api/kpis", tags=["Analiticos"])
def kpis(df=Depends(get_filtered_df)):
    return get_kpis(df)


@app.get("/api/revenue-by-month", tags=["Analiticos"])
def revenue_by_month(df=Depends(get_filtered_df)):
    return get_revenue_by_month(df)


@app.get("/api/top-products", tags=["Analiticos"])
def top_products(df=Depends(get_filtered_df)):
    return get_top_products(df)


@app.get("/api/revenue-by-category", tags=["Analiticos"])
def revenue_by_category(df=Depends(get_filtered_df)):
    return get_revenue_by_category(df)


@app.get("/api/top-customers", tags=["Analiticos"])
def top_customers(df=Depends(get_filtered_df)):
    return get_top_customers(df)


@app.get("/api/sales-by-country", tags=["Analiticos"])
def sales_by_country(df=Depends(get_filtered_df)):
    return get_sales_by_country(df)
