// AvatarUpload.tsx
import React, { useState, useCallback, useRef } from "react";
import ReactDOM from "react-dom";
import Cropper from "react-easy-crop";
import getCroppedImg from "./cropImage";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AvatarUploadProps {
  url: string;
  onUpload: (croppedImage: string) => void;
  isCollapsed: boolean;
}

export default function AvatarUpload({ url, onUpload, isCollapsed }: AvatarUploadProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const [showModal, setShowModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Save cropped area pixels from Cropper callback
  const onCropComplete = useCallback(
    (croppedArea: any, croppedAreaPixels: any) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  // Handle file selection and open modal
  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const imageDataUrl = await readFile(file);
      setImageSrc(imageDataUrl);
      setShowModal(true);
    }
  };

  // Helper: read file as data URL
  const readFile = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        resolve(reader.result as string)
      );
      reader.readAsDataURL(file);
    });
  };

  // Get cropped image and pass it to parent, then close modal
  const showCroppedImage = useCallback(async () => {
    if (imageSrc && croppedAreaPixels) {
      try {
        const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
        onUpload(croppedImage);
        setShowModal(false);
        setImageSrc(null);
      } catch (e) {
        console.error(e);
      }
    }
  }, [imageSrc, croppedAreaPixels, onUpload]);

  // Cancel cropping
  const cancelCrop = () => {
    setShowModal(false);
    setImageSrc(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // The cropping modal is rendered using a portal to ensure it’s not constrained by parent layout.
  const croppingModal = (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-75">
      <div className="relative w-full h-full flex flex-col">
        {/* Cropper container */}
        <div className="relative flex-grow">
          <Cropper
            image={imageSrc as string}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round" // circular selection
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>
        {/* Modal controls */}
        <div className="p-4 bg-white flex justify-center gap-4">
          <Button variant="destructive" onClick={cancelCrop}>
            Cancel
          </Button>
          <Button onClick={showCroppedImage}>Crop & Save</Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative w-full h-full ">
      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={onFileChange}
      />

      {/* Avatar preview container – size controlled by the parent */}
      <div
        className={cn("relative w-full h-full rounded-full overflow-hidden bg-gray-200 cursor-pointer border-white border-2 outline-primary outline ", isCollapsed ? "text-xs outline-2" : "outline-2")}
        onClick={() => fileInputRef.current?.click()}
      >
        {url ? (
          <img src={url} alt="avatar" className="object-cover w-full h-full bg-white" />
        ) : (
          <div className={cn("flex items-center justify-center w-full h-full text-gray-500")}>
            {isCollapsed ? "" : "Choose Image"}
          </div>
        )}
        {/* Hover overlay */}
        <div className="absolute inset-0 flex justify-center bg-black bg-opacity-0 hover:bg-opacity-30 transition-colors">
          <span className="text-white content-center bg-black/30 h-full w-full opacity-0 hover:opacity-100 transition-opacity">
            Change
          </span>
        </div>
      </div>

      {/* Render the cropping modal via a portal */}
      {showModal && imageSrc &&
        ReactDOM.createPortal(croppingModal, document.body)}
    </div>
  );
}
