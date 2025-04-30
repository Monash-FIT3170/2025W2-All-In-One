import React, { useState } from "react";
import { useImagePreload } from "/app/client/ui-modules/hooks/useImagePreload";
import { IconButton } from "/app/client/ui-modules/common/IconButton";
import { twMerge } from "tailwind-merge";

export function ImageCarousel({
  imageUrls,
  leftArrowIcon,
  rightArrowIcon,
  className = "",
}: {
  imageUrls: string[];
  leftArrowIcon: React.ReactNode;
  rightArrowIcon: React.ReactNode;
  className?: string;
}): React.JSX.Element {
  const [imagesLoaded, failedUrls] = useImagePreload(imageUrls);
  const [currentImageI, setCurrentImageI] = useState(0);
  const images = imageUrls.map((url) => (
    <img
      key={url}
      src={url}
      className="h-full w-full object-cover rounded-lg"
    />
  ));

  const isFirstImage = currentImageI === 0;
  const isLastImage = currentImageI === images.length - 1;

  if (!imagesLoaded) {
    return <ImageCarouselLoadingSkeleton className={className} />;
  } else {
    return (
      <div className={twMerge("aspect-3/2 w-[620px] relative", className)}>
        {images[currentImageI]}
        <ImageCarouselButtons
          className="absolute top-0 left-0"
          leftArrowIcon={leftArrowIcon}
          rightArrowIcon={rightArrowIcon}
          shouldDisplayLeftArrow={!isFirstImage}
          shouldDisplayRightArrow={!isLastImage}
          onLeftArrowClicked={() => {
            setCurrentImageI(currentImageI - 1);
          }}
          onRightArrowClicked={() => {
            setCurrentImageI(currentImageI + 1);
          }}
        />
      </div>
    );
  }
}

function ImageCarouselButtons({
  leftArrowIcon,
  rightArrowIcon,
  shouldDisplayLeftArrow,
  shouldDisplayRightArrow,
  onLeftArrowClicked,
  onRightArrowClicked,
  className = "",
}: {
  leftArrowIcon: React.ReactNode;
  rightArrowIcon: React.ReactNode;
  shouldDisplayLeftArrow: boolean;
  shouldDisplayRightArrow: boolean;
  onLeftArrowClicked: () => void;
  onRightArrowClicked: () => void;
  className?: string;
}): React.JSX.Element {
  return (
    <div
      className={twMerge("flex flex-row items-center h-full w-full", className)}
    >
      <IconButton
        icon={leftArrowIcon}
        onClick={onLeftArrowClicked}
        className={`ml-3 mr-auto ${shouldDisplayLeftArrow ? "" : "invisible"} `}
      />
      <IconButton
        icon={rightArrowIcon}
        onClick={onRightArrowClicked}
        className={`mr-3 ${shouldDisplayRightArrow ? "" : "invisible"}`}
      />
    </div>
  );
}

function ImageCarouselLoadingSkeleton({
  className = "",
}: {
  className?: string;
}): React.JSX.Element {
  return (
    <div className={twMerge("h-[445px] w-[724px] bg-[#EEEEEE]", className)}>
      Loading...
    </div>
  );
}
