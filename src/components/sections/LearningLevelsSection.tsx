const courseLevels = [
  {
    level: "Heerka 2",
    title: "Hordhaca Algorithms",
    description: "Baro qaababka xalinta dhibaatooyinka",
    icon: (
      <svg viewBox="0 0 24 24" className="w-full h-full text-primary">
        <path
          d="M13 3H6v18h4v-6h3c3.31 0 6-2.69 6-6s-2.69-6-6-6zm.2 8H10V7h3.2c1.1 0 2 .9 2 2s-.9 2-2 2z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    level: "Heerka 3",
    title: "Game Development",
    description: "Samee ciyaaraha computer-ka",
    icon: (
      <svg viewBox="0 0 24 24" className="w-full h-full text-primary">
        <path
          d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4-3c-.83 0-1.5-.67-1.5-1.5S18.67 9 19.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    level: "Heerka 4",
    title: "Data Structures",
    description: "Baro qaababka xogta loo habeeyey",
    icon: (
      <svg viewBox="0 0 24 24" className="w-full h-full text-primary">
        <path
          d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15l-5-2.18L7 18V5h10v13z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    level: "Heerka 5",
    title: "Machine Learning",
    description: "Baro barashada mashiinka",
    icon: (
      <svg viewBox="0 0 24 24" className="w-full h-full text-primary">
        <path
          d="M21 11.18V9.72c0-.47-.16-.92-.46-1.28L16.6 3.72c-.38-.46-.94-.72-1.54-.72H8.94c-.6 0-1.16.26-1.54.72L3.46 8.44C3.16 8.8 3 9.25 3 9.72v4.56c0 .47.16.92.46 1.28l3.94 4.72c.38.46.94.72 1.54.72h6.12c.6 0 1.16-.26 1.54-.72l3.94-4.72c.3-.36.46-.81.46-1.28V11.18z"
          fill="currentColor"
        />
      </svg>
    ),
  },
];

export function LearningLevelsSection() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Text Content */}
          <div className="space-y-8">
            <h2 className="text-4xl lg:text-6xl font-black text-foreground leading-[1.1]">
              Baro heer kasta oo aad joogto
            </h2>
            <p className="text-xl text-muted-foreground font-medium leading-relaxed max-w-xl">
              Laga bilaabo aasaaska ilaa heerarka sare. Loogu talagalay ardayda jecel ogaanshaha iyo aqoonta.
            </p>
            <div className="h-1.5 w-24 bg-primary rounded-full" />
          </div>

          {/* Course Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {courseLevels.map((course, index) => (
              <div
                key={index}
                className="group relative bg-gray-50/50 p-8 rounded-[2rem] hover:bg-white hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 border border-transparent hover:border-primary/10"
              >
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <div className="w-12 h-12 text-primary group-hover:scale-110 transition-transform">
                      {course.icon}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary/40 bg-primary/5 px-2 py-1 rounded-md">
                      {course.level}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground leading-tight">{course.title}</h3>
                    <p className="text-sm text-muted-foreground font-medium mt-2 leading-relaxed">{course.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
