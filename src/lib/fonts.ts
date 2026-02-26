import { Noto_Sans_SC } from "next/font/google";

export const notoSansSC = Noto_Sans_SC({
    subsets: ["latin"],
    weight: ["400", "500", "700", "900"],
    display: "swap",
    variable: "--font-noto-sans-sc"
});