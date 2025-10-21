"use client";

import { Paperclip, Send, X } from "lucide-react";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAutoResizeTextarea } from "@/components/hooks/use-auto-resize-textarea";
import Image from "next/image";

interface AIInputWithSearchProps {
  id?: string;
  placeholder?: string;
  minHeight?: number;
  maxHeight?: number;
  onSubmit?: (value: string, files: File[]) => void;
  onFileSelect?: (file: File) => void;
  initialValue?: string;
  disabled?: boolean;
  className?: string;
}

export function AIInputWithSearch({
  id = "ai-input-with-search",
  placeholder = "Describe your comic story...",
  minHeight = 48,
  maxHeight = 164,
  onSubmit,
  onFileSelect,
  initialValue = "",
  disabled = false,
  className
}: AIInputWithSearchProps) {
  const [value, setValue] = useState(initialValue);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight,
    maxHeight,
  });

  const handleSubmit = () => {
    if (value.trim() || selectedFiles.length > 0) {
      onSubmit?.(value, selectedFiles);
      // Don't clear files - let parent component manage them
      // setValue("");
      // setSelectedFiles([]);
      // setPreviewUrls([]);
      adjustHeight(true);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      files.forEach(file => {
        onFileSelect?.(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrls(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
      setSelectedFiles(prev => [...prev, ...files]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className={cn("w-full py-4", className)}>
      <div className="relative max-w-xl w-full mx-auto">
        {/* File Previews */}
        {previewUrls.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {previewUrls.map((url, index) => (
              <div key={index} className="relative group">
                <Image
                  src={url}
                  alt={`Upload ${index + 1}`}
                  width={80}
                  height={80}
                  className="rounded-lg object-cover border-2 border-gray-200"
                />
                <button
                  onClick={() => removeFile(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="relative flex flex-col">
          <div
            className="overflow-y-auto"
            style={{ maxHeight: `${maxHeight}px` }}
          >
            <Textarea
              id={id}
              value={value}
              placeholder={placeholder}
              className="w-full rounded-xl rounded-b-none px-4 py-3 bg-black/5 dark:bg-white/5 border-none dark:text-white placeholder:text-black/70 dark:placeholder:text-white/70 resize-none focus-visible:ring-0 leading-[1.2]"
              ref={textareaRef}
              disabled={disabled}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              onChange={(e) => {
                setValue(e.target.value);
                adjustHeight();
              }}
            />
          </div>

          <div className="h-12 bg-black/5 dark:bg-white/5 rounded-b-xl">
            <div className="absolute left-3 bottom-3 flex items-center gap-2">
              <label className={cn(
                "rounded-lg p-2 bg-black/5 dark:bg-white/5 transition-colors",
                disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-black/10 dark:hover:bg-white/10"
              )}>
                <input 
                  type="file" 
                  className="hidden"
                  accept="image/*"
                  multiple
                  disabled={disabled}
                  onChange={handleFileChange}
                />
                <Paperclip className="w-4 h-4 text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors" />
              </label>
              {selectedFiles.length > 0 && (
                <span className="text-xs text-black/60 dark:text-white/60">
                  {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''}
                </span>
              )}
            </div>
            <div className="absolute right-3 bottom-3">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!value.trim() && selectedFiles.length === 0}
                className={cn(
                  "rounded-lg p-2 transition-colors",
                  value.trim() || selectedFiles.length > 0
                    ? "bg-sky-500/15 text-sky-500 hover:bg-sky-500/25"
                    : "bg-black/5 dark:bg-white/5 text-black/40 dark:text-white/40 cursor-not-allowed"
                )}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

