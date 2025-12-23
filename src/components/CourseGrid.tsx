const courses = [
  {
    title: "Xisaab",
    description: "Xisaab iyo Xeerar",
    icon: "M4 4v16h16v-2H6V4H4zm6 8l6-6v12l-6-6z", // Graph icon
  },
  {
    title: "Falanqeyn Xogeed",
    description: "Falanqaynta Xogta",
    icon: "M4 19h16v2H4zm3-4h10v2H7zm0-4h10v2H7zm0-4h10v2H7z", // Chart icon
  },
  {
    title: "Cilmiga Kombiyuutarka",
    description: "Sayniska Kombuyutarka",
    icon: "M20 18c1.1 0 1.99-.9 1.99-2L22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z",
  },
  {
    title: "Qorista Barnaamijyada & Sirdoonka Macmalka ah",
    description: "Barnaamij Sameynta & AI",
    icon: "M20.5 11H19V7c0-1.1-.9-2-2-2h-4V3.5C13 2.12 11.88 1 10.5 1S8 2.12 8 3.5V5H4c-1.1 0-1.99.9-1.99 2v3.8H3.5c1.49 0 2.7 1.21 2.7 2.7s-1.21 2.7-2.7 2.7H2V20c0 1.1.9 2 2 2h3.8v-1.5c0-1.49 1.21-2.7 2.7-2.7 1.49 0 2.7 1.21 2.7 2.7V22H17c1.1 0 2-.9 2-2v-4h1.5c1.38 0 2.5-1.12 2.5-2.5S21.88 11 20.5 11z",
  },
  {
    title: "Cilmiga Sayniska & Injineeriyadda",
    description: "Sayniska & Injineernimada",
    icon: "M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z",
  },
];

export function CourseGrid() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-black text-foreground">
            Casharadeena
          </h2>
          <div className="h-1.5 w-20 bg-primary mt-4 rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <div
              key={index}
              className="group p-8 bg-gray-50/50 rounded-3xl border border-transparent hover:border-primary/10 hover:bg-white hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300"
            >
              <div className="space-y-6">
                <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                  <svg viewBox="0 0 24 24" className="w-7 h-7 text-primary">
                    <path
                      d={course.icon}
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-foreground leading-tight">
                    {course.title}
                  </h3>
                  <p className="text-sm text-muted-foreground font-medium">
                    {course.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
