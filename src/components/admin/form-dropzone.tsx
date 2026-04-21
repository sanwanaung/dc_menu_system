"use client";

import { useCallback, useEffect, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import { X } from "lucide-react";
import Image from "next/image";

type Props = {
  value: File | File[] | undefined;
  onChange: (value: any) => void;
  error?: any;
  multiple?: boolean;
  disabled?: boolean;
};

export function DropzoneField({
  value,
  onChange,
  error,
  multiple = false,
  disabled = false,
}: Props) {
  const onDrop = useCallback(
    (files: File[]) => {
      onChange(multiple ? files : files[0]);
    },
    [onChange, multiple],
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      multiple,
      disabled,
      accept: {
        "image/jpg": [],
        "image/jpeg": [],
        "image/png": [],
        "image/webp": [],
        "image/svg+xml": [],
      },
    });

  const file = useMemo(() => {
    if (!value) return null;
    return Array.isArray(value) ? value[0] : value;
  }, [value]);

  const previewUrl = useMemo(() => {
    if (!file) return null;
    return URL.createObjectURL(file);
  }, [file]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(multiple ? [] : undefined);
  };

  return (
    <div className="space-y-2">
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-xl p-4
          min-h-50 flex items-center justify-center
          cursor-pointer transition
          ${isDragActive ? "border-blue-500 bg-blue-50" : ""}
          ${isDragReject ? "border-red-500 bg-red-50" : ""}
          ${disabled ? "opacity-50 pointer-events-none" : ""}
        `}
      >
        <input {...getInputProps()} />

        {isDragActive && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/5 rounded-xl">
            <p className="text-sm font-medium">Drop image here</p>
          </div>
        )}

        {/* Preview */}
        {previewUrl ? (
          <div className="relative w-full">
            <Image
              src={previewUrl}
              className="h-44 w-full object-cover rounded-lg border"
              width={1000}
              height={1000}
              alt="image/menu"
            />

            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 bg-black/70 text-white p-1 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>

            <p className="text-xs mt-2 text-muted-foreground truncate">
              {file?.name}
            </p>
          </div>
        ) : (
          <div className="text-center space-y-1">
            <p className="text-sm font-medium">Drag & drop image</p>
            <p className="text-xs text-muted-foreground">or click to upload</p>
          </div>
        )}
      </div>

      {/* Error */}
      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  );
}
