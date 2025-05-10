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
            </div>
            <div className="mt-4 space-y-1 text-gray-300 text-sm">
              <div className="break-words">
                <span className="font-semibold">Address:</span> plot no 608, vv nagar, kukatpally, hyderabad, Telangana, 500072
              </div>
              <div className="break-words">
                <span className="font-semibold">Phone:</span> +91 9059682992
              </div>
            </div>
          </section>

          {/* FAQs Section */}
          <section className="mb-12 p-6 bg-gray-700/50 rounded-lg border border-gray-600">
            <h2 className="text-2xl font-semibold mb-4 text-white">FAQs</h2>
            <div className="prose prose-invert max-w-none text-gray-200">
<pre style={{whiteSpace: 'pre-wrap', wordBreak: 'break-word', background: 'none', color: 'inherit', fontFamily: 'inherit'}}>
{`
🚀 For Startups & Creators

---

❓ What is VoltWorx?
VoltWorx is a platform where startups and creators can post real-world micro-tasks (like web design, video editing, pitch decks, etc.) and receive submissions from students. You select the best submission and reward that student. No hiring, and no platform commissions are charged on unselected applicants.

---

❓ How do I post a task?
Create an account → Click "Post a Task" → Fill in the task description, required skills, deadline, and reward → Submit for moderation → Task goes live.

---

❓ Do I have to pay all applicants?
No. You only reward the student whose work you select. All other applicants do not receive any payment.

---

❓ What if I don't like any of the submissions?
You can request a refund of your task posting payment within 7 days of the deadline, provided no selection is made.

---

❓ Can I contact students directly?
Direct contact is allowed only after you've selected a submission. You cannot engage with unselected students directly via the platform.

---

❓ Is VoltWorx free to use?
Registration is free. When posting a task, you are charged a combined listing and reward fee. VoltWorx deducts a small platform fee (usually 10%) and manually delivers the remaining reward to the selected student outside of the platform. VoltWorx does not facilitate payouts through Razorpay or act as a payment intermediary.

---

🎓 For Students

---

❓ How do I apply for tasks?
Log in → Browse active tasks → Click "Apply" → Submit your work (GitHub repo, design, video, etc.) before the deadline.

---

❓ Will I get paid for every task I submit?
No. You will only receive a reward if your submission is selected by the startup or creator.

---

❓ What skills can I add to my profile?
You can list any skill you're confident in — such as frontend development, UI/UX, video editing, content writing, etc. Your listed skills help us match you to relevant tasks.

---

❓ Is this an internship platform?
No. VoltWorx is not a job or internship portal. It's a task-based platform for portfolio-building and project collaboration. However, startups may approach you later for internships or freelance roles if impressed.

---

❓ Can I use my submissions in my portfolio?
Yes — unless the startup requests exclusivity for the winning submission, you may include your work in your personal portfolio.

---

❓ What if someone copies or uses my work without credit?
If you believe your work was used without selection or reward, contact us at team.voltworx@gmail.com. We take intellectual property concerns seriously and investigate reported misuse.

---

🔧 General

---

❓ How are rewards handled?
VoltWorx collects the full task reward and service fee at the time of posting. Upon task completion, we manually disburse the reward to the selected student via external methods. We do not process rewards via Razorpay or any payment gateway.

---

❓ What if I find a bug or issue?
Please report issues, bugs, or abuse to:
📧 team.voltworx@gmail.com
`}
</pre>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default ContactUs; 