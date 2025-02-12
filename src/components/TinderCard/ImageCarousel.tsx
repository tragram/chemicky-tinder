import React, { useState, useRef, ForwardedRef } from "react";
import { useSpring, animated } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import { ArrowLeft, BriefcaseBusiness, Heart, Quote, ThumbsDown } from "lucide-react";
import { TinderProfile } from "@/types";
import { cn } from "clsx-for-tailwind";

interface ImageCarouselProps {
    profile: TinderProfile;
    cardRef: ForwardedRef
}

// TODO: site-wide
const VSCHT_RED = "#f04e23"

const ImageCarousel: React.FC<ImageCarouselProps> = ({ profile, cardRef }) => {
    const [currentImage, setCurrentImage] = useState(0);

    const handleTap = (e) => {
        const { clientX } = e;
        const rect = cardRef.current?.getBoundingClientRect();
        const tapPosition = clientX - rect.left;
        const width = rect.width;

        if (tapPosition < width / 2) {
            setCurrentImage(prev => Math.max(prev - 1, 0));
        } else {
            setCurrentImage(prev => Math.min(prev + 1, profile.images.length - 1));
        }
    };
    return (
        <>
            <div className="absolute top-2 left-0 right-0 flex justify-center gap-1.5 z-10">
                {profile.images.map((_, index) => (
                    <div
                        key={index}
                        className={`w-[35px] h-1.5 rounded backdrop-blur-md ${currentImage === index
                            ? `bg-[${VSCHT_RED}] bg-opacity-90`
                            : `bg-[white] bg-opacity-50`
                            }`}
                    />
                ))}
            </div>
            < div
                onClick={handleTap}
                className="relative w-full h-full overflow-hidden z-0"
            >
                <div
                    className="flex w-full h-full"
                    style={{
                        transform: `translateX(${-currentImage * 100}%)`,
                        transition: 'transform 0.3s ease'
                    }}
                >
                    {profile.images.map((image, index) => (
                        <div
                            key={index}
                            className="flex-shrink-0 w-full h-full relative"
                            style={{
                                backgroundImage: `url(${image})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                            }}
                        >
                        </div>
                    ))}
                </div>
            </div >
        </>
    )
}

export default ImageCarousel;