"use client";
import React, { useEffect, useState, useRef } from "react";
import { useIdle } from "@uidotdev/usehooks";
import { ClockAlert } from "lucide-react";
import Countdown from "react-countdown";

import "../style/components/TimeOut.css";

export default function TimeOut({ onComplete }) {
  const idle = useIdle(10000); // 10s
  const isFirstRender = useRef(true);

  useEffect(() => {
    isFirstRender.current = false;
  }, []);

  const renderer = ({ minutes, seconds }) => {
    return (
      <span>
        {minutes}:
        {seconds > 0 ? (seconds < 10 ? `0${seconds}` : seconds) : "00"}
      </span>
    );
  };

  const getClassName = () => {
    const base = "timeout";
    const state = idle ? "timeout-show" : "timeout-hidden";
    const noAnim = isFirstRender.current ? "no-transition" : "";
    return `${base} ${state} ${noAnim}`.trim();
  };

  return (
    <div className={getClassName()}>
      <ClockAlert />
      <p>
        Votre session va expirer dans{" "}
        {idle ? (
          <Countdown
            date={Date.now() + 10000} // 3min
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
