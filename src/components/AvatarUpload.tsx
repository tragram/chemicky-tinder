import { useState, useRef } from "react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

interface AvatarUploadProps {
  url: string
  onUpload: (url: string) => void
}

export default function AvatarUpload({ url, onUpload }: AvatarUploadProps) {
  const [avatarUrl, setAvatarUrl] = useState(url)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const newUrl = reader.result as string
        setAvatarUrl(newUrl)
        onUpload(newUrl)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="relative group w-full h-full">
      <Avatar className="w-full h-full">
        <AvatarImage src={avatarUrl} alt="User avatar" />
        <AvatarFallback>UN</AvatarFallback>
      </Avatar>
      <Button
        variant="secondary"
        className="absolute inset-0 flex items-center justify-center w-full h-full opacity-0 group-hover:opacity-80 transition-opacity"
        onClick={() => fileInputRef.current?.click()}
      >
        Change
      </Button>
      <input type="file" ref={fileInputRef} onChange={handleUpload} accept="image/*" className="hidden" />
    </div>
  )
}

