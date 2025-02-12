import { useState, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Pencil } from "lucide-react"
import AvatarUpload from "./AvatarUpload"
import { cn } from "@/lib/utils"

interface CollapsibleProfileCardProps {
  name: string
  setName: (name: string) => void
  avatarUrl: string
  setAvatarUrl: (url: string) => void
  isCollapsed: boolean
  setIsCollapsed: (collapsed: boolean) => void
}

export default function CollapsibleProfileCard({
  name,
  setName,
  avatarUrl,
  setAvatarUrl,
  isCollapsed,
  setIsCollapsed
}: CollapsibleProfileCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [contentHeight, setContentHeight] = useState<number>(40)
  const contentRef = useRef<HTMLDivElement>(null)

  // Update content height when content changes or collapse state changes
  useEffect(() => {
    const updateHeight = () => {
      if (contentRef.current) {
        setContentHeight(contentRef.current.scrollHeight)
      }
    }

    updateHeight()
    window.addEventListener('resize', updateHeight)
    return () => window.removeEventListener('resize', updateHeight)
  }, [name, avatarUrl, isCollapsed])

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedName = name.trim()
    
    if (!trimmedName) {
      return // Don't submit empty names
    }
    
    setIsCollapsed(true)
    setIsEditing(false)
  }

  const toggleEditing = () => {
    if (isCollapsed) {
      setIsEditing(!isEditing)
    }
  }
  return (
    <Card
      className={cn(
        "rounded-none md:rounded-3xl overflow-hidden bg-white border-primary border-0  md:border-4 transition-all duration-500 ease-in-out shadow-lg",
        isCollapsed ? "w-full h-fit md:w-[50vh] border-t-4" : "w-full h-full"
      )}
    //   style={{
    //     minHeight: isCollapsed ? "4rem" : `${contentHeight}px`,
    //   }}
    >
      <CardContent 
        ref={contentRef} 
        className="p-2 px-6 transition-all bg-primary/5 duration-500 ease-in-out h-full justify-bottom"
      >
        <div
          className={cn(
            "flex transition-all duration-500 ease-in-out items-center",
            isCollapsed ? "flex-row" : "flex-col"
          )}
        >
          <div
            className={cn(
              "transition-all duration-500 ease-in-out",
              isCollapsed ? "w-8 h-8 md:w-12 md:h-12 flex-shrink-0" : "w-[50vw] h-full mb-6"
            )}
          >
            <AvatarUpload 
              url={avatarUrl} 
              onUpload={setAvatarUrl} 
              isCollapsed={isCollapsed} 
            />
          </div>

          <div
            className={cn(
              "transition-all duration-500 ease-in-out",
              isCollapsed ? "ml-4 flex-grow" : "w-full mt-6"
            )}
          >
            {(!isCollapsed || isEditing) ? (
              <form 
                onSubmit={handleSubmit} 
                className="space-y-2"
              >
                {!isCollapsed && <Label htmlFor="name">Name</Label>}
                <div className="flex gap-4 h-full">
                  <Input
                    id="name"
                    placeholder="Nadějný chemik"
                    value={name}
                    onChange={handleNameChange}
                    className="flex-grow border-primary border-2"
                  />
                  {isCollapsed && (
                    <Button type="submit" size="default">
                      Save
                    </Button>
                  )}
                </div>
              </form>
            ) : (
              <button
                type="button"
                className="text-lg font-semibold flex items-center gap-2 w-full text-left"
                onClick={toggleEditing}
              >
                <span className="truncate">{name}</span>
                <Pencil className="w-4 h-4 text-primary flex-shrink-0" />
              </button>
            )}
          </div>
        </div>

        <Button 
          onClick={handleSubmit} 
          className={cn("w-full mt-2", isCollapsed && "hidden")}
        >
          Submit
        </Button>
      </CardContent>
    </Card>
  )
}