"use client";

import { Smartphone, Sparkles } from "lucide-react";

function DownloadApp() {
    return (
        <section className="py-32 bg-white relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] -z-10" />

            <div className="max-w-7xl mx-auto px-4 text-center">
                <div className="max-w-3xl mx-auto space-y-10">
                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 rounded-[2rem] bg-primary/10 flex items-center justify-center text-primary">
                            <Smartphone size={40} />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-5xl lg:text-7xl font-black text-foreground tracking-tight leading-[1]">
                            Baro <span className="text-primary">meel kasta</span> oo aad joogto.
                        </h2>
                        <p className="text-xl text-muted-foreground font-medium leading-relaxed max-w-2xl mx-auto">
                            App-ka Garaad wuxuu kuu sahlayaa inaad casharada ka faa'ideysato wakhti kasta. Naftaada iyo garaadkaaga hormari adigoo gurigaaga ama safar jooga.
                        </p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-8 pt-8">
                        {/* App Store */}
                        <div className="group relative">
                            <div className="opacity-40 grayscale transition-all group-hover:opacity-100 group-hover:grayscale-0">
                                <img
                                    src="/images/app-store.svg"
                                    alt="App Store"
                                    width={180}
                                    height={54}
                                    className="transition-transform group-hover:scale-105"
                                />
                            </div>
                            <div className="absolute -top-4 -right-4 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] bg-primary text-white rounded-full shadow-lg shadow-primary/20 flex items-center gap-2">
                                <Sparkles size={12} />
                                <span>Dhowaan</span>
                            </div>
                        </div>

                        {/* Google Play */}
                        <div className="group relative">
                            <div className="opacity-40 grayscale transition-all group-hover:opacity-100 group-hover:grayscale-0">
                                <img
                                    src="/images/google-play.svg"
                                    alt="Google Play"
                                    width={180}
                                    height={54}
                                    className="transition-transform group-hover:scale-105"
                                />
                            </div>
                            <div className="absolute -top-4 -right-4 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] bg-primary text-white rounded-full shadow-lg shadow-primary/20 flex items-center gap-2">
                                <Sparkles size={12} />
                                <span>Dhowaan</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default DownloadApp
