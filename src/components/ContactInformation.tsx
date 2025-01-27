import { Mail, MapPin, Phone } from "lucide-react";

export default function ContactInformation() {
  return (
    <div>
      <h3 className="text-2xl font-semibold mb-6">Contact Information</h3>
      <div className="space-y-4">
        <div className="flex items-center">
          <Mail className="text-blue-600 mr-4" size={24} />
          <div>
            <p className="font-medium">Email</p>
            <a href="mailto:abhisekgaire7@gmail.com" className="text-gray-600">
              abhisekgaire7@gmail.com
            </a>
          </div>
        </div>
        <div className="flex items-center">
          <Phone className="text-blue-600 mr-4" size={24} />
          <div>
            <p className="font-medium">Phone</p>
            <a href="tel:+9770840030468" className="text-gray-600">
              +977 9840030468
            </a>
          </div>
        </div>
        <div className="flex items-center">
          <MapPin className="text-blue-600 mr-4" size={24} />
          <div>
            <p className="font-medium">Location</p>
            <p className="text-gray-600">Pokhara,Nepal</p>
          </div>
        </div>
      </div>
    </div>
  );
}
