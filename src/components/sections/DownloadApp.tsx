function DownloadApp() {
    return (
        <section className="py-24 bg-gray-50/30">
            <div className="max-w-7xl mx-auto px-4 text-center">
                <div className="max-w-2xl mx-auto space-y-8">
                    <h2 className="text-3xl sm:text-5xl font-black text-foreground">
                        Baro meel kasta
                    </h2>
                    <p className="text-xl text-muted-foreground font-medium leading-relaxed">
                        App-ka Garaad wuxuu kuu sahlayaa inaad casharada ka faa'ideysato wakhti kasta. Naftaada hormari adigoo gurigaaga jooga.
                    </p>

                    <div className="flex flex-wrap justify-center gap-6 pt-4">
                        <div className="group relative opacity-40 grayscale transition-all">
                            <img
                                src="/images/app-store.svg"
                                alt="App Store"
                                width={160}
                                height={48}
                            />
                            <div className="absolute -top-3 -right-3 px-2 py-0.5 text-[8px] font-black uppercase tracking-tighter bg-primary/10 text-primary rounded border border-primary/20">
                                Dhowaan
                            </div>
                        </div>
                        <div className="group relative opacity-40 grayscale transition-all">
                            <img
                                src="/images/google-play.svg"
                                alt="Google Play"
                                width={160}
                                height={48}
                            />
                            <div className="absolute -top-3 -right-3 px-2 py-0.5 text-[8px] font-black uppercase tracking-tighter bg-primary/10 text-primary rounded border border-primary/20">
                                Dhowaan
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default DownloadApp
