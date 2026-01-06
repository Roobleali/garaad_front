import { Target, Rocket, Code, Clock, BookOpen, Briefcase, GraduationCap, Laptop, Palette, BarChart, Database, BrainCircuit, Coins, Users, Calculator, Dumbbell } from "lucide-react";
import React from "react";

export const stepTitles = [
    "Waa maxey hadafkaaga?",
    "Waxa aad rabto inaad barato?",
    "Heerkaaga?",
    "Immisa daqiiqo ayad rabtaa inad wax-barato maalin walba?",
    "Fadlan geli Xogtaaga:",
];

export const goals = [
    { id: "build_project", text: "Dhis Project (Web, App, AI)", badge: "Ka bax dhibka lacag la'aanta - dhis projectkaaga oo noqo ganacsade guuleysta oo xor ah!", icon: React.createElement(Rocket, { className: "w-5 h-5" }) },
    { id: "learn_programming", text: "Baro Programming", badge: "Ka daa shaqo la'aanta - baro xirfado cusub oo hel shaqooyin lacag wanaagsan leh oo caalami ah!", icon: React.createElement(Code, { className: "w-5 h-5" }) },
    { id: "improve_stem", text: "Kobci STEM (Xisaab, Saynis)", badge: "Ka bax dhibka aqoon la'aanta - kobci maskaxdaada oo dhis mustaqbal ifaya oo guul leh!", icon: React.createElement(Target, { className: "w-5 h-5" }) },
    { id: "financial_freedom", text: "Baro Lacagta & Maalgashiga", badge: "Ka daa walwalka lacagta - noqo mid madaxbannaan oo kasbo xoriyad maaliyadeed oo dhab ah!", icon: React.createElement(Coins, { className: "w-5 h-5" }) },
    { id: "fitness", text: "Jirdhis & Fitness", badge: "Ka bax caajisnimada iyo daciifnimada - noqo mid firfircoon oo caafimaad qaba oo faraxsan!", icon: React.createElement(Dumbbell, { className: "w-5 h-5" }) },
];

export const topics = [
    { id: "saas_challenge", text: "SaaS & Startup Challenge", badge: "Ka bax dhibka ganacsi la'aanta - dhis ganacsigaaga 5 usbuuc gudahood oo noqo guuleyste lacag kasbaya!", icon: React.createElement(Rocket, { className: "w-5 h-5" }) },
    { id: "web_development", text: "Next.js & Software Development", badge: "Ka daa xirfad la'aanta - noqo horumariye web oo xirfadle ah oo hel shaqooyin caalami oo farxad leh!", icon: React.createElement(Laptop, { className: "w-5 h-5" }) },
    { id: "ai_python", text: "Artificial Intelligence & Python", badge: "Ka bax welwelka mustaqbalka - baro tignoolajiyada cusub oo kasbo lacag badan oo xor ah!", icon: React.createElement(BrainCircuit, { className: "w-5 h-5" }) },
    { id: "ui_ux_design", text: "UI/UX & Product Design", badge: "Ka daa naqshad la'aanta - abuur alaabo qurux badan oo suuqa ku guuleysta oo farxad ku siiya!", icon: React.createElement(Palette, { className: "w-5 h-5" }) },
    { id: "math_engineering", text: "Mathematics & Engineering", badge: "Ka bax dhibka xisaab la'aanta - dhis aasaas adag oo STEM ah oo kuu furaya guul sare!", icon: React.createElement(Target, { className: "w-5 h-5" }) },
    { id: "community_building", text: "Community Building & Social Media", badge: "Ka daa kelinimada - dhis bulsho xoog leh oo kasbo lacag iyo farxad dhab ah!", icon: React.createElement(Users, { className: "w-5 h-5" }) },
    { id: "financial_math", text: "Financial Math & Investing", badge: "Ka bax walwalka maaliyadeed - baro sida lacagta loo maamulo oo noqo maalgeliye guuleyste!", icon: React.createElement(Calculator, { className: "w-5 h-5" }) },
    { id: "crypto_blockchain", text: "Crypto & Blockchain", badge: "Ka daa fursad la'aanta - fur siraha lacagta dhijitaalka oo kasbo xoriyad cusub oo guul leh!", icon: React.createElement(Coins, { className: "w-5 h-5" }) },
    { id: "fitness_training", text: "Jirdhis & Fitness Training", badge: "Ka bax daciifnimada - baro jimicsiyo cusub oo noqo mid firfircoon oo caafimaad qaba oo faraxsan!", icon: React.createElement(Dumbbell, { className: "w-5 h-5" }) },
];

