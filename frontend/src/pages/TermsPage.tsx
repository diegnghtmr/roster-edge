import React from 'react';

const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      
      <div className="prose max-w-none text-gray-600 space-y-4">
        <p>
          <strong>Last updated:</strong> March 2024
        </p>
        
        <h2 className="text-2xl font-semibold mt-6 mb-3 text-gray-900">1. Acceptance of Terms</h2>
        <p>
          By accessing and using RosterEdge, you accept and agree to be bound by the terms and
          provision of this agreement.
        </p>
        
        <h2 className="text-2xl font-semibold mt-6 mb-3 text-gray-900">2. Use License</h2>
        <p>
          Permission is granted to temporarily use RosterEdge for personal, non-commercial
          transitory viewing only. This is the grant of a license, not a transfer of title.
        </p>
        
        <h2 className="text-2xl font-semibold mt-6 mb-3 text-gray-900">3. User Account</h2>
        <p>
          To access certain features of the service, you must register for an account. You agree to:
        </p>
        <ul className="list-disc list-inside ml-4 space-y-1">
          <li>Provide accurate and complete information</li>
          <li>Maintain the security of your password</li>
          <li>Accept responsibility for all activities under your account</li>
          <li>Notify us immediately of any unauthorized use</li>
        </ul>
        
        <h2 className="text-2xl font-semibold mt-6 mb-3 text-gray-900">4. Prohibited Uses</h2>
        <p>
          You may not use our service:
        </p>
        <ul className="list-disc list-inside ml-4 space-y-1">
          <li>For any unlawful purpose</li>
          <li>To solicit others to perform unlawful acts</li>
          <li>To violate any international, federal, provincial, or state regulations</li>
          <li>To infringe upon or violate our intellectual property rights</li>
        </ul>
        
        <h2 className="text-2xl font-semibold mt-6 mb-3 text-gray-900">5. Disclaimer</h2>
        <p>
          The materials on RosterEdge are provided on an 'as is' basis. RosterEdge makes no
          warranties, expressed or implied, and hereby disclaims and negates all other warranties
          including, without limitation, implied warranties or conditions of merchantability,
          fitness for a particular purpose, or non-infringement of intellectual property.
        </p>
        
        <h2 className="text-2xl font-semibold mt-6 mb-3 text-gray-900">6. Contact Information</h2>
        <p>
          If you have any questions about these Terms of Service, please contact us at
          legal@rosteredge.com.
        </p>
      </div>
    </div>
  );
};

export default TermsPage;
