"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "../../style/paiement.css";
import "../../style/HomePage.css";
import Button from "../../components/commons/Button";
import Input from "../../components/commons/Input";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function Confirmation() {
  
  return (
    <div className="paiement-container">
      <div className="title">
        <h1>Confirmation de votre réservation ( ref : 123456789 )</h1>
      </div>
    </div>

    );
}