export interface School {
  id: string;
  name: string;
  profile_name: string;
  custom_color: string;
  template: "basic" | "standard";
}

export interface MyinderSubmission {
  name: string;
  ig_username: string;
  major: string;
  bio: string;
  school_id: string;
  song: string;
  photos: string[];
}