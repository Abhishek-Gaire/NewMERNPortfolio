import { BlogPost } from "../../types";
import { BlogArticle } from "./BlogArticle";

type BlogPostProps = {
  post: BlogPost;
  view: string;
  selectedTag: string[];
};

export default function SelectedTagPost({
  post,
  view,
  selectedTag,
}: BlogPostProps) {
  return (
    <>
      {post.tags.some((tag) => {
        const parsedTag = typeof tag === "string" ? JSON.parse(tag) : tag;
        return selectedTag.includes(parsedTag.name);
      }) && <BlogArticle post={post} view={view} />}
    </>
  );
}
