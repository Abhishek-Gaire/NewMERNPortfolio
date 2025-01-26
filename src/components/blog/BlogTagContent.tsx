import React from "react";
import { Tag } from "lucide-react";
import { BlogPost,Tags } from "../../types";

interface BlogPostProps {
  post: BlogPost;
}

// Function to safely parse JSON or return null if invalid
const safeParseTag = (tag: string): Tags | null => {
    try {
      return JSON.parse(tag);
    } catch {
      return null; // Return null for non-JSON strings
    }
};
  
export default function BlogTagContent({ post }: BlogPostProps) {
    // Parse tags safely, handling both JSON strings and plain strings
    const parsedTags: Tags[] = post.tags
      .map((tag) => {
        if (typeof tag === "string") {
          const parsedTag = safeParseTag(tag);
          return parsedTag || { id: tag, name: tag }; // Use `tag` as both id and name if parsing fails
        }
        return tag as Tags; // If already a Tag object, return it
      });
  
    return (
      <div className="flex flex-wrap gap-2">
        {parsedTags.map((tag) => (
          <span
            key={tag.id}
            className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
          >
            <Tag size={12} className="mr-1"/>
            {tag.name} {/* Display the name of the tag */}
          </span>
        ))}
      </div>
    );
}
