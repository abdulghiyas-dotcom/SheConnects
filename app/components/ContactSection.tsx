"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

// Internal form component
function ContactForm({ content, common }: ContactProps) {
  const searchParams = useSearchParams();
  
  // 1. Get the values directly in the component body
  const freelancerName = searchParams.get("freelancer");

  const [message, setMessage] = useState("");

  // 2. This Effect will now trigger precisely when freelancerName becomes available
  useEffect(() => {
    if (freelancerName) {
      console.log("Auto-filling for:", freelancerName); // Debugging line
      setMessage(`Hello SheConnects,\n\nI’m interested in working with ${freelancerName}. Please share availability, pricing, and next steps.\n\nThank you.`);
    }
  }, [freelancerName]); // <-- Crucial: Depend on the name, not just the whole params object

  return (
    <form>
      {/* Visual Badge */}
      {freelancerName && (
        <div className="badge">Inquiry for {freelancerName}</div>
      )}
      
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        // ... rest of props
      />
    </form>
  );
}

// Main exported component with Suspense boundary
export default function ContactSection(props: ContactProps) {
  return (
    <Suspense fallback={<div>Loading form...</div>}>
      <ContactForm {...props} />
    </Suspense>
  );
}
