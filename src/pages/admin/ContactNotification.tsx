import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { Trash2 } from "lucide-react";

const ContactNotification = () => {
  const [contacts, setContacts] = useState([null]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from the contact table
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const { data, error } = await supabase
          .from("Contacts")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          throw error;
        }
        setContacts(data || []);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  // Delete a contact
  const handleDelete = async (id: number) => {
    try {
      console.log(id);
      const { error } = await supabase.from("Contacts").delete().eq("id", id);
      if (error) {
        throw error;
      }

      // Remove the deleted contact from the state
      setContacts((prevContacts) =>
        prevContacts.filter((contact) => contact.id !== id)
      );
    } catch (error: any) {
      setError(error.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Contact Notifications</h1>
      <div className="space-y-4">
        {contacts.length === 0 ? (
          <p>No contacts found.</p>
        ) : (
          contacts.map((contact) => (
            <div
              key={contact.id}
              className="p-4 bg-white rounded-lg shadow-md flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{contact.name}</p>
                <p className="text-gray-600">{contact.email}</p>
                <p className="text-gray-600">{contact.message}</p>
              </div>
              <button
                onClick={() => handleDelete(contact.id)}
                className="text-red-600 hover:text-red-800 transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ContactNotification;
