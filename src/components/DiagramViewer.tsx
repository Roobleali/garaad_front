import React from "react";
import DiagramScale from "./DiagramScale";
import { ProblemContent } from "@/types/learning";

interface DiagramRendererProps {
  problems: ProblemContent[];
}

const DiagramRenderer: React.FC<DiagramRendererProps> = ({ problems }) => (
  <div className="space-y-8">
    {problems.map((problem) => (
      <div key={problem.id} className="p-4 border rounded-lg">
        <p className="mb-4 font-medium">{problem.question}</p>
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 justify-center items-center">
          {problem.diagrams ? (
            // Handle new diagrams array format
            problem.diagrams.map((cfg) => (
              <div key={cfg.diagram_id} className="flex-shrink-0">
                <DiagramScale config={cfg} />
              </div>
            ))
          ) : Array.isArray(problem.diagram_config) ? (
            // Handle existing diagram_config array format
            problem.diagram_config.map((cfg) => (
              <div key={cfg.diagram_id} className="flex-shrink-0">
                <DiagramScale config={cfg} />
              </div>
            ))
          ) : problem.diagram_config ? (
            // Handle existing single diagram_config format
            <div className="flex-shrink-0">
              <DiagramScale config={problem.diagram_config} />
            </div>
          ) : null}
        </div>
      </div>
    ))}
  </div>
);

export default DiagramRenderer;
