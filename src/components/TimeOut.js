"use client";
import React, { useEffect, useState } from "react";
import { useIdle } from "@uidotdev/usehooks";
import { ClockAlert } from "lucide-react";
import Countdown from "react-countdown";

import "../style/components/TimeOut.css";

export default function TimeOut({ onComplete }) {
  const idle = useIdle(10000); // 10s
  const renderer = ({ minutes, seconds }) => {
    return (
      <span>
        {minutes}:
        {seconds > 0 ? (seconds < 10 ? `0${seconds}` : seconds) : "00"}
      </span>
    );
  };

  return (
    <div className={idle ? "timeout timeout-show" : "timeout timeout-hidden"}>
      <ClockAlert />
      <p>
        Votre session va expirer dans{" "}
        {idle ? (
          <Countdown
            date={Date.now() + 180000} // 3min
            renderer={renderer}
            onComplete={onComplete}
          />
        ) : (
          "0:00"
        )}{" "}
        secondes en raison d'inactivité.
      </p>
    </div>
  );
}
