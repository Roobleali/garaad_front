"use client";

import { Header } from "@/components/Header";
import Image from "next/image";
import Link from "next/link";
import { Facebook, Linkedin, Twitter } from "lucide-react";

// Save the SVG locally and use it from public directory
const HERO_IMAGE = "/images/earth-and-satellite.svg";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-[#F8F9FB]">
            <Header />

            <main className="max-w-6xl mx-auto px-4 py-16">
                {/* Hero Section */}
                <div className="relative">
                    <div className="flex flex-col lg:flex-row items-center gap-12 mb-20">
                        <div className="lg:w-1/2">
                            <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-gray-900">
                                Garaad: Iftiimin mustaqbalka ardayda Soomaaliyeed
                            </h1>
                            <p className="text-xl text-gray-600 mb-8">
                                Iyadoo la adeegsanayo hal-abuurka
                            </p>
                            <p className="text-gray-600 leading-relaxed mb-8">
                                Ka fikir adduun uu arday kasta oo Soomaali ah, meel kasta oo uu joogo ama xaalad kasta uu ku jiro, uu heli karo waxbarasho tayo leh oo awood u siinaysa inu ku guuleyso qarnigan tignoolajiyada ku saleysan.
                            </p>
                        </div>
                        <div className="lg:w-1/2 relative h-[400px]">
                            <Image
                                src={HERO_IMAGE}
                                alt="Garaad Global Learning"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                    </div>

                    {/* Core Values Section */}
                    <section className="mb-20">
                        <h2 className="text-3xl font-bold mb-12 text-center">Qiimahayaga aasaasiga ah</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[
                                {
                                    title: "Cilmi-baaris",
                                    description: "Waxaan si joogto ah u su'aalnaa, u sahaminnaa, oo aan hal-abuur ku sameynaa si aan u helno hababka ugu wanaagsan."
                                },
                                {
                                    title: "Xawaare",
                                    description: "Waxaan si degdeg ah u dhisnaa, u tijaabinnaa, oo aan u hagaajinnaa, annagoo si joogto ah u horumarineyna."
                                },
                                {
                                    title: "Mas'uuliyad",
                                    description: "Waxaan si qoto dheer ugu xiranahay guusha Garaad iyo mustaqbalka ardaydeena."
                                },
                                {
                                    title: "Tayo",
                                    description: "Waxaan ku dadaalnaa heer sare wax kasta oo aan qabanno."
                                },
                                {
                                    title: "Isgaarsiin",
                                    description: "Waxaan si firfircoon u dhegeysannaa jawaabaha ardaydeena, macallimiinteena, iyo bulshadeena."
                                }
                            ].map((value, index) => (
                                <div key={index} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                    <h3 className="text-xl font-semibold mb-4 text-primary">{value.title}</h3>
                                    <p className="text-gray-600">{value.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* What Makes Us Special Section */}
                    <section className="mb-20">
                        <h2 className="text-3xl font-bold mb-12 text-center">Maxaa Garaad ka dhigaya mid gaar ah?</h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            {[
                                {
                                    title: "Si gaar ah loogu talagalay ardayda Soomaaliyeed",
                                    description: "Waxaan fahamsanahay xaaladda dhaqanka iyo kala duwanaanta luqadda ee dadka aan beegsaneyno."
                                },
                                {
                                    title: "Diiradda saaraya xallinta dhibaatooyinka",
                                    description: "Koorsooyinkayagu waxay xoogga saaraan waxbarashada ku saleysan ficilka iyo fikirka qoto dheer."
                                },
                                {
                                    title: "Isticmaal xog yar",
                                    description: "Waxaan jebineynaa caqabadaha helitaanka anagoo naqshadeynayna barxad isticmaalka xogta yaraysa."
                                },
                                {
                                    title: "Dhismaha bulsho",
                                    description: "Waxaan dhiseynaa nidaam taageero oo ardayda Soomaaliyeed ay ku xiriiri karaan."
                                }
                            ].map((feature, index) => (
                                <div key={index} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                    <h3 className="text-xl font-semibold mb-4 text-primary">{feature.title}</h3>
                                    <p className="text-gray-600">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Vision and Mission */}
                    <section className="mb-20">
                        <div className="grid md:grid-cols-2 gap-12">
                            <div className="bg-white p-8 rounded-xl shadow-sm">
                                <h3 className="text-2xl font-bold mb-4 text-primary">Himilada</h3>
                                <p className="text-gray-600">
                                    Awoodsiinta ardayda Soomaaliyeed waxbarasho la heli karo oo isdhexgal ah oo dhista fikirka qoto dheer iyo xirfadaha STEM si ay ugu guuleystaan adduun tignoolajiyaddu hoggaamiso.
                                </p>
                            </div>
                            <div className="bg-white p-8 rounded-xl shadow-sm">
                                <h3 className="text-2xl font-bold mb-4 text-primary">Aragtida</h3>
                                <p className="text-gray-600">
                                    Kacdoonka nidaamka dhijitaalka ah iyadoo la bixinayo waxbarasho tayo leh oo awood u siinaysa ardayda Soomaaliyeed inay ku kobcaan caalamka.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Contact Section */}
                    <section className="text-center">
                        <h2 className="text-3xl font-bold mb-8">Nala soo xiriir</h2>
                        <div className="flex justify-center gap-6 mb-8">
                            <Link
                                href="https://www.linkedin.com/company/garaad"
                                target="_blank"
                                className="text-gray-600 hover:text-primary transition-colors"
                            >
                                <Linkedin className="w-6 h-6" />
                            </Link>
                            <Link
                                href="https://x.com/Garaadstem"
                                target="_blank"
                                className="text-gray-600 hover:text-primary transition-colors"
                            >
                                <Twitter className="w-6 h-6" />
                            </Link>
                            <Link
                                href="http://facebook.com/Garaadstem"
                                target="_blank"
                                className="text-gray-600 hover:text-primary transition-colors"
                            >
                                <Facebook className="w-6 h-6" />
                            </Link>
                        </div>
                        <p className="text-gray-600">
                            Email: <a href="mailto:Info@garaad.org" className="text-primary hover:underline">Info@garaad.org</a>
                        </p>
                    </section>
                </div>
            </main>
        </div>
    );
} 