export const topicsByGoal: Record<string, string[]> = {
    build_project: ["saas_challenge", "web_development", "ai_python", "ui_ux_design", "community_building", "crypto_blockchain"],
    learn_programming: ["web_development", "ai_python", "saas_challenge", "crypto_blockchain"],
    improve_stem: ["math_engineering", "ai_python", "financial_math"],
    financial_freedom: ["financial_math", "crypto_blockchain", "saas_challenge", "community_building"],
    fitness: ["fitness_training"],
};

export const topicLevelsByTopic = {
    "saas_challenge": [
        { title: "Bilow Cusub (Genesis)", description: "Ka bax eberka - bilaabo dhisidda MVP-kaaga oo kasbo lacagtaada ugu horreysa oo guul leh!", example: "Beddel fikraddaada ganacsi kasbaya oo xor ah.", level: "beginner", icon: React.createElement(Rocket, { className: "w-5 h-5" }) },
        { title: "Dhisidda (Builder)", description: "Ka daa aasaaska - kobci ganacsigaaga oo hel users lacag leh oo farxad ku siiya!", example: "Samee lacag-ururin iyo maamulka users si guul leh.", level: "intermediate", icon: React.createElement(Rocket, { className: "w-5 h-5" }) },
        { title: "Ballaarinta (Scaling)", description: "Ka bax xadka - gaarsii ganacsigaaga caalamka oo kasbo xoriyad badan!", example: "Automation suuqgeyn iyo horumarin database si guul dheeraad ah.", level: "advanced", icon: React.createElement(Rocket, { className: "w-5 h-5" }) },
    ],
    web_development: [
        { title: "Barashada Aasaaska", description: "Ka bax bilow la'aanta - baro aasaaska si aad u bilaabato xirfad guuleysta!", example: "Dhis bog qurxoon oo suuqa ku guuleysta.", level: "beginner", icon: React.createElement(Code, { className: "w-5 h-5" }) },
        { title: "Next.js Mastery", description: "Ka daa heerka dhexe - dhis apps casri ah oo hel shaqo farxad leh!", example: "Dhis app leh xiriir iyo APIs kasbaya.", level: "intermediate", icon: React.createElement(Laptop, { className: "w-5 h-5" }) },
        { title: "Full-Stack Engineer", description: "Ka bax xadka - noqo injineer dhamaystiran oo guuleysta caalamka!", example: "Dhis dashboard data leh oo xor ah.", level: "advanced", icon: React.createElement(Database, { className: "w-5 h-5" }) },
    ],
    ai_python: [
        { title: "Python Fundamentals", description: "Ka bax aqoon la'aanta - bilaabo xirfad lacag leh oo mustaqbal leh!", example: "Qor scripts automate ah oo kasbaya farxad.", level: "beginner", icon: React.createElement(Code, { className: "w-5 h-5" }) },
        { title: "Data Analysis", description: "Ka daa xog la'aanta - hel fursado cusub oo guul leh!", example: "Isticmaal tools xirfad leh si farxad.", level: "intermediate", icon: React.createElement(BarChart, { className: "w-5 h-5" }) },
        { title: "AI and Machine Learning", description: "Ka bax welwelka - dhis apps smart oo kasbo lacag badan!", example: "Isticmaal API si abuur ganacsi guuleysta.", level: "advanced", icon: React.createElement(BrainCircuit, { className: "w-5 h-5" }) },
    ],
    ui_ux_design: [
        { title: "Aasaaska Visual Design", description: "Ka bax abuur la'aanta - bilaabo xirfad hal abuur leh oo farxad!", example: "Naqshad logo fudud oo guuleysta.", level: "beginner", icon: React.createElement(Palette, { className: "w-5 h-5" }) },
        { title: "UX Research & Wiring", description: "Ka daa faham la'aanta - hel users badan oo kasbaya!", example: "Dhis prototype tijaabo leh oo farxad.", level: "intermediate", icon: React.createElement(BookOpen, { className: "w-5 h-5" }) },
        { title: "Product Design", description: "Ka bax xadka - dhis system suuq leh oo guul badan!", example: "Naqshad app dhan oo lacag leh.", level: "advanced", icon: React.createElement(Palette, { className: "w-5 h-5" }) },
    ],
    math_engineering: [
        { title: "Foundation Math", description: "Ka bax dhibka aasaas la'aanta - dhis xirfad adag oo guuleysta!", example: "Xisaab muhiim ah oo farxad leh.", level: "beginner", icon: React.createElement(Target, { className: "w-5 h-5" }) },
        { title: "Engineering Physics", description: "Ka daa faham la'aanta - hel shaqooyin sare oo xor ah!", example: "Xal mashaakil injineernimo leh guul.", level: "intermediate", icon: React.createElement(Target, { className: "w-5 h-5" }) },
        { title: "Calculus & Beyond", description: "Ka bax welwelka - isticmaal xisaab sare oo kasbo lacag badan!", example: "Falanqayn adag oo xirfad leh.", level: "advanced", icon: React.createElement(Target, { className: "w-5 h-5" }) },
    ],
    community_building: [
        { title: "Aasaaska Bulshada", description: "Ka bax kelinimada - bilaabo bulsho fudud oo farxad leh!", example: "Isticmaal social si bilaab group.", level: "beginner", icon: React.createElement(Users, { className: "w-5 h-5" }) },
        { title: "Kobcinta Bulshada", description: "Ka daa yaraynta - kordhi users oo kasbo lacag guuleysta!", example: "Abuur content oo engagement leh.", level: "intermediate", icon: React.createElement(Users, { className: "w-5 h-5" }) },
        { title: "Monetization Bulshada", description: "Ka bax lacag la'aanta - beddel bulshada ganacsi xor ah!", example: "Marketing iyo content premium leh.", level: "advanced", icon: React.createElement(Users, { className: "w-5 h-5" }) },
    ],
    financial_math: [
        { title: "Aasaaska Maaliyadda", description: "Ka bax walwalka - baro xisaab lacag leh oo bilaab guul!", example: "Miisaaniyad iyo faa'iido fudud.", level: "beginner", icon: React.createElement(Calculator, { className: "w-5 h-5" }) },
        { title: "Maalgashiga Dhexe", description: "Ka daa khatarta - falanqee maalgashiga oo dhis xoriyad!", example: "Falanqayn saamiyada iyo dhis portfolio.", level: "intermediate", icon: React.createElement(Calculator, { className: "w-5 h-5" }) },
        { title: "Maaliyad Sare", description: "Ka bax xadka - isticmaal algorithms trading guuleysta!", example: "Finance quantitative oo algorithmic leh.", level: "advanced", icon: React.createElement(Calculator, { className: "w-5 h-5" }) },
    ],
    crypto_blockchain: [
        { title: "Aasaaska Crypto", description: "Ka bax aqoon la'aanta - faham blockchain oo bilaab kasbasho!", example: "Iibso oo iibiyo Bitcoin si fudud.", level: "beginner", icon: React.createElement(Coins, { className: "w-5 h-5" }) },
        { title: "Dhisidda DApps", description: "Ka daa yaraynta - dhis apps decentralized oo guuleysta!", example: "Contracts smart iyo wallet xiriir.", level: "intermediate", icon: React.createElement(Coins, { className: "w-5 h-5" }) },
        { title: "Crypto Trading Sare", description: "Ka bax welwelka - strategies sare oo DeFi oo xor ah!", example: "Farming yield iyo NFT horumarin.", level: "advanced", icon: React.createElement(Coins, { className: "w-5 h-5" }) },
    ],
    fitness_training: [
        { title: "Bilow Cusub", description: "Ka bax caajisnimada - bilaabo jimicsi fudud oo caafimaad leh oo farxad!", example: "Jimicsiyo yar iyo talo cunno wanaagsan.", level: "beginner", icon: React.createElement(Dumbbell, { className: "w-5 h-5" }) },
        { title: "Dhexe", description: "Ka daa daciifnimada - kobci xoogga oo noqo firfircoon guuleysta!", example: "Tababarro dhexe iyo qorshe cunno.", level: "intermediate", icon: React.createElement(Dumbbell, { className: "w-5 h-5" }) },
        { title: "Sare", description: "Ka bax xadka - tababarro adag oo caafimaad xor ah oo farxad badan!", example: "Workouts xoog leh iyo horumarin cunno.", level: "advanced", icon: React.createElement(Dumbbell, { className: "w-5 h-5" }) },
    ],
};

export const learningGoals = [
    { id: "10_min", text: "10 daqiiqo maalin walba", badge: "Ka bax waqti la'aanta - bilaab talaabo yar oo guul weyn kuu keenta si fudud!", icon: React.createElement(Clock, { className: "w-5 h-5" }) },
    { id: "20_min", text: "20 daqiiqo maalin walba", badge: "Ka daa caajisnimada - isticmaal waqtigaaga si fiican oo samee horumar dhab ah!", icon: React.createElement(Clock, { className: "w-5 h-5" }) },
    { id: "30_min", text: "30 daqiiqo maalin walba", badge: "Ka bax adkaysi la'aanta - dadaal oo kasbo xirfado cusub oo farxad leh!", icon: React.createElement(Clock, { className: "w-5 h-5" }) },
    { id: "60_min", text: "1 saac maalin walba", badge: "Ka daa welwelka - waxbar si joogto ah oo noqo xirfadle guuleyste oo xor ah!", icon: React.createElement(Clock, { className: "w-5 h-5" }) },
];