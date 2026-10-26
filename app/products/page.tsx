"use client";
import { useEffect, useState } from "react";
import ProductCard from "@/components/product-card";
import Pagination from "@/components/pagination";
import EmptyState from "@/components/empty-state";
import { Product } from "@/lib/types";

const categories = ["", "Home", "Travel", "Tech", "Fashion", "Books"];
const categoryCopy: Record<string, string> = {
  Home: "Useful pieces for a quieter home.",
  Travel: "Compact companions for getting away.",
  Tech: "Smart tools for the daily setup.",
  Fashion: "Easy layers and finishing details.",
  Books: "Good reading for slow afternoons.",
};
export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const pageSize = 8;
  const selectedCategoryCopy = category ? categoryCopy[category] : "Small products for better routines.";
  const hasSearch = search.trim().length > 0;
  const hasCategory = category.length > 0;
  const hasSort = sort.length > 0;
  const filterCount = [hasSearch, hasCategory, hasSort].filter(Boolean).length;

  useEffect(() => {
    const timer = setTimeout(() => {
      setQuery(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const loadProducts = () => {
    setLoading(true);
    setError("");
    fetch(
      `/api/products?search=${encodeURIComponent(query)}&category=${encodeURIComponent(category)}&sort=${sort}&page=${page}&pageSize=${pageSize}`,
    )
      .then((response) => {
        if (!response.ok) throw new Error("Could not load products");
        return response.json();
      })
      .then((data) => {
        setProducts(data.products);
        setTotal(data.total);
      })
      .catch(() =>
        setError(
          "We could not load products. Check your connection and try again.",
        ),
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProducts();
  }, [query, category, sort, page]);
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);
  const chooseCategory = (value: string) => {
    setCategory(value);
    setPage(1);
  };
  const chooseSort = (value: string) => {
    setSort(value);
    setPage(1);
  };

  return (
    <main className="container py-10">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-violet-700">
            The everyday store
          </p>
          <h1 className="mt-1 text-3xl font-black">Find something useful</h1>
          <p className="mt-2 text-slate-500">{selectedCategoryCopy}</p>
        </div>
        <p className="text-sm text-slate-500">
          Showing {start}–{end} of {total}
        </p>
      </div>
      <div className="mb-8 grid gap-3 rounded-xl border border-slate-200 bg-white p-4 md:grid-cols-[1fr_190px_190px]">
        <div>
          <span className="mb-1 block text-xs font-bold text-slate-600">
            Search products
          </span>
          <input
            className="field"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name…"
          />
        </div>
        <div>
          <label
            className="mb-1 block text-xs font-bold text-slate-600"
            htmlFor="category"
          >
            Category
          </label>
          <select
            id="category"
            className="field"
            value={category}
            onChange={(event) => chooseCategory(event.target.value)}
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item || "All categories"}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            className="mb-1 block text-xs font-bold text-slate-600"
            htmlFor="sort"
          >
            Sort by
          </label>
          <select
            id="sort"
            className="field"
            value={sort}
            onChange={(event) => chooseSort(event.target.value)}
          >
            <option value="">Featured</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="name">Name</option>
            <option value="rating">Rating</option>
          </select>
        </div>
      </div>
      {filterCount > 0 && (
        <div className="-mt-4 mb-6 flex items-center justify-between text-sm text-slate-500">
          <span>
            {filterCount} filter{filterCount === 1 ? "" : "s"} applied
          </span>
          <div
            className="cursor-pointer font-semibold text-violet-700"
            onClick={() => {
              setSearch("");
              setCategory("");
              setSort("");
              setPage(1);
            }}
          >
            Clear filters
          </div>
        </div>
      )}
      {loading && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="h-72 animate-pulse rounded-xl bg-slate-200"
            />
          ))}
        </div>
      )}
      {!loading && error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
          <p className="font-semibold text-red-800">{error}</p>
          <button className="btn mt-4" onClick={loadProducts}>
            Retry
          </button>
        </div>
      )}
      {!loading && !error && products.length === 0 && (
        <EmptyState
          title="No products found"
          text="Try a different search term or browse another category."
        />
      )}
      {!loading && !error && products.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <Pagination
            page={page}
            total={total}
            pageSize={pageSize}
            onChange={setPage}
          />
        </>
      )}
    </main>
  );
}
