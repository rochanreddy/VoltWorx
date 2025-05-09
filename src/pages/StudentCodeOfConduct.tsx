import React from 'react';

function StudentCodeOfConduct() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-8 text-white">Student Code of Conduct</h1>
          <p className="text-gray-300 mb-6">Effective Date: 08/05/2025</p>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 mb-6">
              As a student using VoltWorx, you are expected to uphold integrity, professionalism, and respect while engaging with tasks, startups, and fellow users. This Code of Conduct outlines the behavioral standards and responsibilities expected from all student participants.
            </p>

            <div className="border-t border-gray-700 my-8"></div>

            <h2 className="text-2xl font-semibold mb-4 text-white">1. Integrity & Honesty</h2>
            <ul className="text-gray-300 list-disc pl-6 mb-8 space-y-2">
              <li>All submitted work must be original and created by you.</li>
              <li>Plagiarism, AI-generated junk work, or copying from others without credit will lead to disqualification and possible suspension.</li>
              <li>Never submit previously completed work unless explicitly permitted.</li>
            </ul>

            <div className="border-t border-gray-700 my-8"></div>

            <h2 className="text-2xl font-semibold mb-4 text-white">2. Professional Behavior</h2>
            <ul className="text-gray-300 list-disc pl-6 mb-8 space-y-2">
              <li>Treat startups, creators, and fellow students with respect and professionalism.</li>
              <li>Communicate clearly, stay polite, and avoid spammy or aggressive behavior.</li>
              <li>Do not contact startups directly unless selected — respect the platform boundaries.</li>
            </ul>

            <div className="border-t border-gray-700 my-8"></div>

            <h2 className="text-2xl font-semibold mb-4 text-white">3. Quality & Timeliness</h2>
            <ul className="text-gray-300 list-disc pl-6 mb-8 space-y-2">
              <li>Only apply for tasks that match your skills and that you can complete in time.</li>
              <li>Strive to deliver clean, complete, and thoughtful work.</li>
              <li>Meet all task deadlines — failure to submit on time without a valid reason can affect your standing.</li>
            </ul>

            <div className="border-t border-gray-700 my-8"></div>

            <h2 className="text-2xl font-semibold mb-4 text-white">4. Transparency in Profiles</h2>
            <ul className="text-gray-300 list-disc pl-6 mb-8 space-y-2">
              <li>Keep your profile accurate — don't list skills or experience you don't actually possess.</li>
              <li>Your public submissions may be used in your portfolio, but misrepresenting them is not allowed.</li>
            </ul>

            <div className="border-t border-gray-700 my-8"></div>

            <h2 className="text-2xl font-semibold mb-4 text-white">5. Fair Competition</h2>
            <ul className="text-gray-300 list-disc pl-6 mb-8 space-y-2">
              <li>Do not sabotage, harass, or negatively interfere with other student submissions.</li>
              <li>You are free to compete, but must do so with ethics and fairness.</li>
            </ul>

            <div className="border-t border-gray-700 my-8"></div>

            <h2 className="text-2xl font-semibold mb-4 text-white">6. Violation Consequences</h2>
            <p className="text-gray-300 mb-4">Breaking this Code of Conduct may result in:</p>
            <ul className="text-gray-300 list-disc pl-6 mb-8 space-y-2">
              <li>Submission rejection</li>
              <li>Platform warnings or strikes</li>
              <li>Temporary or permanent account ban</li>
              <li>Loss of earned badges or recognition</li>
            </ul>

            <div className="border-t border-gray-700 my-8"></div>

            <h2 className="text-2xl font-semibold mb-4 text-white">7. Reporting Misconduct</h2>
            <p className="text-gray-300">If you witness abuse, cheating, or inappropriate behavior, report it confidentially via:</p>
            <p className="mt-2 text-gray-300">📧 team.voltworx@gmail.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentCodeOfConduct; 