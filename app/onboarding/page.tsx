"use client";

import { useState } from 'react';
import { UserTypeSelection, UserType } from '@/components/UserTypeSelection';
import ProfileSetup from '@/components/ProfileSetup';

export default function OnboardingPage() {
  const [selectedUserType, setSelectedUserType] = useState<UserType | null>(null);

  const handleUserTypeSelect = (type: UserType) => {
    setSelectedUserType(type);
  };

  if (!selectedUserType) {
    return <UserTypeSelection onSelect={handleUserTypeSelect} />;
  }

  return <ProfileSetup userType={selectedUserType} />;
}
