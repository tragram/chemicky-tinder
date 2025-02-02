import DefaultLayout from "@/layouts/default";
import data from '@/dating_profiles.yaml';
import TinderStack from "@/components/TinderStack";
import UserInfo from "@/components/UserInfo";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { TinderProfile } from "@/types";
import MatchScreen from "@/components/MatchScreen";

export default function DatingPage() {
  const [isUserCollapsed, setIsUserCollapsed] = useState(false)
  const [matchedProfile, setMatchedProfile] = useState<TinderProfile | null>(null);    
  const [name, setName] = useState("Nadějný chemik");
  const [avatarUrl, setAvatarUrl] = useState("");
  const handleContinue = () => {
    setMatchedProfile(null);
  };

  return (
    <DefaultLayout>
      <div className="flex absolute w-screen h-[90vh] p-8 z-20 items-end">
        <TinderStack profiles={data} onMatch={setMatchedProfile} />
      </div>
      <div className={cn("z-30 transition-all duration-1000 ease-in-out absolute w-screen flex items-center justify-center p-16", isUserCollapsed ? "h-[10vh] bottom-0" : "h-screen")}>
        <UserInfo isCollapsed={isUserCollapsed} setIsCollapsed={setIsUserCollapsed} name={name} setName={setName} avatarUrl={avatarUrl} setAvatarUrl={setAvatarUrl} />
      </div>

      {matchedProfile && (
        <MatchScreen
          userName={"Nadějný chemik"}
          userAvatar={avatarUrl}
          profile={matchedProfile}
          onContinue={handleContinue}
        />
      )}
    </DefaultLayout>
  )
}
