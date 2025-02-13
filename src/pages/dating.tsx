import DefaultLayout from "@/layouts/default";
import data from '@/dating_profiles.yaml';
import TinderStack from "@/components/TinderStack";
import UserInfo from "@/components/UserInfo/UserInfo";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { createTinderProfile, TinderProfile, TinderRecord } from "@/types";
import MatchScreen from "@/components/MatchScreen";

export default function DatingPage() {
  const [name, setName] = useState("Nadějný chemik");
  const [avatarUrl, setAvatarUrl] = useState("MatchLab_logo.png");
  const [isUserCollapsed, setIsUserCollapsed] = useState(false);
  const [matchedProfile, setMatchedProfile] = useState<TinderProfile | null>(null);

  const handleContinue = () => {
    setMatchedProfile(null);
  };
  return (
    <DefaultLayout>
      <div className="flex absolute w-full h-[85dvh] p-6 top-[3dvh] items-end z-0">
        <TinderStack profiles={(data as TinderRecord[]).map(d => createTinderProfile(d))} onMatch={setMatchedProfile} />
      </div>
      <div className={cn("transition-all duration-500 ease-in-out absolute w-full flex items-end md:tall:items-center justify-center md:tall:p-8 z-10", isUserCollapsed ? "h-[10dvh] bottom-0" : "h-full")}>
        <UserInfo isCollapsed={isUserCollapsed} setIsCollapsed={setIsUserCollapsed} name={name} setName={setName} avatarUrl={avatarUrl} setAvatarUrl={setAvatarUrl} />
      </div>

      {matchedProfile && (
        <MatchScreen
          userName={name}
          userAvatar={avatarUrl}
          profile={matchedProfile}
          onContinue={handleContinue}
        />
      )}
    </DefaultLayout>
  )
}
