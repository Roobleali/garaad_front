/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from "react";
import { DiagramObject, DiagramConfig } from "../types/learning";

const DiagramScale: React.FC<{ config: DiagramConfig }> = ({ config }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const controlRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!config || !config.objects || config.objects.length === 0) return;

    let dg: any;
    let int: any;

    import("diagramatics")
      .then((mod) => {
        dg = mod;
        const mysvg = svgRef.current;
        const controldiv = controlRef.current;
        if (!mysvg || !controldiv) return;

        const draw = (...diagrams: any[]) =>
          dg.draw_to_svg_element(mysvg, dg.diagram_combine(...diagrams));

        int = new dg.Interactive(controldiv, mysvg);
        const V2 = dg.V2;

        const baseAccent = dg
          .rectangle(300, 6)
          .position(V2(0, 0))
          .stroke("#777777")
          .strokewidth(6);

        const displayBg = dg
          .rectangle(50, 35)
          .apply(dg.mod.round_corner(4))
          .fill("#1a1a1a")
          .position(V2(0, -55));

        const displayText = dg
          .textvar(String(config.scale_weight))
          .move_origin_text("center-center")
          .position(V2(0, -55))
          .textfill("white")
          .fontsize(16);
        const pivot = dg
          .rectangle(90, 12)
          .apply(dg.mod.round_corner(5))
          .position(V2(0, -12))
          .fill("#444444")
          .stroke("#333333")
          .strokewidth(1);

        const baseShape = dg
          .rectangle(220, 70)
          .apply(dg.mod.round_corner(8))
          .fill("#555555")
          .stroke("#333333")
          .strokewidth(2)
          .position(V2(0, -50));

        function makeShape(obj: DiagramObject) {
          const size = 40; // Reduced from 50
          let shape: any;
          switch (obj.type) {
            case "cube": {
              const fill = dg
                .square(size)
                .apply(dg.mod.round_corner(8))
                .fill(obj.background_color || obj.color)
                .stroke("none");
              const outline = dg
                .square(size)
                .apply(dg.mod.round_corner(8))
                .stroke("rgba(0,0,0,0.3)")
                .strokewidth(2)
                .fill("none");
              const shadow = dg
                .square(size)
                .apply(dg.mod.round_corner(8))
                .fill("rgba(0,0,0,0.1)")
                .translate(V2(2, 2));
              shape = dg.diagram_combine(shadow, fill, outline);
              break;
            }
            case "circle": {
              shape = dg
                .circle(size / 2)
                .fill(obj.background_color || obj.color)
                .stroke("none");
              break;
            }
            case "triangle": {
              shape = dg
                .regular_polygon(3, size / 1.35)
                .apply(dg.mod.round_corner(5))
                .fill(obj.background_color || obj.color)
                .stroke("#777")
                .strokewidth(1);
              break;
            }

            case "weight": {
              shape = dg
                .regular_polygon(5, size / 2) // Reduced from size/2 + 5
                .fill(obj.background_color || obj.color || "#ccc")
                .stroke("#333")
                .strokewidth(2);
              break;
            }
            case "trapezoid_weight": {
              // Create a trapezoid shape for weights
              const points = [
                V2(-size / 2, -size / 3),  // top left
                V2(size / 2, -size / 3),   // top right
                V2(size / 3, size / 3),    // bottom right
                V2(-size / 3, size / 3),   // bottom left
              ];
              shape = dg
                .polygon(points)
                .fill(obj.background_color || obj.color || "#ccc")
                .stroke("#333")
                .strokewidth(2);
              break;
            }
            default: {
              shape = dg.square(size).fill(obj.background_color || obj.color).stroke("none");
            }
          }
          if (obj.weight_value != null) {
            const txt = dg
              .textvar(String(obj.weight_value))
              .move_origin_text("center-center")
              .textfill(obj.text_color || "black")
              .fontsize(10); // Reduced from 12
            shape = dg.diagram_combine(shape, txt);
          }
          return shape;
        }

        int.draw_function = () => {
          const V2 = dg.V2;
          const spacing = 45; // Base spacing between shapes
          const groupSpacing = 20; // Spacing between different groups of shapes

          // Group objects by their position
          const positionGroups = config.objects.reduce((acc, obj) => {
            const pos = obj.layout.position;
            if (!acc[pos]) acc[pos] = [];
            acc[pos].push(obj);
            return acc;
          }, {} as Record<string, DiagramObject[]>);

          // Calculate the maximum width needed for each position
          const positionWidths = Object.entries(positionGroups).reduce((acc, [pos, objects]) => {
            acc[pos] = objects.reduce((total, obj) => {
              const cols = Math.ceil(obj.number / obj.layout.rows);
              return total + (cols * spacing) + (total > 0 ? groupSpacing : 0);
            }, 0);
            return acc;
          }, {} as Record<string, number>);

          const allShapes = Object.entries(positionGroups).flatMap(([position, objects]) => {
            let currentX = 0;

            return objects.flatMap((obj, objIndex) => {
              const baseShape = makeShape(obj);
              const shapes: any[] = [];

              // Calculate grid dimensions for this object
              const totalShapes = obj.number;
              const actualRows = obj.layout.rows;
              const actualCols = Math.ceil(totalShapes / actualRows);
              const objectWidth = (actualCols - 1) * spacing;

              // Calculate base position
              let baseX = 0;
              let baseY = 35;

              // Calculate position based on layout
              switch (position) {
                case "left":
                  baseX = -120; // Increased offset for better balance
                  break;
                case "right":
                  baseX = 120; // Increased offset for better balance
                  break;
                case "top":
                  baseY = -100;
                  break;
                case "bottom":
                  baseY = 170;
                  break;
                case "center":
                default:
                  baseX = 0;
                  break;
              }

              // Add spacing between different types of weights
              if (objIndex > 0) {
                currentX += groupSpacing;
              }

              // Adjust baseX based on alignment within position group
              const totalWidth = positionWidths[position];
              switch (obj.layout.alignment) {
                case "center":
                  // Center the entire group and then position this object within it
                  baseX = baseX - (totalWidth / 2) + currentX + (objectWidth / 2);
                  break;
                case "right":
                  // Right align the entire group and then position this object within it
                  baseX = baseX - totalWidth + currentX;
                  break;
                case "left":
                default:
                  // Left align starting from the base position
                  baseX = baseX + currentX;
                  break;
              }

              // Create grid of shapes with consistent spacing
              for (let i = 0; i < totalShapes; i++) {
                const row = i % actualRows;
                const col = Math.floor(i / actualRows);

                const x = baseX + (col * spacing);
                const y = baseY + (row * spacing);

                shapes.push(baseShape.translate(V2(x, y)));
              }

              // Update currentX for next object in this position group
              currentX += objectWidth + (objIndex < objects.length - 1 ? spacing : 0);

              return shapes;
            });
          });

          // Draw the scale components in the correct order
          draw(
            baseAccent,
            baseShape,
            pivot,
            ...allShapes,
            displayBg,
            displayText
          );
        };

        int.draw();
        int.dnd_initial_draw();
      })
      .catch(console.error);
  }, [config]);

  return (
    <div className="flex items-center justify-center">
      <div ref={controlRef} className="diagram-controls" />
      <svg
        ref={svgRef}
        width="400"
        height="250"
        className="drop-shadow-xl"
        style={{
          filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))'
        }}
      />
    </div>
  );
};

export default DiagramScale; 