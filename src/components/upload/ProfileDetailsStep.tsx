
import type {
  MyinderProfile,
  University,
} from "../../types/myinder";

interface Props {
  profile: MyinderProfile;
  universities: University[];
  onChange: (field: keyof MyinderProfile, value: string) => void;
}

const inputClass =
  "mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15";

export default function ProfileDetailsStep({
  profile,
  universities,
  onChange,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <label className="text-sm font-semibold" htmlFor="school">
          University
        </label>

        <select
          id="school"
          className={inputClass}
          value={profile.school}
          required
          onChange={(e) => onChange("school", e.target.value)}
        >
          <option value="">Select your university</option>

          {universities.map((school) => (
            <option key={school.id} value={school.name}>
              {school.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm font-semibold" htmlFor="name">
          Full names
        </label>

        <input
          id="name"
          className={inputClass}
          value={profile.name}
          required
          maxLength={100}
          autoComplete="name"
          placeholder="Your full name"
          onChange={(e) => onChange("name", e.target.value)}
        />
      </div>

      <div>
        <label className="text-sm font-semibold" htmlFor="username">
          Instagram username
        </label>

        <div className="mt-1 flex items-center rounded-xl border border-slate-300 bg-white px-4 focus-within:border-emerald-700 focus-within:ring-2 focus-within:ring-emerald-700/15">
          <span className="text-sm text-slate-500">@</span>

          <input
            id="username"
            className="w-full border-0 px-2 py-2 text-sm outline-none"
            value={profile.username}
            required
            maxLength={50}
            placeholder="yourusername"
            onChange={(e) =>
              onChange("username", e.target.value.replace(/^@/, ""))
            }
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold" htmlFor="major">
          Major
        </label>

        <input
          id="major"
          className={inputClass}
          value={profile.major}
          required
          maxLength={100}
          placeholder="e.g. Computer Science"
          onChange={(e) => onChange("major", e.target.value)}
        />
      </div>

      <div className="sm:col-span-2">
        <label className="text-sm font-semibold" htmlFor="bio">
          Bio 
        </label>

        <textarea
          id="bio"
          className={inputClass}
          value={profile.bio}
          required
          rows={2}
          maxLength={1000}
          placeholder="A little about you"
          onChange={(e) => onChange("bio", e.target.value)}
        />
      </div>

      <div>
        <label className="text-sm font-semibold" htmlFor="song">
          Song <span className="font-normal text-slate-500">(optional)</span>
        </label>

        <input
          id="song"
          className={inputClass}
          value={profile.song}
          maxLength={100}
          placeholder="A song that represents you"
          onChange={(e) => onChange("song", e.target.value)}
        />
      </div>
    </div>
  );
}
