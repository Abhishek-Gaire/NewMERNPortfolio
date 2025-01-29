import React, { useState } from "react";
import { User } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import { supabase } from "../../../lib/supabase";
import { useQuery } from "@tanstack/react-query";

import NotificationButton from "../shared/NotificationButton";

export default function TopBar() {
  const { signOut } = useAuth();
  const [count, setCount] = useState(0);

  const { error } = useQuery({
    queryKey: ["contact-count"],
    queryFn: async () => {
      // Fetch only the count of rows
      const { count, error } = await supabase
        .from("Contacts")
        .select("*", { count: "exact", head: true }); // `head: true` ensures no data is returned

      if (error) {
        throw new Error(error.message); // Throw error to be caught by React Query
      }

      // Set the count state with the number of rows
      setCount(count || 0);

      // No need to return data since we're only fetching the count
      return null;
    },
  });
  return (
    <header className="bg-white shadow">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              {/* Mobile menu button */}
              <button type="button" className="md:hidden px-4">
                <span className="sr-only">Open sidebar</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div className="flex items-center">
            {error ? "" : <NotificationButton count={count} />}
            <div className="ml-3 relative">
              <div className="flex items-center">
                <button className="flex items-center max-w-xs rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <User className="h-8 w-8 p-1 rounded-full bg-gray-100" />
                </button>
                <button
                  onClick={() => signOut()}
                  className="ml-3 text-sm text-gray-700 hover:text-gray-900"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
