
import { useEffect, useRef, useState } from "react";
import { ImagePlus, UploadCloud, X } from "lucide-react";
import { useMyinderFormStore } from "../../stores/formstore";

const MAX_PHOTOS = 10;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MiB
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export default function PhotoUploadStep() {
  const { photos, setPhotos, removePhoto } = useMyinderFormStore();

  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");

  const [previews, setPreviews] = useState<
    { file: File; url: string }[]
  >([]);

  // Create temporary browser previews and release their URLs when replaced.
  useEffect(() => {
    const next = photos.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setPreviews(next);

    return () => {
      next.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [photos]);

  function addPhotos(fileList: FileList | File[]) {
    setError("");

    const incoming = Array.from(fileList);
    const remaining = MAX_PHOTOS - photos.length;

    if (remaining <= 0) {
      setError("You can upload a maximum of 10 photos.");
      return;
    }

    const accepted: File[] = [];
    const problems: string[] = [];

    for (const file of incoming) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        problems.push(`${file.name}: use JPG, PNG, or WebP.`);
        continue;
      }

      if (file.size > MAX_FILE_SIZE) {
        problems.push(`${file.name}: maximum size is 5 MiB.`);
        continue;
      }

      if (accepted.length < remaining) {
        accepted.push(file);
      } else {
        problems.push(
          `${file.name}: the maximum of ${MAX_PHOTOS} photos would be exceeded.`,
        );
      }
    }

    if (accepted.length > 0) {
      setPhotos([...photos, ...accepted]);
    }

    if (problems.length > 0) {
      setError(problems.join(" "));
    }
  }

  function handleRemovePhoto(index: number) {
    setError("");
    removePhoto(index);
  }

  return (
    <div className="space-y-4">
      <div>
        <div className="mb-2 flex items-center gap-2">
          <ImagePlus className="h-6 w-6 text-orange-600" />

          <h2 className="text-xl font-bold text-slate-900">
            Upload your photos
          </h2>
        </div>

        <p className="text-sm leading-6 text-slate-500">
          Add up to 10 photos. Your first photo will be used for your
          featured post.
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={(event) => {
          if (event.target.files) {
            addPhotos(event.target.files);
          }

          // Allow selecting the same file again after removing it.
          event.target.value = "";
        }}
      />

      {photos.length < MAX_PHOTOS && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={(event) => {
            event.preventDefault();
            setDragging(false);
          }}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            addPhotos(event.dataTransfer.files);
          }}
          className={`flex min-h-32 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-5 text-center transition ${
            dragging
              ? "border-orange-500 bg-orange-50"
              : "border-slate-300 bg-white hover:border-orange-400 hover:bg-orange-50/40"
          }`}
        >
          <UploadCloud className="mb-2 h-9 w-9 text-orange-600" />

          <span className="font-semibold text-slate-800">
            Click to upload or drag and drop
          </span>

          <span className="mt-2 text-sm text-slate-500">
            JPG, PNG or WebP · Up to 5 MiB per photo
          </span>

          <span className="mt-1 text-xs text-slate-400">
            {photos.length} of {MAX_PHOTOS} photos selected
          </span>
        </button>
      )}

      {error && (
        <p role="alert" className="text-sm leading-5 text-red-600">
          {error}
        </p>
      )}

      {photos.length > 0 && (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800">
              Your selected photos
            </h3>

            <span className="text-sm text-slate-500">
              {photos.length}/{MAX_PHOTOS}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 sm:gap-3">
            {previews.map((preview, index) => (
              <div
                key={`${preview.file.name}-${index}`}
                className="group relative min-w-0"
              >
                <img
                  src={preview.url}
                  alt={`Selected photo ${index + 1}`}
                  className={`aspect-square w-full rounded-lg border object-cover ${
                    index === 0
                      ? "border-2 border-orange-500"
                      : "border-slate-200"
                  }`}
                />

                {index === 0 && (
                  <span className="absolute bottom-1 left-1 rounded bg-orange-600 px-1.5 py-0.5 text-[9px] font-semibold text-white sm:text-[10px]">
                    Featured
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => handleRemovePhoto(index)}
                  aria-label={`Remove photo ${index + 1}`}
                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900/75 text-white transition hover:bg-red-600"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="text-xs leading-5 text-slate-500">
        Your first selected photo becomes your featured photo.
      </p>
    </div>
  );
}