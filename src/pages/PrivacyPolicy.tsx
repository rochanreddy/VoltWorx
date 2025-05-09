import React from 'react';

function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-8 text-white">Privacy Policy</h1>
          <p className="text-gray-300 mb-6">Effective Date: [08/05/2025]</p>

          <div className="prose prose-invert max-w-none">
            <section className="mb-8">
              <p className="text-gray-300 mb-6">
                VoltWorx ("we", "our", or "us") respects your privacy. This Privacy Policy explains how we collect, use, and protect the information of users ("you") on our platform — including students, startups, creators, and collaborators.
                By using VoltWorx, you agree to the collection and use of information in accordance with this policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">1. Information We Collect</h2>
              
              <h3 className="text-xl font-semibold mb-3 text-gray-200">a. Personal Information</h3>
              <p className="text-gray-300 mb-4">When you register or interact with VoltWorx, we may collect:</p>
              <ul className="text-gray-300 list-disc pl-6 mb-6">
                <li>Name</li>
                <li>Email address</li>
                <li>College/Company name</li>
                <li>Skill tags or project interests</li>
                <li>Uploaded portfolios, links, or files</li>
                <li>Communication preferences</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-gray-200">b. Usage Data</h3>
              <p className="text-gray-300 mb-4">We automatically collect:</p>
              <ul className="text-gray-300 list-disc pl-6 mb-6">
                <li>IP address</li>
                <li>Browser type/device</li>
                <li>Time spent on pages</li>
                <li>Pages visited</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-gray-200">c. Task & Submission Data</h3>
              <ul className="text-gray-300 list-disc pl-6 mb-6">
                <li>Details of tasks posted by startups/creators</li>
                <li>Submissions, links, and GitHub repos by students</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">2. How We Use Your Information</h2>
              <p className="text-gray-300 mb-4">We use your data to:</p>
              <ul className="text-gray-300 list-disc pl-6 mb-6">
                <li>Match students with relevant tasks</li>
                <li>Notify users of project updates</li>
                <li>Enable collaboration in the Startup Hub</li>
                <li>Improve our platform's UX and features</li>
                <li>Detect misuse, abuse, or fraudulent behavior</li>
                <li>Respond to inquiries or support requests</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">3. Data Sharing</h2>
              <p className="text-gray-300 mb-4">We do not sell your data.</p>
              <p className="text-gray-300 mb-4">We may share data only with:</p>
              <ul className="text-gray-300 list-disc pl-6 mb-6">
                <li>Payment processors (Razorpay)</li>
                <li>Analytics tools (Google Analytics)</li>
                <li>Legal authorities if required by law</li>
              </ul>
              <p className="text-gray-300">All third parties adhere to strict data protection rules.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">4. Data Security</h2>
              <p className="text-gray-300 mb-4">We use industry-standard security protocols to:</p>
              <ul className="text-gray-300 list-disc pl-6 mb-6">
                <li>Encrypt sensitive data</li>
                <li>Prevent unauthorized access</li>
                <li>Protect account information</li>
              </ul>
              <p className="text-gray-300">However, no platform is 100% secure. Use VoltWorx at your own risk.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">5. Cookies and Tracking</h2>
              <p className="text-gray-300 mb-4">We may use cookies to:</p>
              <ul className="text-gray-300 list-disc pl-6 mb-6">
                <li>Remember your login</li>
                <li>Track analytics</li>
                <li>Personalize your dashboard</li>
              </ul>
              <p className="text-gray-300">You can disable cookies in your browser settings.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">6. Your Rights</h2>
              <p className="text-gray-300 mb-4">You may:</p>
              <ul className="text-gray-300 list-disc pl-6 mb-6">
                <li>Request a copy of your data</li>
                <li>Request deletion of your account</li>
                <li>Request correction of inaccurate data</li>
              </ul>
              <p className="text-gray-300">Send requests to: team.voltworx@gmail.com</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">7. Children's Privacy</h2>
              <p className="text-gray-300">
                VoltWorx is not intended for children under 16. We do not knowingly collect data from minors.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">8. Collaboration Hub Warning</h2>
              <p className="text-gray-300">
                VoltWorx is not responsible for data or ideas shared voluntarily in the Collaboration Hub. Use caution when sharing sensitive or proprietary content with other users.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">9. Policy Updates</h2>
              <p className="text-gray-300">
                We may update this Privacy Policy periodically. You'll be notified on the website if major changes occur.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">10. Contact Us</h2>
              <p className="text-gray-300">
                For privacy concerns or data access requests, contact:{' '}
                <a href="mailto:team.voltworx@gmail.com" className="text-blue-400 hover:text-blue-300">
                  📧 team.voltworx@gmail.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicy; 