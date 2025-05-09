import React from 'react';

function Disclaimer() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-8 text-white">Disclaimer</h1>
          <p className="text-gray-300 mb-6">Effective Date: [08/05/2025]</p>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 mb-6">
              VoltWorx provides a platform that connects startups and creators with students for task-based project execution. While we aim to facilitate real-world collaboration and learning opportunities, we make the following disclaimers:
            </p>

            <div className="border-t border-gray-700 my-8"></div>

            <h2 className="text-2xl font-semibold mb-4 text-white">1. No Guarantees of Results</h2>
            <p className="text-gray-300 mb-4">VoltWorx does not guarantee:</p>
            <ul className="text-gray-300 list-disc pl-6 mb-8 space-y-2">
              <li>The quality, originality, or timeliness of any student submission</li>
              <li>That any student will apply or complete a specific task</li>
              <li>That startups will fairly reward submissions or provide external opportunities</li>
            </ul>
            <p className="text-gray-300 mb-8">All interactions and results depend on the individual users involved.</p>

            <div className="border-t border-gray-700 my-8"></div>

            <h2 className="text-2xl font-semibold mb-4 text-white">2. Independent Users</h2>
            <p className="text-gray-300 mb-4">All startups, creators, and students using the platform are independent users. VoltWorx does not employ, endorse, or represent any user on the platform.</p>
            <p className="text-gray-300 mb-4">We are not liable for:</p>
            <ul className="text-gray-300 list-disc pl-6 mb-8 space-y-2">
              <li>Miscommunication between users</li>
              <li>Misuse of content or intellectual property</li>
              <li>Any post-collaboration arrangements outside VoltWorx</li>
            </ul>

            <div className="border-t border-gray-700 my-8"></div>

            <h2 className="text-2xl font-semibold mb-4 text-white">3. Intellectual Property</h2>
            <p className="text-gray-300 mb-4">While VoltWorx encourages transparency, it is the user's responsibility to protect their own ideas and projects when using the Collaboration Hub or public task posts. We recommend using NDAs when necessary.</p>
            <p className="text-gray-300 mb-4">We are not responsible for:</p>
            <ul className="text-gray-300 list-disc pl-6 mb-8 space-y-2">
              <li>IP theft or disputes between users</li>
              <li>Reuse or replication of ideas shared voluntarily</li>
            </ul>

            <div className="border-t border-gray-700 my-8"></div>

            <h2 className="text-2xl font-semibold mb-4 text-white">4. Platform Availability</h2>
            <p className="text-gray-300 mb-8">VoltWorx may occasionally go offline due to maintenance, upgrades, or technical issues. We do not guarantee uninterrupted access or uptime.</p>

            <div className="border-t border-gray-700 my-8"></div>

            <h2 className="text-2xl font-semibold mb-4 text-white">5. External Links</h2>
            <p className="text-gray-300 mb-8">Some pages may contain links to third-party sites. VoltWorx is not responsible for the content, privacy policies, or practices of external websites.</p>

            <div className="border-t border-gray-700 my-8"></div>

            <h2 className="text-2xl font-semibold mb-4 text-white">6. Limitation of Liability</h2>
            <p className="text-gray-300 mb-4">To the fullest extent permitted by law, VoltWorx is not liable for:</p>
            <ul className="text-gray-300 list-disc pl-6 mb-8 space-y-2">
              <li>Direct, indirect, or consequential damages from platform use</li>
              <li>Data loss, account compromise, or financial loss</li>
              <li>Actions taken by users based on information found on the platform</li>
            </ul>

            <div className="border-t border-gray-700 my-8"></div>

            <h2 className="text-2xl font-semibold mb-4 text-white">7. Contact Us</h2>
            <p className="text-gray-300">For concerns or clarification, reach out to:</p>
            <p className="mt-2 text-gray-300">📧 team.voltworx@gmail.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Disclaimer; 