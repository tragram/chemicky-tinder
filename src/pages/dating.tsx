import DefaultLayout from "@/layouts/default";
import data from '@/dating_profiles.yaml';
import TinderStack from "@/components/TinderStack";
import UserInfo from "@/components/UserInfo/UserInfo";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { TinderProfile } from "@/types";
import MatchScreen from "@/components/MatchScreen";

export default function DatingPage() {
  const [name, setName] = useState("Nadějný chemik");
  const [isUserCollapsed, setIsUserCollapsed] = useState(false);
  const [matchedProfile, setMatchedProfile] = useState<TinderProfile | null>(null);    
  const [avatarUrl, setAvatarUrl] = useState("default_profile_img.png");

  const handleContinue = () => {
    setMatchedProfile(null);
  };

  return (
    <DefaultLayout>
      <div className="flex absolute w-screen h-[90dvh] md:h-[85dvh] p-2 md:p-4 lg:p-8 z-0 items-end">
        <TinderStack profiles={data} onMatch={setMatchedProfile} />
      </div>
      <div className={cn("z-0 transition-all duration-1000 ease-in-out absolute w-screen flex items-end md:items-center justify-center md:p-8", isUserCollapsed ? "h-[10dvh] md:h-[15dvh] bottom-0" : "h-screen")}>
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
