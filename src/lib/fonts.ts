import { Noto_Sans_SC, Manrope, Instrument_Serif, DM_Mono } from "next/font/google";

export const notoSansSC = Noto_Sans_SC({
    subsets: ["latin"],
    weight: ["400", "500", "700", "900"],
    display: "swap",
    variable: "--font-noto-sans-sc"
});

export const manrope = Manrope({
    subsets: ["latin"],
    weight: ["400", "500", "700"],
    display: "swap",
    variable: "--font-manrope"
});

export const instrumentSerif = Instrument_Serif({
    subsets: ["latin"],
    weight: ["400"],
    style: ["normal", "italic"],
    display: "swap",
    variable: "--font-instrument-serif"
});

export const dmMono = DM_Mono({
    subsets: ["latin"],
    weight: ["400", "500"],
    display: "swap",
    variable: "--font-dm-mono"
});