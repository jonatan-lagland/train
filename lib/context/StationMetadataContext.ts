'use client'
import { createContext } from "react";
import { StationMetaData } from "../types";

export const StationMetadataContext = createContext<StationMetaData[] | []>([]);