export interface Interest {
  interest: string;
  skill_level: string;
}

export interface OnboardingData {
  dateOfBirth?: string;
  gender?: string;
  bio?: string;
  interests?: Interest[];
  image?: string;
  location?: string;
}