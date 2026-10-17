
import { useMemo, useState } from "react";
import { Search, ChevronDown, Check } from "lucide-react";
import type {
  MyinderSubmission,
  School,
} from "../../types/myinder";

interface Props {
  profile: MyinderSubmission;
  schools: School[];
  onChange: (field: keyof MyinderSubmission, value: string) => void;
}

const inputClass =
  "mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/15";

export default function ProfileDetailsStep({
  profile,
  schools,
  onChange,
}: Props) {
  const [schoolSearch, setSchoolSearch] = useState("");
  const [schoolDropdownOpen, setSchoolDropdownOpen] = useState(false);

  const selectedSchool = schools.find(
    (school) => school.id === profile.school_id
  );

  const filteredSchools = useMemo(() => {
    const query = schoolSearch.trim().toLowerCase();

    if (!query) return schools;

    return schools.filter((school) =>
      school.name.toLowerCase().includes(query)
    );
  }, [schools, schoolSearch]);

  function selectSchool(school: School) {
    onChange("school_id", school.id);
    setSchoolSearch("");
    setSchoolDropdownOpen(false);
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <div className="relative sm:col-span-2">
        <label
          className="text-sm font-semibold"
          htmlFor="school-search"
        >
          Select your University
        </label>

        <button
          id="school-search"
          type="button"
          aria-haspopup="listbox"
          aria-expanded={schoolDropdownOpen}
          onClick={() => setSchoolDropdownOpen((open) => !open)}
          className={`${inputClass} flex items-center justify-between gap-2 text-left`}
        >
          <span
            className={
              selectedSchool
                ? "truncate text-slate-900"
                : "truncate text-slate-400"
            }
          >
            {selectedSchool?.name || "Search and select your university"}
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 text-slate-500" />
        </button>

        {schoolDropdownOpen && (
          <div className="absolute z-30 mt-1 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
            <div className="border-b border-slate-100 p-2">
              <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/15">
                <Search className="h-4 w-4 shrink-0 text-slate-400" />

                <input
                  autoFocus
                  type="text"
                  value={schoolSearch}
                  onChange={(event) =>
                    setSchoolSearch(event.target.value)
                  }
                  placeholder="Type university name..."
                  aria-label="Search universities"
                  className="w-full border-0 bg-transparent py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

            <ul
              role="listbox"
              aria-label="Universities"
              className="max-h-56 overflow-y-auto py-1"
            >
              {filteredSchools.length > 0 ? (
                filteredSchools.map((school) => {
                  const isSelected =
                    school.id === profile.school_id;

                  return (
                    <li key={school.id} role="option" aria-selected={isSelected}>
                      <button
                        type="button"
                        onClick={() => selectSchool(school)}
                        className={`flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left text-sm transition hover:bg-orange-50 ${
                          isSelected
                            ? "bg-orange-50 font-semibold text-orange-700"
                            : "text-slate-700"
                        }`}
                      >
                        <span>{school.name}</span>
                        {isSelected && (
                          <Check className="h-4 w-4 shrink-0 text-orange-600" />
                        )}
                      </button>
                    </li>
                  );
                })
              ) : (
                <li className="px-3 py-4 text-center text-sm text-slate-500">
                  No universities found. Try another name.
                </li>
              )}
            </ul>

            <div className="border-t border-slate-100 px-3 py-2 text-xs text-slate-500">
              {filteredSchools.length} universit
              {filteredSchools.length === 1 ? "y" : "ies"} found
            </div>
          </div>
        )}

        {schoolDropdownOpen && (
          <button
            type="button"
            aria-label="Close university dropdown"
            className="fixed inset-0 z-20 cursor-default"
            onClick={() => setSchoolDropdownOpen(false)}
          />
        )}

        <input
          type="hidden"
          name="school_id"
          value={profile.school_id}
          required
        />
      </div>

      <div>
        <label className="text-sm font-semibold" htmlFor="name">
          Full names
        </label>
        <input
          id="name"
          name="name"
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
        <div className="mt-1 flex items-center rounded-xl border border-slate-300 bg-white px-4 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/15">
          <span className="text-sm text-slate-500">@</span>
          <input
            id="username"
            name="ig_username"
            className="w-full border-0 px-2 py-2 text-sm outline-none"
            value={profile.ig_username}
            required
            maxLength={50}
            placeholder="yourusername"
            onChange={(e) =>
              onChange(
                "ig_username",
                e.target.value.replace(/^@/, "")
              )
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
          name="major"
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
          name="bio"
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
          Song{" "}
          <span className="font-normal text-slate-500">
            (optional)
          </span>
        </label>
        <input
          id="song"
          name="song"
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
