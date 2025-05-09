import React from 'react';

function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-8 text-white">Terms and Conditions</h1>
          <p className="text-gray-300 mb-6">Last Updated: [08/05/2025]</p>

          <div className="prose prose-invert max-w-none">
            <section className="mb-8">
              <p className="text-gray-300 mb-6">
                Welcome to VoltWorx! These Terms and Conditions ("Terms") govern your access to and use of the VoltWorx platform ("Platform"), operated by VoltWorx.
                By using VoltWorx as a Startup, Creator, or Student, you agree to be bound by these Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">1. Eligibility</h2>
              <ul className="text-gray-300 list-disc pl-6 mb-6">
                <li>Users must be 16 years or older to create an account.</li>
                <li>Students must ensure the skills listed in their profile are accurate and truthful.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">2. Platform Description</h2>
              <p className="text-gray-300 mb-4">
                VoltWorx connects startups and creators with skilled students to complete real-world micro-projects. The platform facilitates:
              </p>
              <ul className="text-gray-300 list-disc pl-6 mb-6">
                <li>Task posting by startups</li>
                <li>Student applications & submissions</li>
                <li>Task selection and reward disbursement</li>
              </ul>
              <p className="text-gray-300">VoltWorx does not guarantee outcomes or employment.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">3. User Responsibilities</h2>
              
              <h3 className="text-xl font-semibold mb-3 text-gray-200">Startups & Creators:</h3>
              <ul className="text-gray-300 list-disc pl-6 mb-6">
                <li>Must clearly describe tasks, timelines, and reward amounts.</li>
                <li>Must commit to selecting and rewarding at least one student submission, unless quality is unanimously unacceptable.</li>
                <li>Cannot contact students outside VoltWorx until a submission is accepted.</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-gray-200">Students:</h3>
              <ul className="text-gray-300 list-disc pl-6 mb-6">
                <li>Must submit only original work.</li>
                <li>Must follow deadlines and avoid plagiarism.</li>
                <li>Must accept that only one or limited submissions may be rewarded.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">4. Reward and Payment Terms</h2>
              <ul className="text-gray-300 list-disc pl-6 mb-6">
                <li>Rewards are held by VoltWorx until the startup selects a submission.</li>
                <li>If no submission is selected, a full refund is initiated to the startup within 7 days.</li>
                <li>VoltWorx takes a platform commission (10% from each reward transaction).</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">5. Account Termination</h2>
              <p className="text-gray-300 mb-4">We reserve the right to suspend or terminate accounts that:</p>
              <ul className="text-gray-300 list-disc pl-6 mb-6">
                <li>Violate these terms</li>
                <li>Submit plagiarized or fraudulent content</li>
                <li>Abuse other users or misuse the platform</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">6. Intellectual Property</h2>
              <ul className="text-gray-300 list-disc pl-6 mb-6">
                <li>Startups retain rights to the selected submission(s) upon reward payout.</li>
                <li>Students retain rights to non-selected submissions unless otherwise agreed.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">7. Limitation of Liability</h2>
              <p className="text-gray-300 mb-4">VoltWorx is not liable for:</p>
              <ul className="text-gray-300 list-disc pl-6 mb-6">
                <li>Content submitted by users</li>
                <li>Disputes between startups and students</li>
                <li>Delays or technical issues beyond our control</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">8. Modifications to Terms</h2>
              <p className="text-gray-300">
                We may update these Terms periodically. Continued use of the platform after changes means you accept the revised Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">9. Contact Us</h2>
              <p className="text-gray-300">
                For questions, email us at:{' '}
                <a href="mailto:team.voltworx@gmail.com" className="text-blue-400 hover:text-blue-300">
                  team.voltworx@gmail.com
                </a>
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">🧩 Addendum: Startup Collaboration Hub Terms</h2>
              <p className="text-gray-300 mb-4">
                The Startup Collaboration Hub is a feature within VoltWorx where users (typically startup founders) can post ideas or requirements to connect with students or individuals from other domains (e.g., tech, marketing, design, hardware, etc.).
                By using this section, you agree to the following terms:
              </p>

              <h3 className="text-xl font-semibold mb-3 text-gray-200">1. Non-Employment Guarantee</h3>
              <p className="text-gray-300 mb-6">
                VoltWorx does not validate or enforce co-founder or partnership relationships initiated through the Collab Hub. All collaboration happens at your own discretion and risk.
              </p>

              <h3 className="text-xl font-semibold mb-3 text-gray-200">2. Ownership & IP</h3>
              <ul className="text-gray-300 list-disc pl-6 mb-6">
                <li>Users are advised to not publicly share confidential or proprietary ideas unless they're comfortable disclosing them.</li>
                <li>VoltWorx is not responsible for any idea theft, duplication, or misuse.</li>
                <li>Users should consider NDAs (Non-Disclosure Agreements) between themselves outside the platform.</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-gray-200">3. Behavior & Safety</h3>
              <ul className="text-gray-300 list-disc pl-6 mb-6">
                <li>All messages, postings, and replies must remain respectful and constructive.</li>
                <li>Spam, aggressive pitching, and repeated unsolicited messages can lead to account suspension.</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-gray-200">4. No Mediation</h3>
              <p className="text-gray-300 mb-6">
                VoltWorx does not intervene or mediate any agreements, collaborations, disputes, or fallouts that arise from Collab connections.
              </p>

              <h3 className="text-xl font-semibold mb-3 text-gray-200">5. Use at Your Own Risk</h3>
              <ul className="text-gray-300 list-disc pl-6 mb-6">
                <li>VoltWorx provides the platform for connection — you are responsible for any follow-up communication, idea-sharing, or contracts.</li>
                <li>Always exercise judgment and due diligence when connecting with others.</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TermsAndConditions; 