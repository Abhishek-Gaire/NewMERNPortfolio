import { Link } from "react-router-dom";

import { BlogPost } from "../../types";
import { formatDate } from "../../utils/dateUtils";
import { estimateReadingTime } from "../../utils/textUtils";
import BlogContent from "./BlogContent";
import BlogTagContent from "./BlogTagContent";

interface BlogArticleProps {
  post: BlogPost;
  view: string;
}
export function BlogArticle({ post, view }: BlogArticleProps) {
  return (
    <article
      key={post.id}
      className={`bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow ${
        view === "list" ? "flex" : ""
      }`}
    >
      {post.imageUrl && (
        <div className={view === "list" ? "w-1/4" : ""}>
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-48 object-cover"
          />
        </div>
      )}
      <div className={`p-6 ${view === "list" ? "w-3/4" : ""}`}>
        <h2 className="text-xl font-semibold mb-2">
          <Link to={`/blog/${post.id}`} className="hover:text-blue-600">
            {post.title}
          </Link>
        </h2>
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <span>{formatDate(post.created_at)}</span>
          <span className="mx-2">•</span>
          <span>{estimateReadingTime(post.content)} min read</span>
        </div>
        <BlogContent content={post.content.substring(0, 150)} />
        <BlogTagContent post={post} />
      </div>
    </article>
  );
}
