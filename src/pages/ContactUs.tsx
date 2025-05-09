import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

function ContactUs() {
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({});

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-8 text-white">Contact Us & FAQs</h1>

          {/* Contact Section */}
          <section className="mb-12 p-6 bg-gray-700/50 rounded-lg border border-gray-600">
            <h2 className="text-2xl font-semibold mb-4 text-white">Get in Touch</h2>
            <p className="text-gray-300 mb-4">
              Have questions or need assistance? We're here to help!
            </p>
            <div className="flex items-center space-x-2 text-gray-300">
              <span className="text-xl">📧</span>
              <a href="mailto:team.voltworx@gmail.com" className="text-blue-400 hover:text-blue-300">
                team.voltworx@gmail.com
              </a>
              <p>
              plot no 608,vv nagar,kukatpally,hyderabad, Telangana,500072
              </p>
              <p>
                phone number: +91 9059682992
              </p>
            </div>
          </section>

          {/* FAQs Section */}
          <div className="space-y-6">
            {/* For Startups & Creators */}
            <section className="bg-gray-700/50 rounded-lg border border-gray-600 overflow-hidden">
              <button
                onClick={() => toggleSection('startups')}
                className="w-full p-6 flex items-center justify-between text-left hover:bg-gray-600/50 transition-colors"
              >
                <h2 className="text-2xl font-semibold text-white flex items-center">
                  <span className="mr-2">🚀</span> For Startups & Creators
                </h2>
                {openSections['startups'] ? (
                  <ChevronUp className="h-6 w-6 text-gray-400" />
                ) : (
                  <ChevronDown className="h-6 w-6 text-gray-400" />
                )}
              </button>
              
              {openSections['startups'] && (
                <div className="px-6 pb-6 space-y-6">
                  <div className="border-b border-gray-600 pb-6 last:border-b-0 last:pb-0">
                    <h3 className="text-lg font-semibold mb-2 text-gray-200 flex items-center">
                      <span className="mr-2">❓</span> What is VoltWorx?
                    </h3>
                    <p className="text-gray-400">
                      VoltWorx is a platform where startups and creators can post real-world tasks (like web design, video editing, pitch decks, etc.) and receive submissions from students with relevant skills. You only reward the best submission — no hiring, no platform fee.
                    </p>
                  </div>

                  <div className="border-b border-gray-600 pb-6 last:border-b-0 last:pb-0">
                    <h3 className="text-lg font-semibold mb-2 text-gray-200 flex items-center">
                      <span className="mr-2">❓</span> How do I post a task?
                    </h3>
                    <p className="text-gray-400">
                      Create an account → Click "Post a Task" → Fill in the description, skill tags, deadline, and reward → Submit for review → Go live.
                    </p>
                  </div>

                  <div className="border-b border-gray-600 pb-6 last:border-b-0 last:pb-0">
                    <h3 className="text-lg font-semibold mb-2 text-gray-200 flex items-center">
                      <span className="mr-2">❓</span> Do I have to pay all applicants?
                    </h3>
                    <p className="text-gray-400">
                      No. You only reward the best submission. All others are considered applicants and do not receive payment unless chosen.
                    </p>
                  </div>

                  <div className="border-b border-gray-600 pb-6 last:border-b-0 last:pb-0">
                    <h3 className="text-lg font-semibold mb-2 text-gray-200 flex items-center">
                      <span className="mr-2">❓</span> What if I don't like any of the submissions?
                    </h3>
                    <p className="text-gray-400">
                      If none of the student submissions meet your expectations, you can request a full refund within 7 days of the task deadline.
                    </p>
                  </div>

                  <div className="border-b border-gray-600 pb-6 last:border-b-0 last:pb-0">
                    <h3 className="text-lg font-semibold mb-2 text-gray-200 flex items-center">
                      <span className="mr-2">❓</span> Can I contact students directly?
                    </h3>
                    <p className="text-gray-400">
                      Only after you select a submission and the reward is transferred. Direct contact with unselected students is not allowed.
                    </p>
                  </div>

                  <div className="border-b border-gray-600 pb-6 last:border-b-0 last:pb-0">
                    <h3 className="text-lg font-semibold mb-2 text-gray-200 flex items-center">
                      <span className="mr-2">❓</span> Is VoltWorx free to use?
                    </h3>
                    <p className="text-gray-400">
                      Yes. We charge no platform fees for posting a task. We only take a small commission from the reward when a student is paid.
                    </p>
                  </div>
                </div>
              )}
            </section>

            {/* For Students */}
            <section className="bg-gray-700/50 rounded-lg border border-gray-600 overflow-hidden">
              <button
                onClick={() => toggleSection('students')}
                className="w-full p-6 flex items-center justify-between text-left hover:bg-gray-600/50 transition-colors"
              >
                <h2 className="text-2xl font-semibold text-white flex items-center">
                  <span className="mr-2">🎓</span> For Students
                </h2>
                {openSections['students'] ? (
                  <ChevronUp className="h-6 w-6 text-gray-400" />
                ) : (
                  <ChevronDown className="h-6 w-6 text-gray-400" />
                )}
              </button>
              
              {openSections['students'] && (
                <div className="px-6 pb-6 space-y-6">
                  <div className="border-b border-gray-600 pb-6 last:border-b-0 last:pb-0">
                    <h3 className="text-lg font-semibold mb-2 text-gray-200 flex items-center">
                      <span className="mr-2">❓</span> How do I apply for tasks?
                    </h3>
                    <p className="text-gray-400">
                      Browse live tasks → Click "Apply" → Submit your work (e.g., GitHub link, design file, video edit) before the deadline.
                    </p>
                  </div>

                  <div className="border-b border-gray-600 pb-6 last:border-b-0 last:pb-0">
                    <h3 className="text-lg font-semibold mb-2 text-gray-200 flex items-center">
                      <span className="mr-2">❓</span> Will I get paid for every task I submit?
                    </h3>
                    <p className="text-gray-400">
                      No. You are only paid if your submission is selected by the startup. It's competitive — like a challenge.
                    </p>
                  </div>

                  <div className="border-b border-gray-600 pb-6 last:border-b-0 last:pb-0">
                    <h3 className="text-lg font-semibold mb-2 text-gray-200 flex items-center">
                      <span className="mr-2">❓</span> What skills can I add to my profile?
                    </h3>
                    <p className="text-gray-400">
                      You can add any skill you're confident in — like frontend development, video editing, UI/UX, copywriting, etc. VoltWorx uses your skill tags to match you with relevant tasks.
                    </p>
                  </div>

                  <div className="border-b border-gray-600 pb-6 last:border-b-0 last:pb-0">
                    <h3 className="text-lg font-semibold mb-2 text-gray-200 flex items-center">
                      <span className="mr-2">❓</span> Is this an internship?
                    </h3>
                    <p className="text-gray-400">
                      No. VoltWorx is not a job or internship board — it's a micro-project platform. However, tasks can build your portfolio, and startups may contact you for future opportunities.
                    </p>
                  </div>

                  <div className="border-b border-gray-600 pb-6 last:border-b-0 last:pb-0">
                    <h3 className="text-lg font-semibold mb-2 text-gray-200 flex items-center">
                      <span className="mr-2">❓</span> Can I use my submissions in my portfolio?
                    </h3>
                    <p className="text-gray-400">
                      Yes — unless a startup requests exclusivity, your work can be showcased in your personal portfolio.
                    </p>
                  </div>

                  <div className="border-b border-gray-600 pb-6 last:border-b-0 last:pb-0">
                    <h3 className="text-lg font-semibold mb-2 text-gray-200 flex items-center">
                      <span className="mr-2">❓</span> What if someone steals my work?
                    </h3>
                    <p className="text-gray-400">
                      If your work is copied without reward or credit, report it to us immediately. We take plagiarism and misuse seriously and will act swiftly.
                    </p>
                  </div>
                </div>
              )}
            </section>

            {/* General */}
            <section className="bg-gray-700/50 rounded-lg border border-gray-600 overflow-hidden">
              <button
                onClick={() => toggleSection('general')}
                className="w-full p-6 flex items-center justify-between text-left hover:bg-gray-600/50 transition-colors"
              >
                <h2 className="text-2xl font-semibold text-white flex items-center">
                  <span className="mr-2">🔧</span> General
                </h2>
                {openSections['general'] ? (
                  <ChevronUp className="h-6 w-6 text-gray-400" />
                ) : (
                  <ChevronDown className="h-6 w-6 text-gray-400" />
                )}
              </button>
              
              {openSections['general'] && (
                <div className="px-6 pb-6 space-y-6">
                  <div className="border-b border-gray-600 pb-6 last:border-b-0 last:pb-0">
                    <h3 className="text-lg font-semibold mb-2 text-gray-200 flex items-center">
                      <span className="mr-2">❓</span> How are rewards handled?
                    </h3>
                    <p className="text-gray-400">
                      Startups preload the reward, and VoltWorx releases it only when they select a submission. If no selection is made, the amount is refunded.
                    </p>
                  </div>

                  <div className="border-b border-gray-600 pb-6 last:border-b-0 last:pb-0">
                    <h3 className="text-lg font-semibold mb-2 text-gray-200 flex items-center">
                      <span className="mr-2">❓</span> What if I find a bug or issue?
                    </h3>
                    <p className="text-gray-400">
                      Please report bugs or issues via our support email:
                      <br />
                      <a href="mailto:team.voltworx@gmail.com" className="text-blue-400 hover:text-blue-300">
                        📧 team.voltworx@gmail.com
                      </a>
                    </p>
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactUs; 