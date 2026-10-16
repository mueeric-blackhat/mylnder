
import { create } from "zustand";
import type { MyinderProfile } from "../types/myinder";

interface MyinderFormState {
  profile: MyinderProfile;
  photos: File[];
  setProfileField: (field: keyof MyinderProfile, value: string) => void;
  setPhotos: (photos: File[]) => void;
  removePhoto: (index: number) => void;
  resetForm: () => void;
}

const initialProfile: MyinderProfile = {
  school: "",
  name: "",
  username: "",
  major: "",
  bio: "",
  song: "",
};

export const useMyinderFormStore = create<MyinderFormState>((set) => ({
  profile: { ...initialProfile },
  photos: [],

  setProfileField: (field, value) =>
    set((state) => ({
      profile: { ...state.profile, [field]: value },
    })),

  setPhotos: (photos) => set({ photos: photos.slice(0, 10) }),

  removePhoto: (index) =>
    set((state) => ({
      photos: state.photos.filter((_, i) => i !== index),
    })),

  resetForm: () =>
    set({
      profile: { ...initialProfile },
      photos: [],
    }),
}));
