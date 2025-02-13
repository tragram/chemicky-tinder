import React, { useState, useRef, ForwardedRef, act } from "react";
import { useSpring, animated } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import { ArrowLeft, BriefcaseBusiness, Heart, Quote, ThumbsDown, Timer } from "lucide-react";
import { TinderProfile } from "@/types";
import { cn } from "clsx-for-tailwind";

interface ProfileInfoProps {
    profile: TinderProfile;
    className: string;
}

const ProfileDetail: React.FC<{ icon: React.ElementType; text: string; isDescription?: boolean }> = ({ icon: Icon, text, isDescription }) => {
    return (
        <div className={cn("flex items-start gap-2")}>
            <div>
                <Icon className="text-primary" size={16} />
            </div>
            <p className={cn("text-sm md:tall:text-base lg:tall:text-lg", isDescription ? "font-semibold" : "font-bold")}>{text}</p>
        </div>
    );
};


const ProfileInfo: React.FC<ProfileInfoProps> = ({ profile, className }) => {
    return (
        <div className={cn("flex flex-col flex-shrink p-4 pb-8 tall:lg:p-8 tall:pb-16 tall:lg:pb-16 w-full h-fit text-white gap-1 tall:lg:gap-2 pointer-events-none bg-gradient-to-b from-transparent via-black/70 via-40% to-black", className)}>

            <h2 className={cn("text-lg tall:md:text-2xl font-extrabold mt-[15%]", "text-primary")}>{profile.name}
            </h2>

            <ProfileDetail icon={Timer} text={profile.age} />
            <ProfileDetail icon={BriefcaseBusiness} text={profile.job} />
            <ProfileDetail icon={Quote} text={profile.description} isDescription />
        </div>
    );
};

export default ProfileInfo;