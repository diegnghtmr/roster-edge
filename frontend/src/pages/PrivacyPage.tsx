import React from 'react';

const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      
      <div className="prose max-w-none text-gray-600 space-y-4">
        <p>
          <strong>Last updated:</strong> March 2024
        </p>
        
        <h2 className="text-2xl font-semibold mt-6 mb-3 text-gray-900">1. Information We Collect</h2>
        <p>
          We collect information you provide directly to us, such as when you create an account,
          update your profile, or contact us for support.
        </p>
        
        <h2 className="text-2xl font-semibold mt-6 mb-3 text-gray-900">2. How We Use Your Information</h2>
        <p>
          We use the information we collect to provide, maintain, and improve our services,
          including to:
        </p>
        <ul className="list-disc list-inside ml-4 space-y-1">
          <li>Create and manage your account</li>
          <li>Process transactions and send related information</li>
          <li>Send you technical notices and support messages</li>
          <li>Respond to your comments and questions</li>
        </ul>
        
        <h2 className="text-2xl font-semibold mt-6 mb-3 text-gray-900">3. Information Sharing</h2>
        <p>
          We do not sell, trade, or otherwise transfer your personal information to third parties
          without your consent, except as described in this privacy policy.
        </p>
        
        <h2 className="text-2xl font-semibold mt-6 mb-3 text-gray-900">4. Data Security</h2>
        <p>
          We take reasonable measures to help protect your personal information from loss, theft,
          misuse, unauthorized access, disclosure, alteration, and destruction.
        </p>
        
        <h2 className="text-2xl font-semibold mt-6 mb-3 text-gray-900">5. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us at
          privacy@rosteredge.com.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPage;
