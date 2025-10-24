'use client';

import React, { useState, useEffect } from 'react';
import { Upload, X, Send, Sparkles, AlertCircle, Loader2, DollarSign, Eye, Trophy, Tag } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { usePrivy } from '@privy-io/react-auth';
import { useRouter, useParams } from 'next/navigation';

const CONTENT_TYPE_OPTIONS = ['Clipping', 'Logo display', 'Video content'];

const CATEGORY_OPTIONS = [
  'Gaming',
  'Entertainment',
  'Education',
  'Technology',
  'Music',
  'Sports',
  'Lifestyle',
  'Comedy',
  'Beauty',
  'Cooking',
  'Travel',
  'Fitness',
];

interface CampaignFormData {
  title: string;
  description: string;
  money_per_million_views: string;
  content_type_tags: string[];
  category_tags: string[];
  status: boolean;
}

const CampaignEditPage: React.FC = () => {
  const { user, ready } = usePrivy();
  const router = useRouter();
  const params = useParams();
  const campaignId = params?.id as string;
  const isNewCampaign = campaignId === 'new';

  const [formData, setFormData] = useState<CampaignFormData>({
    title: '',
    description: '',
    money_per_million_views: '',
    content_type_tags: [],
    category_tags: [],
    status: true,
  });

  const [campaignImage, setCampaignImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingCampaign, setIsLoadingCampaign] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const supabase = createClient();

  // Load existing campaign data if editing
  useEffect(() => {
    const loadCampaign = async () => {
      if (!ready) {
        return;
      }

      if (isNewCampaign) {
        setIsLoadingCampaign(false);
        return;
      }

      if (!user?.id) {
        setIsLoadingCampaign(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('campaign')
          .select('*')
          .eq('id', campaignId)
          .single();

        if (error) {
          console.error('Error loading campaign:', error);
          alert('Campaign not found');
          router.push('/');
          return;
        }

        if (data.creator_id !== user.id) {
          alert('You do not have permission to edit this campaign');
          router.push('/');
          return;
        }

        setFormData({
          title: data.title || '',
          description: data.description || '',
          money_per_million_views: data.money_per_million_views?.toString() || '',
          content_type_tags: data.content_type_tags || [],
          category_tags: data.category_tags || [],
          status: data.status ?? true,
        });

        if (data.image) {
          setCampaignImage(data.image);
        }
      } catch (err) {
        console.error('Unexpected error loading campaign:', err);
        alert('Error loading campaign');
        router.push('/');
      } finally {
        setIsLoadingCampaign(false);
      }
    };

    loadCampaign();
  }, [campaignId, user?.id, ready, isNewCampaign]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const toggleContentType = (type: string) => {
    setFormData(prev => ({
      ...prev,
      content_type_tags: prev.content_type_tags.includes(type)
        ? prev.content_type_tags.filter(t => t !== type)
        : [...prev.content_type_tags, type],
    }));
    if (errors.content_type_tags) {
      setErrors(prev => ({ ...prev, content_type_tags: '' }));
    }
  };

  const toggleCategory = (category: string) => {
    setFormData(prev => ({
      ...prev,
      category_tags: prev.category_tags.includes(category)
        ? prev.category_tags.filter(c => c !== category)
        : [...prev.category_tags, category],
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, image: 'Please upload an image file' }));
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: 'Image size must be less than 5MB' }));
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCampaignImage(reader.result as string);
      };
      reader.readAsDataURL(file);

      if (errors.image) {
        setErrors(prev => ({ ...prev, image: '' }));
      }
    }
  };

  const uploadCampaignImage = async (): Promise<string | null> => {
    if (!imageFile) {
      return campaignImage;
    }

    try {
      const fileName = `campaign_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      
      const { error: uploadError } = await supabase.storage
        .from('pfp')
        .upload(`campaign/${fileName}`, imageFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Error uploading campaign image:', uploadError);
        throw uploadError;
      }

      const { data: urlData } = supabase.storage
        .from('pfp')
        .getPublicUrl(`campaign/${fileName}`);

      return urlData.publicUrl;
    } catch (err) {
      console.error('Error in uploadCampaignImage:', err);
      throw err;
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    const moneyValue = parseFloat(formData.money_per_million_views);
    if (!formData.money_per_million_views || isNaN(moneyValue) || moneyValue <= 0) {
      newErrors.money_per_million_views = 'Please enter a valid amount';
    }

    if (formData.content_type_tags.length === 0) {
      newErrors.content_type_tags = 'Please select at least one content type';
    }

    if (!campaignImage && isNewCampaign) {
      newErrors.image = 'Campaign image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    if (!user?.id) {
      alert('You must be logged in to create a campaign');
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl = campaignImage;
      if (imageFile) {
        imageUrl = await uploadCampaignImage();
      }

      const campaignData = {
        creator_id: user.id,
        title: formData.title,
        description: formData.description,
        image: imageUrl,
        money_per_million_views: parseInt(formData.money_per_million_views),
        content_type_tags: formData.content_type_tags,
        category_tags: formData.category_tags.length > 0 ? formData.category_tags : null,
        status: formData.status,
        entries: 0,
        total_views: 0,
        paid: 0,
        prize: 0,
      };

      let result;

      if (isNewCampaign) {
        result = await supabase
          .from('campaign')
          .insert([campaignData])
          .select();
      } else {
        const { entries, total_views, paid, prize, ...updateData } = campaignData;
        result = await supabase
          .from('campaign')
          .update(updateData)
          .eq('id', campaignId)
          .select();
      }

      const { data, error } = result;

      if (error) {
        console.error('Error saving campaign:', error);
        alert(`Error saving campaign: ${error.message}`);
        return;
      }

      console.log('Campaign saved:', data);
      alert(isNewCampaign ? 'Campaign created successfully!' : 'Campaign updated successfully!');
      router.push('/');

    } catch (err) {
      console.error('Unexpected error:', err);
      alert('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!ready || isLoadingCampaign) {
    return (
      <div className="min-h-screen bg-black text-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#ff7a66] animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Loading...</p>
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
          <p className="text-gray-400">Please log in to create or edit campaigns.</p>
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
            {isNewCampaign ? 'Create New Campaign' : 'Edit Campaign'}
          </h1>
          <p className="text-gray-400 text-xl">
            {isNewCampaign
              ? 'Fill out the details below to launch your campaign.'
              : 'Update your campaign information below.'}
          </p>
        </div>

        <div className="space-y-8">
          {/* Campaign Image Upload */}
          <div>
            <label className="block text-sm font-medium mb-3 text-gray-300">
              Campaign Image <span className="text-[#ff7a66]">*</span>
            </label>
            <div className="flex items-start gap-6">
              <label
                htmlFor="campaign-image"
                className="w-32 h-32 rounded-lg border-2 border-dashed border-[#ff7a66] flex items-center justify-center cursor-pointer hover:border-[#ff8c7a] transition-colors bg-zinc-900 overflow-hidden"
              >
                {campaignImage ? (
                  <img src={campaignImage} alt="Campaign" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center">
                    <Upload className="w-8 h-8 text-[#ff7a66] mx-auto mb-2" />
                    <span className="text-xs text-gray-500">Upload Image</span>
                  </div>
                )}
              </label>
              <input
                id="campaign-image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <div className="flex-1">
                <p className="text-sm text-gray-400 mb-2">
                  Upload a compelling image for your campaign. This will be the first thing people see.
                </p>
                <p className="text-xs text-gray-500">Recommended: 1200x630px, max 5MB</p>
              </div>
            </div>
            {errors.image && (
              <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.image}
              </p>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Campaign Title <span className="text-[#ff7a66]">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter a catchy campaign title"
              className={`w-full px-4 py-3 bg-zinc-900 border ${
                errors.title ? 'border-red-500' : 'border-zinc-800'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff7a66] focus:border-transparent text-white placeholder-gray-600`}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.title}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Description <span className="text-[#ff7a66]">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your campaign, goals, and what you're looking for..."
              rows={5}
              className={`w-full px-4 py-3 bg-zinc-900 border ${
                errors.description ? 'border-red-500' : 'border-zinc-800'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff7a66] focus:border-transparent text-white placeholder-gray-600 resize-none`}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.description}
              </p>
            )}
          </div>

          {/* Money Per Million Views */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Money Per Million Views (USD) <span className="text-[#ff7a66]">*</span>
            </label>
            <input
              type="number"
              name="money_per_million_views"
              value={formData.money_per_million_views}
              onChange={handleInputChange}
              placeholder="e.g., 500"
              min="1"
              className={`w-full px-4 py-3 bg-zinc-900 border ${
                errors.money_per_million_views ? 'border-red-500' : 'border-zinc-800'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff7a66] focus:border-transparent text-white placeholder-gray-600`}
            />
            {errors.money_per_million_views && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.money_per_million_views}
              </p>
            )}
          </div>

          {/* Content Type Tags */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300 flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Content Type <span className="text-[#ff7a66]">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {CONTENT_TYPE_OPTIONS.map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => toggleContentType(type)}
                  className={`px-4 py-2 rounded-lg border transition-all ${
                    formData.content_type_tags.includes(type)
                      ? 'bg-[#ff7a66] border-[#ff7a66] text-white shadow-[0_0_15px_rgba(255,122,102,0.4)]'
                      : 'bg-zinc-900 border-zinc-800 text-gray-400 hover:border-zinc-700'
                  }`}
                >
                  {type} {formData.content_type_tags.includes(type) ? '✓' : '+'}
                </button>
              ))}
            </div>
            {errors.content_type_tags && (
              <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.content_type_tags}
              </p>
            )}
          </div>

          {/* Category Tags */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Categories (Optional)
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_OPTIONS.map(category => (
                <button
                  key={category}
                  type="button"
                  onClick={() => toggleCategory(category)}
                  className={`px-3 py-2 rounded-lg border transition-all text-sm ${
                    formData.category_tags.includes(category)
                      ? 'bg-[#ff7a66] border-[#ff7a66] text-white'
                      : 'bg-zinc-900 border-zinc-800 text-gray-400 hover:border-zinc-700'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Status Toggle */}
          <div className="flex items-center justify-between p-4 bg-zinc-900 rounded-lg border border-zinc-800">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Campaign Status
              </label>
              <p className="text-sm text-gray-500">
                {formData.status ? 'Campaign is open for entries' : 'Campaign is closed'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, status: !prev.status }))}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                formData.status ? 'bg-[#ff7a66]' : 'bg-zinc-700'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  formData.status ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full py-4 bg-[#ff7a66] text-white font-semibold rounded-lg hover:bg-[#ff8c7a] transition-all shadow-[0_0_20px_rgba(255,122,102,0.5)] hover:shadow-[0_0_30px_rgba(255,122,102,0.7)] flex items-center justify-center gap-2 text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#ff7a66]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {isNewCampaign ? 'Creating Campaign...' : 'Updating Campaign...'}
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                {isNewCampaign ? 'Create Campaign' : 'Update Campaign'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CampaignEditPage;
