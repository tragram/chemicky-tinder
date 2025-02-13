import React, { useState, useRef, ForwardedRef, act, useEffect } from "react";
import { useSpring, animated } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import { ArrowLeft, BriefcaseBusiness, Heart, Quote, ThumbsDown } from "lucide-react";
import { TinderProfile } from "@/types";
import { cn } from "clsx-for-tailwind";
import ImageCarousel from "./ImageCarousel";
import ProfileInfo from "./ProfileInfo";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

const SWIPE_THRESHOLD = 150;
const SCREEN_WIDTH = window.innerWidth;
const LIKE_COLOR = "#f04f23";
const NOPE_COLOR = "#0065BD";

interface BottomCardProps {
    cardActive: boolean;
    zIndex: number;
}

const BottomCard: React.FC<BottomCardProps> = ({ zIndex, cardActive }) => {
    const [{ x, y, rotate, scale }, api] = useSpring(() => ({
        x: 0,
        y: 0,
        rotate: 0,
        scale: 0.8,
        config: { tension: 300, friction: 15 },
    }));

    useEffect(() => {
        if (cardActive) { api.start({ scale: 1 }) }
    }, [cardActive])


    return (
        <animated.div
            style={{
                x,
                y,
                rotate,
                scale: scale,
                zIndex: zIndex,
            }}
            className={cn("absolute aspect-[2/3] h-full max-w-full rounded-3xl bg-white", cardActive ? "" : "")}
        >
            <div className={cn("h-full w-full transition-transform rounded-3xl relative overflow-clip border-4 border-[#0065BD]", cardActive ? "" : "blur-sm")}
                style={{ backgroundColor: NOPE_COLOR + "20" }}
            >
                <div className="flex flex-col items-center h-full justify-center p-24 text-center gap-4">
                    <h1 className="font-extrabold text-3xl text-[#0065BD] mb-8">Nemáš štěstí s&nbsp;hledáním svého VŠCHTího protějšku?</h1>
                    <Button className="text-xl" size={"lg"} onClick={() => window.location.reload()}>Zkusím to znovu!</Button>
                    <h2 className="font-bold text-xl text-[#0065BD]">nebo</h2>
                    <Button className="bg-[#0065BD] text-xl p-4" size={"lg"} asChild>
                        <Link to="https://www.cvut.cz/">
                            Radši jdu naproti!
                        </Link>
                    </Button>
                </div>
            </div>
        </animated.div>
    );
};

export default BottomCard;