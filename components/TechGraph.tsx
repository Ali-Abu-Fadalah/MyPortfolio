'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3-force';
import { motion, AnimatePresence } from 'framer-motion';
import { Skill } from '@/lib/sanity';

interface TechGraphProps {
  skills: Skill[];
}

interface NodeData extends d3.SimulationNodeDatum {
  id: string;
  title: string;
  category: string;
  level: number;
  radius: number;
  color: string;
}

interface LinkData extends d3.SimulationLinkDatum<NodeData> {
  source: string | NodeData;
  target: string | NodeData;
  id: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  'Frontend': '#06b6d4', // Cyan
  'Backend': '#3b82f6',  // Blue
  'Database': '#10b981', // Emerald
  'DevOps & Tools': '#a855f7', // Purple
  'AI & Machine Learning': '#ec4899', // Pink
};

export function TechGraph({ skills }: TechGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  const nodes = useMemo(() => {
    return skills.map((s) => ({
      id: s._id,
      title: s.title,
      category: s.category,
      level: s.level || 5,
      radius: (s.level || 5) * 5 + 15,
      color: CATEGORY_COLORS[s.category] || '#6b7280',
    })) as NodeData[];
  }, [skills]);

  // Create links between nodes in the same category
  const links = useMemo(() => {
    const newLinks: LinkData[] = [];
    const categories = Object.keys(CATEGORY_COLORS);
    
    categories.forEach(cat => {
      const catNodes = nodes.filter(n => n.category === cat);
      // Connect each node to the next one to form a ring or chain
      for (let i = 0; i < catNodes.length; i++) {
        for (let j = i + 1; j < catNodes.length; j++) {
          // Only connect some nodes to avoid a complete graph mess, e.g. path-like
          if (Math.random() > 0.5 || catNodes.length <= 3) {
            newLinks.push({
              source: catNodes[i].id,
              target: catNodes[j].id,
              id: `${catNodes[i].id}-${catNodes[j].id}`
            });
          }
        }
      }
    });
    return newLinks;
  }, [nodes]);
  
  const nodeRefs = useRef<Map<string, SVGGElement>>(new Map());
  const linkRefs = useRef<Map<string, SVGLineElement>>(new Map());

  useEffect(() => {
    if (!containerRef.current) return;
    
    const updateDimensions = () => {
      setDimensions({
        width: containerRef.current?.clientWidth || 800,
        height: containerRef.current?.clientHeight || 600,
      });
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    const { width, height } = dimensions;
    
    const categories = Object.keys(CATEGORY_COLORS);
    const getTargetPos = (category: string) => {
      const index = categories.indexOf(category);
      const angle = (index / categories.length) * Math.PI * 2;
      const r = Math.min(width, height) * 0.25;
      return {
        x: width / 2 + Math.cos(angle) * r,
        y: height / 2 + Math.sin(angle) * r,
      };
    };

    const simulation = d3.forceSimulation<NodeData>(nodes)
      .force('link', d3.forceLink<NodeData, LinkData>(links).id(d => d.id).distance(80).strength(0.2))
      .force('charge', d3.forceManyBody().strength(-200))
      .force('collide', d3.forceCollide<NodeData>().radius(d => d.radius + 8).iterations(3))
      .force('x', d3.forceX<NodeData>(d => getTargetPos(d.category).x).strength(0.15))
      .force('y', d3.forceY<NodeData>(d => getTargetPos(d.category).y).strength(0.15))
      .force('center', d3.forceCenter(width / 2, height / 2).strength(0.05));

    simulation.on('tick', () => {
      // Update links
      links.forEach(link => {
        const el = linkRefs.current.get(link.id);
        const source = link.source as NodeData;
        const target = link.target as NodeData;
        if (el && source.x !== undefined && source.y !== undefined && target.x !== undefined && target.y !== undefined) {
          el.setAttribute('x1', source.x.toString());
          el.setAttribute('y1', source.y.toString());
          el.setAttribute('x2', target.x.toString());
          el.setAttribute('y2', target.y.toString());
        }
      });

      // Update nodes
      nodes.forEach(node => {
        const el = nodeRefs.current.get(node.id);
        if (el && node.x !== undefined && node.y !== undefined) {
          el.setAttribute('transform', `translate(${node.x}, ${node.y})`);
        }
      });
    });

    return () => {
      simulation.stop();
    };
  }, [nodes, links, dimensions, isClient]);

  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [ripples, setRipples] = useState<{ id: string, x: number, y: number, ts: number }[]>([]);

  const handlePointerDown = (e: React.PointerEvent, id: string) => {
    const svg = containerRef.current?.querySelector('svg');
    if (!svg) return;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const cursorPt = pt.matrixTransform(svg.getScreenCTM()?.inverse());
    
    setRipples(prev => [...prev, { id, x: cursorPt.x, y: cursorPt.y, ts: Date.now() }]);
    
    setTimeout(() => {
      setRipples(prev => prev.filter(r => Date.now() - r.ts < 1000));
    }, 1000);
  };

  if (!isClient) return null;

  return (
    <section id="skills" className="relative py-16 md:py-24 px-4 w-full bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200/50 dark:border-zinc-900 overflow-hidden transition-colors duration-300">
      <div className="text-center mb-8 relative z-10">
        <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-white sm:text-5xl tracking-tight bg-clip-text bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400 text-transparent">
          Technical Graph
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 mt-4 text-lg">
          Physics-driven ecosystem of expertise. Node scale correlates to proficiency level.
        </p>
      </div>

      <div ref={containerRef} className="w-full h-[600px] sm:h-[800px] relative z-0">
        <svg width="100%" height="100%" className="overflow-visible">
          {/* Render edges first so they are behind nodes */}
          <g className="edges">
            {links.map(link => (
              <line
                key={link.id}
                ref={el => { if (el) linkRefs.current.set(link.id, el); }}
                stroke="#9ca3af"
                strokeWidth={1.5}
                strokeOpacity={0.2}
                className="pointer-events-none"
              />
            ))}
          </g>

          {nodes.map(node => {
            const isHovered = hoveredId === node.id;
            return (
              <g
                key={node.id}
                ref={el => { if (el) nodeRefs.current.set(node.id, el); }}
              >
                <g
                  style={{ scale: isHovered ? 1.3 : 1, transition: 'scale 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}
                  onPointerEnter={() => setHoveredId(node.id)}
                  onPointerLeave={() => setHoveredId(null)}
                  onPointerDown={(e) => handlePointerDown(e, node.id)}
                  className="cursor-pointer"
                >
                  {/* Node Background */}
                  <circle
                    r={node.radius}
                    fill={node.color}
                    opacity={isHovered ? 1 : 0.8}
                    className="transition-opacity duration-300 shadow-2xl drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                  />
                  {/* Inner Glow */}
                  <circle
                    r={node.radius - 2}
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth={1}
                    opacity={0.3}
                  />
                  
                  {/* Text Label */}
                  <text
                    textAnchor="middle"
                    dy=".3em"
                    fontSize={Math.max(10, node.radius * 0.3)}
                    fill="#ffffff"
                    fontWeight="600"
                    className="pointer-events-none select-none drop-shadow-md font-sans"
                  >
                    {node.title.length > 12 ? node.title.substring(0, 10) + '...' : node.title}
                  </text>
                </g>
              </g>
            );
          })}

          {/* Ripples */}
          <AnimatePresence>
            {ripples.map(ripple => (
              <motion.circle
                key={ripple.ts}
                cx={ripple.x}
                cy={ripple.y}
                initial={{ r: 0, opacity: 0.6, strokeWidth: 4 }}
                animate={{ r: 120, opacity: 0, strokeWidth: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                fill="none"
                stroke="#fff"
                className="pointer-events-none"
              />
            ))}
          </AnimatePresence>
        </svg>
      </div>
    </section>
  );
}
