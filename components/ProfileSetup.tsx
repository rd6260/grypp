import React, { useState, useEffect } from 'react';
import { Upload, X, Check, Info, Send, Instagram, Youtube, MapPin, User, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation'

interface Skill {
  id: string;
  name: string;
}

const AVAILABLE_SKILLS: Skill[] = [
  { id: 'ai', name: 'AI' },
  { id: 'tech', name: 'Tech' },
  { id: 'web3', name: 'Web3' },
  { id: 'streaming', name: 'Streaming' },
  { id: 'Crypto', name: 'Crypto' },
  { id: 'podcast', name: 'Podcast' },
  { id: 'interview', name: 'Interview' },
  { id: 'gaming', name: 'Gaming' },
];

// Add UserType prop
interface ProfileSetupProps {
  userType: 'creator' | 'clipper';
  redirectPath?: string;
  onUpdateComplete?: () => void;
}

const ProfileSetup: React.FC<ProfileSetupProps> = ({ userType, redirectPath = '/', onUpdateComplete}) => {
  const { user, ready } = usePrivy();
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    location: '',
    twitter: '',
    instagram: '',
    youtube: '',
    tiktok: '',
  });

  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [existingProfile, setExistingProfile] = useState(false);
  const [originalUsername, setOriginalUsername] = useState('');

  const supabase = createClient();

  // Load existing profile data when component mounts
  useEffect(() => {
    const loadExistingProfile = async () => {
      if (!ready || !user?.id) {
        setIsLoadingProfile(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error loading profile:', error);
          setIsLoadingProfile(false);
          return;
        }

        if (data) {
          setExistingProfile(true);
          setOriginalUsername(data.username || '');
          setFormData({
            firstName: data.first_name || '',
            lastName: data.last_name || '',
            username: data.username || '',
            location: data.region || '',
            twitter: data.x || '',
            instagram: data.instagram || '',
            youtube: data.youtube || '',
            tiktok: data.tiktok || '',
          });
          setSelectedSkills(data.interests || []);
          setIsUsernameAvailable(true);

          if (data.pfp_url) {
            setProfileImage(data.pfp_url);
          } else {
            const { data: urlData } = supabase.storage
              .from('pfp/user')
              .getPublicUrl(user.id);

            if (urlData?.publicUrl) {
              setProfileImage(urlData.publicUrl);
            }
          }
        } else {
          setFormData(prev => ({
            ...prev,
            username: `user-${user.id.slice(0, 8)}`,
          }));
        }
      } catch (err) {
        console.error('Unexpected error loading profile:', err);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    loadExistingProfile();
  }, [user?.id, ready]);

  // Check username availability with debounce
  useEffect(() => {
    const checkUsername = async () => {
      if (!user?.id || formData.username.length < 3) {
        setIsUsernameAvailable(null);
        return;
      }

      if (existingProfile && formData.username === originalUsername) {
        setIsUsernameAvailable(true);
        return;
      }

      setIsCheckingUsername(true);
      try {
        const { data, error } = await supabase
          .from('users')
          .select('username')
          .eq('username', formData.username)
          .single();

        if (error && error.code === 'PGRST116') {
          setIsUsernameAvailable(true);
        } else if (data) {
          setIsUsernameAvailable(false);
        }
      } catch (err) {
        console.error('Error checking username:', err);
      } finally {
        setIsCheckingUsername(false);
      }
    };

    const timeoutId = setTimeout(checkUsername, 500);
    return () => clearTimeout(timeoutId);
  }, [formData.username, user?.id, existingProfile, originalUsername]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const toggleSkill = (skillId: string) => {
    setSelectedSkills(prev =>
      prev.includes(skillId)
        ? prev.filter(id => id !== skillId)
        : [...prev, skillId]
    );
    if (errors.skills) {
      setErrors(prev => ({ ...prev, skills: '' }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, profileImage: 'Please upload an image file' }));
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, profileImage: 'Image size must be less than 5MB' }));
        return;
      }

      setProfileImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);

      if (errors.profileImage) {
        setErrors(prev => ({ ...prev, profileImage: '' }));
      }
    }
  };

  const uploadProfilePicture = async (userId: string): Promise<string | null> => {
    if (!profileImageFile) {
      return null;
    }

    try {
      const { error: deleteError } = await supabase.storage
        .from('pfp/user')
        .remove([userId]);

      if (deleteError && deleteError.message !== 'Object not found') {
        console.error('Error deleting old profile picture:', deleteError);
      }

      const { error: uploadError } = await supabase.storage
        .from('pfp/user')
        .upload(userId, profileImageFile, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        console.error('Error uploading profile picture:', uploadError);
        throw uploadError;
      }

      const { data: urlData } = supabase.storage
        .from('pfp/user')
        .getPublicUrl(userId);

      return urlData.publicUrl;
    } catch (err) {
      console.error('Error in uploadProfilePicture:', err);
      throw err;
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.username.trim() || formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (!isUsernameAvailable) {
      newErrors.username = 'Username is already taken';
    }

    if (!formData.location) {
      newErrors.location = 'Location is required';
    }

    if (selectedSkills.length === 0) {
      newErrors.skills = 'Please select at least one interest';
    }

    const hasSocial = formData.twitter || formData.instagram || formData.youtube || formData.tiktok;
    if (!hasSocial) {
      newErrors.socials = 'At least one social media link is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {

    if (!validateForm()) {
      return;
    }

    if (!user?.id) {
      alert('You must be logged in to create a profile');
      return;
    }

    setIsSubmitting(true);

    try {
      let pfpUrl = null;
      if (profileImageFile) {
        pfpUrl = await uploadProfilePicture(user.id);
      }

      // ADD userType to profileData
      const profileData = {
        id: user.id,
        type: userType, // Add this line
        username: formData.username,
        first_name: formData.firstName,
        last_name: formData.lastName,
        region: formData.location,
        interests: selectedSkills,
        x: formData.twitter || null,
        instagram: formData.instagram || null,
        youtube: formData.youtube || null,
        tiktok: formData.tiktok || null,
        ...(pfpUrl && { pfp_url: pfpUrl })
      };

      let result;

      if (existingProfile) {
        result = await supabase
          .from('users')
          .update(profileData)
          .eq('id', user.id)
          .select();
      } else {
        result = await supabase
          .from('users')
          .insert([profileData])
          .select();
      }

      const { data, error } = result;

      if (error) {
        console.error('Error saving profile:', error);
        if (error.code === '23505') {
          setErrors({ username: 'Username is already taken' });
        } else {
          alert(`Error saving profile: ${error.message}`);
        }
        return;
      }

      console.log('Profile saved:', data);
      // alert(existingProfile ? 'Profile updated successfully!' : 'Profile created successfully!');

      onUpdateComplete?.();
      router.push(redirectPath);

    } catch (err) {
      console.error('Unexpected error:', err);
      alert('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!ready || isLoadingProfile) {
    return (
      <div className="min-h-screen bg-black text-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#ff7a66] animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-[#ff7a66] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Authentication Required</h2>
          <p className="text-gray-400">Please log in to set up your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-gray-100 p-6 flex items-center justify-center">
      <div className="w-full max-w-4xl">
        <div className="mb-10">
          <h1 className="text-5xl font-bold text-white mb-4 tracking-tight flex items-center gap-3">
            <Sparkles className="w-10 h-10 text-[#ff7a66]" />
            {existingProfile ? 'Update Your Profile' : 'Setup Your Profile'}
          </h1>
          <p className="text-gray-400 text-xl">
            {existingProfile
              ? 'Make changes to your profile information below.'
              : `Set up your ${userType} profile - it takes less than a minute.`}
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
              {errors.profileImage && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.profileImage}
                </p>
              )}
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
                  className={`w-full px-4 py-3 bg-zinc-900 border ${errors.firstName ? 'border-red-500' : 'border-zinc-800'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff7a66] focus:border-transparent text-white placeholder-gray-600`}
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.firstName}
                  </p>
                )}
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
                  className={`w-full px-4 py-3 bg-zinc-900 border ${errors.lastName ? 'border-red-500' : 'border-zinc-800'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff7a66] focus:border-transparent text-white placeholder-gray-600`}
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.lastName}
                  </p>
                )}
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
                  className={`w-full pl-10 pr-12 py-3 bg-zinc-900 border ${errors.username ? 'border-red-500' : 'border-zinc-800'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff7a66] focus:border-transparent text-white`}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  {isCheckingUsername ? (
                    <Loader2 className="w-5 h-5 text-gray-500 animate-spin" />
                  ) : isUsernameAvailable === true ? (
                    <Check className="w-5 h-5 text-green-500" />
                  ) : isUsernameAvailable === false ? (
                    <X className="w-5 h-5 text-red-500" />
                  ) : null}
                </div>
              </div>
              {errors.username && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.username}
                </p>
              )}
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
                className={`w-full px-4 py-3 bg-zinc-900 border ${errors.location ? 'border-red-500' : 'border-zinc-800'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff7a66] focus:border-transparent text-white appearance-none cursor-pointer`}
              >
                <option value="">Select a region...</option>
                <option value="north-america">North America</option>
                <option value="south-america">South America</option>
                <option value="europe">Europe</option>
                <option value="asia">Asia</option>
                <option value="africa">Africa</option>
                <option value="oceania">Oceania</option>
              </select>
              {errors.location && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.location}
                </p>
              )}
            </div>
          </div>

          {/* Skills Section */}
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2 text-gray-300">
              Your Interests <span className="text-[#ff7a66]">*</span>
              <Info className="w-4 h-4 text-gray-500" />
            </label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_SKILLS.map(skill => (
                <button
                  key={skill.id}
                  type="button"
                  onClick={() => toggleSkill(skill.id)}
                  className={`px-4 py-2 rounded-lg border transition-all ${selectedSkills.includes(skill.id)
                    ? 'bg-[#ff7a66] border-[#ff7a66] text-white shadow-[0_0_15px_rgba(255,122,102,0.4)]'
                    : 'bg-zinc-900 border-zinc-800 text-gray-400 hover:border-zinc-700'
                    }`}
                >
                  {skill.name} {selectedSkills.includes(skill.id) ? '✓' : '+'}
                </button>
              ))}
            </div>
            {errors.skills && (
              <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.skills}
              </p>
            )}
          </div>

          {/* Socials Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Socials <span className="text-[#ff7a66]">*</span>
                </label>
                <p className="text-sm text-gray-500">Fill at least one, but more the merrier</p>
              </div>
            </div>
            <div className="space-y-3">
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

              <div className="flex items-center gap-2">
                <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3">
                  <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
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
            {errors.socials && (
              <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.socials}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || isCheckingUsername || !isUsernameAvailable}
            className="w-full py-4 bg-[#ff7a66] text-white font-semibold rounded-lg hover:bg-[#ff8c7a] transition-all shadow-[0_0_20px_rgba(255,122,102,0.5)] hover:shadow-[0_0_30px_rgba(255,122,102,0.7)] flex items-center justify-center gap-2 text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#ff7a66]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {existingProfile ? 'Updating Profile...' : 'Creating Profile...'}
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                {existingProfile ? 'Update Profile' : 'Create Profile'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
