import React from "react";

import { BlogPost,Tag } from "../../types";

interface BlogPostProps {
  post: BlogPost;
}

// Function to safely parse JSON or return null if invalid
const safeParseTag = (tag: string): Tag | null => {
    try {
      return JSON.parse(tag);
    } catch {
      return null; // Return null for non-JSON strings
    }
};
  
export default function BlogTagContent({ post }: BlogPostProps) {
    // Parse tags safely, handling both JSON strings and plain strings
    const parsedTags: Tag[] = post.tags
      .map((tag) => {
        if (typeof tag === "string") {
          const parsedTag = safeParseTag(tag);
          return parsedTag || { id: tag, name: tag }; // Use `tag` as both id and name if parsing fails
        }
        return tag as Tag; // If already a Tag object, return it
      });
  
    return (
      <div className="flex flex-wrap gap-2">
        {parsedTags.map((tag) => (
          <span
            key={tag.id}
            className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
          >
            {tag.name} {/* Display the name of the tag */}
          </span>
        ))}
      </div>
    );
}
