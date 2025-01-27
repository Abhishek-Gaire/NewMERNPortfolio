import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { Search, Grid, List, X, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "../lib/supabase";
import { BlogPost } from "../types";
import Header from "../components/Header";
import Footer from "../components/Footer";
import LoadingSpinner from "../components/shared/LoadingSpinner";
import ErrorBoundary from "../components/shared/ErrorBoundary";

import SelectedTagPost from "../components/blog/SelectedTagPost";
import { BlogArticle } from "../components/blog/BlogArticle";

const POSTS_PER_PAGE_OPTIONS = [5, 10, 20, 50];

export default function BlogListing() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [view, setView] = useState(
    () => localStorage.getItem("blogViewPreference") || "grid"
  );

  // Pagination state
  const page = parseInt(searchParams.get("page") || "1");
  const postsPerPage = parseInt(searchParams.get("limit") || "5");
  const search = searchParams.get("search") || "";
  const sortBy = searchParams.get("sort") || "newest";
  const selectedTags = searchParams.getAll("tag");

  // Fetch tags for filter
  const { data: tags } = useQuery({
    queryKey: ["blog-tags"],
    queryFn: async () => {
      const { data, error } = await supabase.from("tags").select("*");
      if (error) throw error;

      return data;
    },
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["blog-posts", page, postsPerPage, search, sortBy, selectedTags],
    queryFn: async () => {
      let query = supabase.from("Blogs").select("*", { count: "exact" });

      // Apply search filter
      if (search) {
        query = query.or(`title.ilike.%${search}%`);
      }

      // Apply sorting
      if (sortBy === "oldest") {
        query = query.order("created_at", { ascending: true });
      } else {
        query = query.order("created_at", { ascending: false });
      }

      // Apply pagination
      const from = (page - 1) * postsPerPage;
      query = query.range(from, from + postsPerPage - 1);

      const { data, error, count } = await query;

      // Ensure data is treated as an array of BlogPost
      const posts: BlogPost[] = data || [];

      if (error) throw error;
      return {
        posts,
        total: count || 0,
      };
    },
  });

  // Provide fallback values
  const posts = data?.posts ?? [];

  // Update view preference
  useEffect(() => {
    localStorage.setItem("blogViewPreference", view);
  }, [view]);

  const totalPages = Math.ceil((data?.total || 0) / postsPerPage);

  const updateSearchParams = (updates: Record<string, any>) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null) {
        newParams.delete(key);
      } else {
        newParams.set(key, value.toString());
      }
    });
    setSearchParams(newParams);
  };

  if (error) {
    return <div>Error loading blog posts</div>;
  }

  return (
    <ErrorBoundary>
      <Helmet>
        <title>Blogs</title>
        <meta
          name="description"
          content="Read our latest blog posts about web development, technology, and more."
        />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-12">
          {/* Search and Filters */}
          <div className="mb-8 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between">
            <div className="relative flex-1 max-w-lg">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search by title..."
                value={search}
                onChange={(e) =>
                  updateSearchParams({ search: e.target.value, page: 1 })
                }
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {search && (
                <button
                  onClick={() => updateSearchParams({ search: null, page: 1 })}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <select
                value={sortBy}
                onChange={(e) =>
                  updateSearchParams({ sort: e.target.value, page: 1 })
                }
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setView("grid")}
                  className={`p-2 rounded-lg ${
                    view === "grid"
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-600"
                  }`}
                >
                  <Grid size={20} />
                </button>
                <button
                  onClick={() => setView("list")}
                  className={`p-2 rounded-lg ${
                    view === "list"
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-600"
                  }`}
                >
                  <List size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Tags Filter */}
          {tags && tags.length > 0 && (
            <div className="mb-8">
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => {
                      const newTags = selectedTags.includes(tag.name)
                        ? selectedTags.filter((name) => name !== tag.name)
                        : [...selectedTags, tag.name];

                      const params = new URLSearchParams(searchParams);
                      params.delete("tag");
                      newTags.forEach((name) => params.append("tag", name));
                      params.set("page", "1");
                      setSearchParams(params);
                    }}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedTags.includes(tag.name)
                        ? "bg-blue-100 text-blue-600"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Posts Grid/List */}
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <div
              className={`grid gap-8 ${
                view === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1"
              }`}
            >
              {selectedTags.length !== 0 ? (
                <>
                  {posts.map((post: BlogPost) => (
                    <SelectedTagPost
                      post={post}
                      view={view}
                      selectedTag={selectedTags}
                    />
                  ))}
                </>
              ) : (
                <>
                  {posts.map((post: BlogPost) => (
                    <BlogArticle key={post.id} post={post} view={view} />
                  ))}
                </>
              )}
            </div>
          )}

          {/* Pagination */}
          <div className="mt-8 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Show</span>
              <select
                value={postsPerPage}
                onChange={(e) =>
                  updateSearchParams({
                    limit: e.target.value,
                    page: 1,
                  })
                }
                className="border border-gray-300 rounded-lg px-2 py-1"
              >
                {POSTS_PER_PAGE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <span className="text-sm text-gray-600">per page</span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => updateSearchParams({ page: page - 1 })}
                disabled={page === 1}
                className="p-2 border border-gray-300 rounded-lg disabled:opacity-50"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => updateSearchParams({ page: page + 1 })}
                disabled={page >= totalPages}
                className="p-2 border border-gray-300 rounded-lg disabled:opacity-50"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </ErrorBoundary>
  );
}
