import React, { useState, useEffect } from "react";

interface TalkingImageProps {
  imgIdle: string;
  imgTalking: string;
}

export default function TalkingImage({ imgIdle, imgTalking }: TalkingImageProps) {
  const [isTalking, setIsTalking] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setIsTalking(t => !t), 250);
    return () => clearInterval(interval);
  }, []);

  return (
    <img
      src={isTalking ? imgTalking : imgIdle}
      alt={isTalking ? "Talking" : "Idle"}
      style={{
        position: "fixed",
        bottom: 0,
        left: "5px",
        height: "300px",
        objectFit: "contain",
        objectPosition: "left bottom",
        pointerEvents: "none",
        zIndex: 9999,
      }}
    />
  );
}
