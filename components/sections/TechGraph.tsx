"use client";

import { useEffect, useRef, useState } from "react";
import * as d3Force from "d3-force";
import * as d3Drag from "d3-drag";
import * as d3Selection from "d3-selection";
import * as d3Array from "d3-array";
import * as d3Transition from "d3-transition";
import { Skill } from "@/lib/sanity";

// Combine into d3 for easy migration
const d3 = { ...d3Force, ...d3Drag, ...d3Selection, ...d3Array, ...d3Transition };

// We'll augment the Skill type for the graph nodes
interface SkillNode extends d3Force.SimulationNodeDatum {
  id: string;
  label: string;
  category: string;
  level: number; // 1, 2, or 3
  x?: number;
  y?: number;
}

interface SkillLink extends d3Force.SimulationLinkDatum<SkillNode> {
  source: string | SkillNode;
  target: string | SkillNode;
}

const CATEGORY_COLORS: Record<string, string> = {
  "Frontend": "#06b6d4", // cyan
  "Backend": "#a855f7",  // violet
  "Database": "#f59e0b", // amber
  "DevOps": "#22c55e",   // green
  "AI/ML": "#f97316",    // orange
};

// Fallback color
const DEFAULT_COLOR = "#71717a";

export function TechGraph({ skills }: { skills: Skill[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 480 });
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current || !svgRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = 480;
    setDimensions({ width, height });

    // 1. Prepare data
    // Sanity skills might not have `level` or `relatedTo` if we didn't update schema yet.
    // We'll simulate them or use fallback.
    const nodes: SkillNode[] = skills.map(s => ({
      level: 2, // fallback
      ...s, // in case schema has it
      id: s._id,
      label: s.title,
      category: s.category,
    }));

    // Create some fake links for clustering if `relatedTo` doesn't exist
    const links: SkillLink[] = [];

    // Group by category to create intra-category links
    const catGroups = d3.group(nodes, d => d.category);
    catGroups.forEach(group => {
      for (let i = 0; i < group.length - 1; i++) {
        links.push({
          source: group[i].id,
          target: group[i + 1].id
        });
      }
    });

    // 2. Setup D3 Force Simulation
    const simulation = d3.forceSimulation(nodes)
      .force("charge", d3.forceManyBody().strength(-120))
      .force("link", d3.forceLink(links).id((d: unknown) => (d as SkillNode).id).distance(80))
      // Custom cluster force pulling same category to a point
      .force("x", d3.forceX(width / 2).strength(0.05))
      .force("y", d3.forceY(height / 2).strength(0.05))
      .force("collision", d3.forceCollide((d: unknown) => ((d as SkillNode).level * 6 + 12) + 4));

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // clear previous

    // Add links
    const link = svg.append("g")
      .attr("stroke", "rgba(255,255,255,0.08)")
      .attr("stroke-width", 1.5)
      .selectAll("line")
      .data(links)
      .join("line");

    // Add nodes group
    const nodeGroup = svg.append("g")
      .selectAll<SVGGElement, SkillNode>("g")
      .data(nodes)
      .join("g")
      .call(d3.drag<SVGGElement, SkillNode>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    // Add circles
    nodeGroup.append("circle")
      .attr("r", d => d.level * 6 + 6) // e.g. 12, 18, 24
      .attr("fill", d => CATEGORY_COLORS[d.category] || DEFAULT_COLOR)
      .attr("class", "cursor-none transition-transform duration-200")
      .on("mouseenter", (e, d) => {
        setHoveredNode(d.id);
        d3.select(e.currentTarget).attr("transform", "scale(1.3)");
      })
      .on("mouseleave", (e) => {
        setHoveredNode(null);
        d3.select(e.currentTarget).attr("transform", "scale(1)");
      })
      .on("click", (e, d) => {
        // Ripple effect
        const circle = d3.select(e.currentTarget);
        const r = parseFloat(circle.attr("r"));
        svg.append("circle")
          .attr("cx", d.x!)
          .attr("cy", d.y!)
          .attr("r", r)
          .attr("fill", "none")
          .attr("stroke", CATEGORY_COLORS[d.category] || DEFAULT_COLOR)
          .attr("stroke-width", 2)
          .transition()
          .duration(600)
          .attr("r", r * 3)
          .attr("stroke-opacity", 0)
          .remove();
      });

    // Add labels
    nodeGroup.append("text")
      .text(d => d.label)
      .attr("x", d => d.level * 6 + 12)
      .attr("y", 4)
      .attr("fill", "#fafafa")
      .attr("font-family", "var(--font-mono)")
      .attr("font-size", "11px")
      .attr("pointer-events", "none");

    simulation.on("tick", () => {
      link
        .attr("x1", (d: unknown) => ((d as SkillLink).source as SkillNode).x || 0)
        .attr("y1", (d: unknown) => ((d as SkillLink).source as SkillNode).y || 0)
        .attr("x2", (d: unknown) => ((d as SkillLink).target as SkillNode).x || 0)
        .attr("y2", (d: unknown) => ((d as SkillLink).target as SkillNode).y || 0);

      nodeGroup
        .attr("transform", d => `translate(${d.x},${d.y})`);
    });

    // Drag functions
    function dragstarted(event: d3Drag.D3DragEvent<SVGGElement, SkillNode, SkillNode>) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: d3Drag.D3DragEvent<SVGGElement, SkillNode, SkillNode>) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: d3Drag.D3DragEvent<SVGGElement, SkillNode, SkillNode>) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [skills]);

  // Extract unique categories for legend
  const categories = Array.from(new Set(skills.map(s => s.category)));

  return (
    <section id="arsenal" className="w-full bg-transparent text-white py-24 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <h2 className="text-3xl md:text-4xl font-bold">Technical Arsenal</h2>
        <p className="text-zinc-400 mt-2">The tools I think in.</p>
      </div>

      <div ref={containerRef} className="w-full relative cursor-none h-[480px]">
        <svg ref={svgRef} width="100%" height="480px" />
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-8 flex flex-wrap gap-6 justify-center md:justify-start">
        {categories.map(cat => (
          <div key={cat} className="flex items-center gap-2 font-mono text-xs text-zinc-400">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: CATEGORY_COLORS[cat] || DEFAULT_COLOR }}
            />
            {cat}
          </div>
        ))}
      </div>
    </section>
  );
}
