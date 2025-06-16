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
          const size = 50;
          let shape: any;
          switch (obj.type) {
            case "cube": {
              const fill = dg
                .square(size)
                .apply(dg.mod.round_corner(8))
                .fill(obj.color)
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
                .fill(obj.color)
                .stroke("none");
              break;
            }
            case "triangle": {
              shape = dg
                .regular_polygon(3, size / 1.35)
                .apply(dg.mod.round_corner(5))
                .fill(obj.color)
                .stroke("#777")
                .strokewidth(1);
              break;
            }

            case "weight": {
              shape = dg
                .regular_polygon(5, size / 2 + 5)
                .fill(obj.color || "#ccc")
                .stroke("#333")
                .strokewidth(2);
              break;
            }
            default: {
              shape = dg.square(size).fill(obj.color).stroke("none");
            }
          }
          if (obj.weight_value != null) {
            const txt = dg
              .textvar(String(obj.weight_value))
              .move_origin_text("center-center")
              .textfill("black")
              .fontsize(12);
            shape = dg.diagram_combine(shape, txt);
          }
          return shape;
        }

        int.draw_function = () => {
          const V2 = dg.V2;

          const allShapes = config.objects.flatMap((obj) => {
            const baseShape = makeShape(obj);
            const shapes: any[] = [];

            // Calculate grid dimensions
            const totalShapes = obj.number;

            // Reduce spacing between columns and rows
            const spacing = 54;

            // Calculate grid position based on layout
            let baseX = 0;
            let baseY = 35;
            // Determine position override based on number of objects
            let position = obj.layout.position;
            if (Array.isArray(config.objects) && config.objects.length === 1) {
              position = "center";
            } else if (Array.isArray(config.objects) && config.objects.length === 2) {
              position = (config.objects.indexOf(obj) === 0) ? "left" : "right";
            }

            // Calculate grid position based on layout position
            switch (position) {
              case "left":
                baseX = -100;
                break;
              case "right":
                baseX = 100;
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

            // Calculate actual columns and rows used
            const actualCols = Math.ceil(totalShapes / obj.layout.rows);
            const groupWidth = (actualCols - 1) * spacing;
            // const groupHeight = (actualRows - 1) * spacing; // unused

            let groupBaseX = baseX;
            const groupBaseY = baseY;

            // Alignment for the whole group
            if (obj.layout.alignment === "center") {
              groupBaseX = baseX - groupWidth / 2;
            } else if (obj.layout.alignment === "right") {
              groupBaseX = baseX - groupWidth;
            } // left is default (no change)

            // Create grid of shapes
            for (let i = 0; i < totalShapes; i++) {
              const row = i % obj.layout.rows;
              const col = Math.floor(i / obj.layout.rows);

              const x = groupBaseX + (col * spacing);
              const y = groupBaseY + (row * spacing);

              shapes.push(baseShape.translate(V2(x, y)));
            }

            return shapes;
          });

          draw(
            baseAccent,
            ...allShapes,
            baseShape,
            pivot,
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