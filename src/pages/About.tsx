import { Linkedin, Github, Twitter } from 'lucide-react';

interface CoFounder {
  name: string;
  role: string;
  bio: string;
  image: string;
  linkedin?: string;
  github?: string;
}

const coFounders: CoFounder[] = [
  {
    name: "Meghanadha Reddy",
    role: "CEO & Co-Founder",
    bio: "Passionate about connecting students with real-world opportunities and building the future of work.",
    image: "public/images/WhatsApp Image 2025-05-08 at 16.02.23_40080523.jpg",
    linkedin: "https://www.linkedin.com/in/meghanadha-reddy/",
    github: "https://github.com/MEGHANADHA-REDDY/MEGHANADHA-REDDY",
  },
  {
    name: "Rochan Reddy Ayireddy",
    role: "CTO & Co-Founder",
    bio: "Tech enthusiast focused on creating innovative solutions for education and career development.",
    image: "public/images/WhatsApp Image 2025-05-08 at 16.09.05_0e5a55b7.jpg",
    linkedin: "https://www.linkedin.com/in/rochan-reddy-a46876309/",
    github: "https://github.com/rochanreddy?tab=repositories"
  }
];

function About() {
  return (
    <div className="container py-8">
      {/* Hero Section */}
      <div className="group relative mb-12">
        <div className="absolute -inset-0.5 rounded-2xl blur-sm transition duration-200 bg-gradient-to-br from-purple-600/30 via-blue-600/30 to-pink-600/30 opacity-40 group-hover:opacity-60"></div>
        <div className="relative p-6 md:p-8 rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all duration-300 bg-gray-900/80 backdrop-blur-xl">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">About VoltWorx</h1>
          <p className="text-lg text-gray-300 mb-6">
            VoltWorx is a revolutionary platform that bridges the gap between ambitious students and innovative startups. 
            Our mission is to create meaningful connections that drive growth, learning, and innovation in the tech industry.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <h3 className="text-lg font-semibold text-purple-300 mb-2">Our Mission</h3>
              <p className="text-gray-300">
                To empower students with real-world experience and help startups find exceptional talent through meaningful project collaborations.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <h3 className="text-lg font-semibold text-blue-300 mb-2">Our Vision</h3>
              <p className="text-gray-300">
                To become the leading platform for student-startup collaboration, fostering innovation and growth in the tech ecosystem.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-pink-500/10 border border-pink-500/20">
              <h3 className="text-lg font-semibold text-pink-300 mb-2">Our Values</h3>
              <p className="text-gray-300">
                Innovation, collaboration, and growth are at the heart of everything we do. We believe in creating value for both students and startups.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Co-Founders Section */}
      <div className="group relative">
        <div className="absolute -inset-0.5 rounded-2xl blur-sm transition duration-200 bg-gradient-to-br from-purple-600/30 via-blue-600/30 to-pink-600/30 opacity-40 group-hover:opacity-60"></div>
        <div className="relative p-6 md:p-8 rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all duration-300 bg-gray-900/80 backdrop-blur-xl">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">Meet the Co-Founders</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {coFounders.map((founder, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <div className="absolute -inset-0.5 rounded-full blur-sm transition duration-200 bg-gradient-to-br from-purple-600/30 via-blue-600/30 to-pink-600/30 opacity-40 group-hover:opacity-60"></div>
                  <img
                    src={founder.image}
                    alt={founder.name}
                    className="relative w-32 h-32 rounded-full object-cover border-2 border-white/10"
                  />
                </div>
                <h3 className="text-xl font-semibold text-white mb-1">{founder.name}</h3>
                <p className="text-purple-300 mb-2">{founder.role}</p>
                <p className="text-gray-300 mb-4">{founder.bio}</p>
                <div className="flex space-x-4">
                  {founder.linkedin && (
                    <a
                      href={founder.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-purple-300 transition-colors"
                    >
                      <Linkedin className="h-5 w-5" />
                    </a>
                  )}
                  {founder.github && (
                    <a
                      href={founder.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-purple-300 transition-colors"
                    >
                      <Github className="h-5 w-5" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default About; 