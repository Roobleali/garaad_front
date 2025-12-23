import { Calculator, BarChart3, Binary, Brain, Wrench, ChevronRight } from "lucide-react";

const courses = [
  {
    title: "Xisaab",
    description: "Xisaabta aasaasiga ah, Algebra, iyo Geometry oo lagu baranayo qaab casri ah.",
    icon: Calculator,
    color: "from-primary/10 to-primary/20",
    iconColor: "text-primary",
  },
  {
    title: "Falanqeyn Xogeed",
    description: "Baro falanqaynta xogta (Data Analysis) iyo sida looga soo saaro macluumaad muhiim ah.",
    icon: BarChart3,
    color: "from-secondary/10 to-secondary/20",
    iconColor: "text-secondary",
  },
  {
    title: "Cilmiga Kombiyuutarka",
    description: "Sayniska Kombuyutarka, Algorithm-yada, iyo aasaaska software-ka.",
    icon: Binary,
    color: "from-primary/10 to-primary/20",
    iconColor: "text-primary",
  },
  {
    title: "Sirdoonka Macmalka ah",
    description: "Barnaamij Sameynta & AI - Mustaqbalka tiknoolajiyadda oo Af-Soomaali ah.",
    icon: Brain,
    color: "from-secondary/10 to-secondary/20",
    iconColor: "text-secondary",
  },
  {
    title: "Injineeriyadda",
    description: "Sayniska & Injineernimada, Fiisikiska, iyo qaababka wax loo dhiso.",
    icon: Wrench,
    color: "from-primary/10 to-primary/20",
    iconColor: "text-primary",
  },
];

export function CourseGrid() {
  return (
    <section className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-20 space-y-4 text-center lg:text-left">
          <div>
            <h2 className="text-5xl sm:text-6xl font-black text-foreground tracking-tight">
              Koorsooyinkayaga <span className="text-primary">Sare</span>
            </h2>
            <div className="h-2 w-32 bg-primary mt-6 rounded-full mx-auto lg:mx-0" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {courses.map((course, index) => (
            <div
              key={index}
              className="group relative p-10 bg-gray-50/50 rounded-[3.5rem] border border-transparent hover:border-primary/20 hover:bg-white hover:shadow-xl transition-all duration-300"
            >
              <div className="space-y-8">
                <div className={`w-16 h-16 rounded-[1.75rem] bg-gradient-to-br ${course.color} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                  <course.icon size={32} className={course.iconColor} />
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-black text-foreground leading-tight group-hover:text-primary transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-base text-muted-foreground font-medium leading-relaxed">
                    {course.description}
                  </p>
                </div>

                <div className="pt-4 flex items-center text-primary font-black text-xs uppercase tracking-widest transition-all duration-300">
                  <span className="mr-1">Eeg Koorsooyinka</span>
                  <ChevronRight size={18} className="translate-x-0 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
