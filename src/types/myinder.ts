
export interface University {
  id: number;
  name: string;
  profile_name: string | null;
  custom_color: string | null;
  template: string | null;
}

export interface MyinderProfile {
  school: string;
  name: string;
  username: string;
  major: string;
  bio: string;
  song: string;
}

export const MAX_PHOTOS = 10;
export const MAX_PHOTO_SIZE_MB = 15;

export const INITIAL_PROFILE: MyinderProfile = {
  school: "",
  name: "",
  username: "",
  major: "",
  bio: "",
  song: "",
};
