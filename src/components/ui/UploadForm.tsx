"use client";

import { useState, useRef } from "react";
import { Camera, Image as ImageIcon, Loader2 } from "lucide-react";
import { getCloudinarySignature } from "@/app/actions/cloudinary";
import { createMemory } from "@/app/actions/memory";
import Image from "next/image";

export function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const uploadToCloudinary = async (): Promise<string | null> => {
    if (!file) return null;

    try {
      const { timestamp, signature, apiKey, cloudName } = await getCloudinarySignature();
      
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", apiKey!);
      formData.append("timestamp", timestamp.toString());
      formData.append("signature", signature);
      formData.append("folder", "rewind");

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Cloudinary upload failed:", error);
      return null;
    }
  };

  const handleSubmit = async (formData: FormData) => {
    setIsUploading(true);
    
    try {
      let mediaUrl = "";
      if (file) {
        const uploadedUrl = await uploadToCloudinary();
        if (uploadedUrl) {
          mediaUrl = uploadedUrl;
        }
      }
      
      formData.append("mediaUrl", mediaUrl);
      
      // Server action to create memory
      await createMemory(formData);
    } catch (error) {
      console.error("Submission failed:", error);
      setIsUploading(false);
    }
  };

  return (
    <form action={handleSubmit} className="bg-paper-dark p-6 md:p-8 rounded-lg paper-shadow border border-ink/5">
      {/* Image Upload Area */}
      <div 
        className="mb-8 relative w-full aspect-[4/3] bg-ink/5 flex flex-col items-center justify-center border-2 border-dashed border-ink/20 rounded hover:bg-ink/10 transition-colors cursor-pointer group overflow-hidden"
        onClick={() => fileInputRef.current?.click()}
      >
        {preview ? (
          <Image src={preview} alt="Preview" fill className="object-cover" />
        ) : (
          <>
            <ImageIcon className="w-12 h-12 text-ink/40 mb-2 group-hover:text-ink/60 transition-colors" />
            <span className="font-sans text-sm text-ink-light">
              Click to select a photo
            </span>
          </>
        )}
        <input 
          type="file" 
          accept="image/*" 
          className="hidden" 
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      </div>

      <div className="space-y-6">
        <div>
          <label htmlFor="title" className="block font-marker text-xl text-ink mb-2">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            placeholder="E.g., Last chai before OS viva"
            className="w-full bg-paper border border-ink/20 rounded p-3 font-sans text-ink focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
            required
            disabled={isUploading}
          />
        </div>

        <div>
          <label htmlFor="story" className="block font-marker text-xl text-ink mb-2">
            The Story
          </label>
          <textarea
            id="story"
            name="story"
            rows={4}
            placeholder="What happened? Why does this matter? Write it like a diary entry..."
            className="w-full bg-paper border border-ink/20 rounded p-3 font-sans text-ink focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
            required
            disabled={isUploading}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="date" className="block font-sans font-semibold text-sm text-ink mb-2">
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              className="w-full bg-paper border border-ink/20 rounded p-2.5 font-sans text-ink focus:outline-none focus:border-accent"
              required
              disabled={isUploading}
            />
          </div>

          <div>
            <label htmlFor="event" className="block font-sans font-semibold text-sm text-ink mb-2">
              Event (Optional)
            </label>
            <select
              id="event"
              name="event"
              className="w-full bg-paper border border-ink/20 rounded p-2.5 font-sans text-ink focus:outline-none focus:border-accent"
              disabled={isUploading}
            >
              <option value="">Select an event...</option>
              <option value="freshers">Fresher's Party</option>
              <option value="techfest">Tech Fest</option>
              <option value="trip">Trip</option>
              <option value="hostel">Hostel Life</option>
              <option value="farewell">Farewell</option>
              <option value="random">Random Day</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="location" className="block font-sans font-semibold text-sm text-ink mb-2">
            Location (Optional)
          </label>
          <input
            type="text"
            id="location"
            name="location"
            placeholder="E.g., Nescafe, Main Gate"
            className="w-full bg-paper border border-ink/20 rounded p-2.5 font-sans text-ink focus:outline-none focus:border-accent"
            disabled={isUploading}
          />
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-ink/10 flex justify-end">
        <button
          type="submit"
          disabled={isUploading}
          className="bg-accent hover:bg-accent/90 text-white font-sans font-medium px-8 py-3 rounded shadow-sm transition-colors text-lg flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Preserving...
            </>
          ) : (
            "Preserve Memory"
          )}
        </button>
      </div>
    </form>
  );
}
