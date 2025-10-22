import React, { useState } from 'react';
import { Upload, X, Check, Info, Send, Instagram, Youtube, MapPin, User, Sparkles } from 'lucide-react';

interface Skill {
  id: string;
  name: string;
}

const AVAILABLE_SKILLS: Skill[] = [
  { id: 'frontend', name: 'Frontend' },
  { id: 'backend', name: 'Backend' },
  { id: 'uiux', name: 'UI/UX Design' },
  { id: 'writing', name: 'Writing' },
  { id: 'marketing', name: 'Digital Marketing' },
  { id: 'mobile', name: 'Mobile Development' },
  { id: 'devops', name: 'DevOps' },
  { id: 'data', name: 'Data Science' },
];

const ProfileSetup: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: 'black-contemporary-87',
    location: '',
    twitter: '',
    instagram: '',
    youtube: '',
    tiktok: '',
    referralCode: '',
  });
  
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleSkill = (skillId: string) => {
    setSelectedSkills(prev => 
      prev.includes(skillId) 
        ? prev.filter(id => id !== skillId)
        : [...prev, skillId]
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    console.log({ ...formData, skills: selectedSkills, profileImage });
    alert('Profile created successfully!');
  };

  return (
    <div className="min-h-screen bg-black text-gray-100 p-6 flex items-center justify-center">
      <div className="w-full max-w-4xl">
        <div className="mb-10">
          <h1 className="text-5xl font-bold text-white mb-4 tracking-tight flex items-center gap-3">
            <Sparkles className="w-10 h-10 text-[#ff7a66]" />
            Setup Your Profile
          </h1>
          <p className="text-gray-400 text-xl">
            It takes less than a minute to start earning in global standards.
          </p>
        </div>

        <div className="space-y-8">
          {/* Profile Image Upload */}
          <div className="flex items-start gap-6">
            <div className="relative">
              <label 
                htmlFor="profile-image" 
                className="w-24 h-24 rounded-full border-2 border-dashed border-[#ff7a66] flex items-center justify-center cursor-pointer hover:border-[#ff8c7a] transition-colors bg-zinc-900 overflow-hidden"
              >
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <Upload className="w-6 h-6 text-[#ff7a66]" />
                )}
              </label>
              <input
                id="profile-image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {/* Name Fields */}
            <div className="flex-1 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  First Name <span className="text-[#ff7a66]">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="First Name"
                  className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff7a66] focus:border-transparent text-white placeholder-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Last Name <span className="text-[#ff7a66]">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Last Name"
                  className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff7a66] focus:border-transparent text-white placeholder-gray-600"
                />
              </div>
            </div>
          </div>

          {/* Username and Location */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Username <span className="text-[#ff7a66]">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">@</span>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 bg-zinc-900 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff7a66] focus:border-transparent text-white"
                />
                <Check className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Location <span className="text-[#ff7a66]">*</span>
              </label>
              <select
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff7a66] focus:border-transparent text-white appearance-none cursor-pointer"
              >
                <option value="">Select a region...</option>
                <option value="north-america">North America</option>
                <option value="south-america">South America</option>
                <option value="europe">Europe</option>
                <option value="asia">Asia</option>
                <option value="africa">Africa</option>
                <option value="oceania">Oceania</option>
              </select>
            </div>
          </div>

          {/* Skills Section */}
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2 text-gray-300">
              Your Skills <span className="text-[#ff7a66]">*</span>
              <Info className="w-4 h-4 text-gray-500" />
            </label>
            <p className="text-sm text-gray-500 mb-4">Get notified of new listings based on your skills</p>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_SKILLS.map(skill => (
                <button
                  key={skill.id}
                  type="button"
                  onClick={() => toggleSkill(skill.id)}
                  className={`px-4 py-2 rounded-lg border transition-all ${
                    selectedSkills.includes(skill.id)
                      ? 'bg-[#ff7a66] border-[#ff7a66] text-white shadow-[0_0_15px_rgba(255,122,102,0.4)]'
                      : 'bg-zinc-900 border-zinc-800 text-gray-400 hover:border-zinc-700'
                  }`}
                >
                  {skill.name} {selectedSkills.includes(skill.id) ? '✓' : '+'}
                </button>
              ))}
            </div>
          </div>

          {/* Socials Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <label className="block text-sm font-medium text-gray-300">Socials</label>
                <p className="text-sm text-gray-500">Fill at least one, but more the merrier</p>
              </div>
            </div>
            <div className="space-y-3">
              {/* Twitter/X */}
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3">
                  <X className="w-5 h-5 text-gray-500" />
                  <span className="ml-2 text-gray-400">x.com/</span>
                </div>
                <input
                  type="text"
                  name="twitter"
                  value={formData.twitter}
                  onChange={handleInputChange}
                  placeholder="Enter your Twitter username"
                  className="flex-1 px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff7a66] focus:border-transparent text-white placeholder-gray-600"
                />
              </div>

              {/* Instagram */}
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3">
                  <Instagram className="w-5 h-5 text-gray-500" />
                  <span className="ml-2 text-gray-400">instagram.com/</span>
                </div>
                <input
                  type="text"
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleInputChange}
                  placeholder="Enter your Instagram username"
                  className="flex-1 px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff7a66] focus:border-transparent text-white placeholder-gray-600"
                />
              </div>

              {/* YouTube */}
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3">
                  <Youtube className="w-5 h-5 text-gray-500" />
                  <span className="ml-2 text-gray-400">youtube.com/@</span>
                </div>
                <input
                  type="text"
                  name="youtube"
                  value={formData.youtube}
                  onChange={handleInputChange}
                  placeholder="Enter your YouTube username"
                  className="flex-1 px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff7a66] focus:border-transparent text-white placeholder-gray-600"
                />
              </div>

              {/* TikTok */}
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3">
                  <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                  <span className="ml-2 text-gray-400">tiktok.com/@</span>
                </div>
                <input
                  type="text"
                  name="tiktok"
                  value={formData.tiktok}
                  onChange={handleInputChange}
                  placeholder="Enter your TikTok username"
                  className="flex-1 px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff7a66] focus:border-transparent text-white placeholder-gray-600"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full py-4 bg-[#ff7a66] text-white font-semibold rounded-lg hover:bg-[#ff8c7a] transition-all shadow-[0_0_20px_rgba(255,122,102,0.5)] hover:shadow-[0_0_30px_rgba(255,122,102,0.7)] flex items-center justify-center gap-2 text-lg"
          >
            <Send className="w-5 h-5" />
            Create Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
