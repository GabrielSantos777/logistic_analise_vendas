from fastapi import Depends, FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from app.data_service import (
    load_data,
    get_kpis,
    apply_filters,
    get_revenue_by_month,
    get_top_products,
    get_revenue_by_category,
    get_top_customers,
    get_sales_by_country,
    get_filter_options
)

app = FastAPI(title="Sales Dashboard Logistic", description="Dashboard de Vendas Logistic")

origins = [
    "http://localhost:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def common_filters (
    start_date: str | None = Query(None, description="Formato: YYYY-MM-DD"),
    end_date: str | None = Query(None, description="Formato: YYYY-MM-DD"),
    category: str | None = Query(None, description="Ex: Classic Cars"),
    country: str | None = Query(None, description="Ex: USA"),
):
    return {
        "start_date": start_date,
        "end_date": end_date,
        "category": category,
        "country": country
    }

@app.get("/api")
def read_root():
    return {"message": "Bem-vindo ao meu projeto!"}

@app.get("/api/kpis")
def kpis(filters: dict = Depends(common_filters)):
    df = apply_filters(load_data().copy(), **filters)
    return get_kpis(df)

@app.get("/api/revenue-by-month")
def revenue_by_month(filters: dict = Depends(common_filters)):
    df = apply_filters(load_data().copy(), **filters)
    return get_revenue_by_month(df)

@app.get("/api/top-products")
def top_products(filters: dict = Depends(common_filters)):
    df = apply_filters(load_data().copy(), **filters)
    return get_top_products(df)

@app.get("/api/revenue-by-category")
def revenue_by_category(filters: dict = Depends(common_filters)):
    df = apply_filters(load_data().copy(), **filters)
    return get_revenue_by_category(df)

@app.get("/api/top-customers")
def top_customers(filters: dict = Depends(common_filters)):
    df = apply_filters(load_data().copy(), **filters)
    return get_top_customers(df)

@app.get("/api/sales-by-country")
def sales_by_country(filters: dict = Depends(common_filters)):
    df = apply_filters(load_data().copy(), **filters)
    return get_sales_by_country(df)

@app.get("/api/filter-options")
def filter_options():
    return get_filter_options(load_data().copy())
