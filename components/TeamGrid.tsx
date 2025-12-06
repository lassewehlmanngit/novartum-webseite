import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TeamMember } from '../types';
import { Linkedin, User } from 'lucide-react';

interface TeamGridProps {
  members?: TeamMember[];
}

const TeamGrid: React.FC<TeamGridProps> = ({ members: initialMembers }) => {
  const [members, setMembers] = useState<TeamMember[]>(initialMembers || []);

  useEffect(() => {
    if (!initialMembers || initialMembers.length === 0) {
      fetch('/content/team/members.json')
        .then(res => res.json())
        .then(async (data) => {
            // Check if data is array of strings (IDs)
            if (Array.isArray(data) && typeof data[0] === 'string') {
                const promises = data.map((id: string) => 
                  fetch(`/content/team/members/${id}.json`).then(res => res.json())
                );
                const loadedMembers = await Promise.all(promises);
                setMembers(loadedMembers);
            }
            // Fallback for old structure (array of objects)
            else if (Array.isArray(data)) {
                setMembers(data);
            } else if (data.members) {
                setMembers(data.members);
            }
        })
        .catch(console.error);
    }
  }, [initialMembers]);

  if (members.length === 0) {
      return null; // Or loading state
  }

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {members.map((member, idx) => {
            const personSchema = {
              "@context": "https://schema.org",
              "@type": "Person",
              "name": member.name,
              "jobTitle": member.role,
              "image": member.image,
              "description": member.bio,
              "worksFor": {
                "@type": "Organization",
                "name": "Novartum GmbH"
              },
              ...(member.linkedin && { "sameAs": [member.linkedin] })
            };

            return (
              <div 
                key={idx} 
                className="group bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                data-cc-field={`members[${idx}]`}
              >
                <script type="application/ld+json">
                  {JSON.stringify(personSchema)}
                </script>
                <div className="relative mb-6 overflow-hidden rounded-xl h-80 w-full bg-slate-200">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  data-cc-field="image"
                  />
                  {member.linkedin && (
                      <a 
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute bottom-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#0077b5] hover:bg-[#0077b5] hover:text-white transition-colors shadow-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-300"
                        aria-label={`${member.name} auf LinkedIn`}
                        data-cc-field="linkedin"
                      >
                          <Linkedin size={20} />
                      </a>
                  )}
                </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-1" data-cc-field="name">{member.name}</h3>
              <p className="text-orange-700 font-medium text-sm uppercase tracking-wide mb-4" data-cc-field="role">{member.role}</p>
              
              <div className="w-10 h-0.5 bg-slate-200 mb-4 group-hover:bg-orange-500 transition-colors"></div>
              
              {member.bio && member.bio.trim() && (
                <p className="text-slate-600 text-sm leading-relaxed" data-cc-field="bio">
                  {member.bio}
                </p>
              )}
            </div>
          );
        })}
          
          {/* Hiring Card */}
          <div className="bg-[#15171e] rounded-2xl p-8 border border-slate-700 flex flex-col justify-center items-center text-center h-full min-h-[400px]">
             <div className="w-16 h-16 rounded-full bg-orange-600/20 text-orange-500 flex items-center justify-center mb-6">
                <User size={32} />
             </div>
             <h3 className="text-2xl font-bold text-white mb-2">Du?</h3>
             <p className="text-slate-400 mb-8 max-w-xs">
               Wir suchen immer nach talentierten Persönlichkeiten, die unser Team bereichern.
             </p>
             <Link 
               to="/karriere" 
               className="bg-orange-700 hover:bg-orange-800 text-white px-8 py-3 rounded-xl font-bold transition-colors"
             >
               Karriere starten
             </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamGrid;