import React from 'react';

function RefundPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-8 text-white">Refund Policy</h1>
          <p className="text-gray-300 mb-6">Effective Date: [08/05/2025]</p>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 mb-6">
              VoltWorx provides a unique platform where startups and creators post real-world tasks, and students submit work in exchange for a reward. This Refund Policy outlines the terms under which refunds are provided.
            </p>

            <div className="border-t border-gray-700 my-8"></div>

            <h2 className="text-2xl font-semibold mb-4 text-white">1. Reward Payment Structure</h2>
            <ul className="text-gray-300 list-disc pl-6 mb-8 space-y-2">
              <li>When a startup/creator posts a task, they pre-load the reward amount to VoltWorx (e.g., ₹800).</li>
              <li>Only the posting fee is collected through the platform. No reward money is held</li>
              <li>VoltWorx charges a platform fee (10%), and the remaining reward is transferred to the selected student (90%).</li>
            </ul>

            <div className="border-t border-gray-700 my-8"></div>

            <h2 className="text-2xl font-semibold mb-4 text-white">2. When Refunds Are Allowed</h2>
            <p className="text-gray-300 mb-4">A full refund to the startup/creator will be issued if:</p>
            <ul className="text-gray-300 list-disc pl-6 mb-4 space-y-2">
              <li>No student submits any work before the task deadline.</li>
              <li>All submissions are deemed unsatisfactory or irrelevant, and no selection is made.</li>
              <li>A technical error prevented visibility or access to the task.</li>
            </ul>
            <p className="text-gray-300 mb-8">Refund requests must be submitted within 7 days of the task deadline.</p>

            <div className="border-t border-gray-700 my-8"></div>

            <h2 className="text-2xl font-semibold mb-4 text-white">3. How to Request a Refund</h2>
            <p className="text-gray-300 mb-4">To request a refund, the task poster must email team.voltworx@gmail.com with:</p>
            <ul className="text-gray-300 list-disc pl-6 mb-4 space-y-2">
              <li>Task ID or title</li>
              <li>Reason for refund</li>
              <li>Supporting details (e.g., no submissions, invalid responses)</li>
            </ul>
            <p className="text-gray-300 mb-8">Requests are reviewed within 3–5 working days.</p>

            <div className="border-t border-gray-700 my-8"></div>

            <h2 className="text-2xl font-semibold mb-4 text-white">4. No Refund Cases</h2>
            <p className="text-gray-300 mb-4">Refunds will not be issued if:</p>
            <ul className="text-gray-300 list-disc pl-6 mb-8 space-y-2">
              <li>The startup has already selected a student and the reward has been disbursed.</li>
              <li>The task was incomplete, unclear, or violated platform rules.</li>
              <li>The request was submitted after the 7-day refund window.</li>
            </ul>

            <div className="border-t border-gray-700 my-8"></div>

            <h2 className="text-2xl font-semibold mb-4 text-white">5. Disputes & Exceptions</h2>
            <p className="text-gray-300 mb-4">In the event of a dispute, VoltWorx may:</p>
            <ul className="text-gray-300 list-disc pl-6 mb-4 space-y-2">
              <li>Contact both parties</li>
              <li>Review all submissions and messages</li>
              <li>Issue partial refunds at its discretion</li>
            </ul>
            <p className="text-gray-300 mb-8">All decisions made by VoltWorx regarding refunds are final.</p>

            <div className="border-t border-gray-700 my-8"></div>

            <h2 className="text-2xl font-semibold mb-4 text-white">6. Contact for Refund Queries</h2>
            <p className="text-gray-300 mb-4">📧 team.voltworx@gmail.com</p>
            <p className="text-gray-300">Please use "Refund Request – [Task Name]" as the email subject.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RefundPolicy; 