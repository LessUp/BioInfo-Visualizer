"use client";

import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { cn } from '@/lib/utils';

// Initialize with default settings
// We can dynamically update theme in useEffect if needed
mermaid.initialize({
  startOnLoad: false,
  theme: 'base',
  securityLevel: 'loose',
  fontFamily: 'inherit',
  themeVariables: {
    primaryColor: '#eff6ff', // blue-50
    primaryTextColor: '#1e3a8a', // blue-900
    primaryBorderColor: '#bfdbfe', // blue-200
    lineColor: '#64748b', // slate-500
    secondaryColor: '#fefce8', // yellow-50
    tertiaryColor: '#f0fdf4', // green-50
  }
});

interface MermaidDiagramProps {
  chart: string;
  className?: string;
}

export default function MermaidDiagram({ chart, className }: MermaidDiagramProps) {
  const [svg, setSvg] = useState('');
  const [error, setError] = useState<string | null>(null);
  // Use a unique ID for each render to avoid conflicts
  const idRef = useRef(`mermaid-${Math.random().toString(36).slice(2, 11)}`);

  useEffect(() => {
    // Check for dark mode to adjust theme if necessary
    // For now we stick to a neutral/base theme that works reasonably well in both
    // or we could check document.documentElement.classList.contains('dark')
    
    const isDark = document.documentElement.classList.contains('dark');
    
    mermaid.initialize({
      startOnLoad: false,
      theme: isDark ? 'dark' : 'base',
      themeVariables: isDark ? {
        primaryColor: '#1e293b', // slate-800
        primaryTextColor: '#e2e8f0', // slate-200
        primaryBorderColor: '#334155', // slate-700
        lineColor: '#94a3b8', // slate-400
      } : {
        primaryColor: '#eff6ff',
        primaryTextColor: '#1e3a8a',
        primaryBorderColor: '#bfdbfe',
        lineColor: '#64748b',
      }
    });
  }, []);

  useEffect(() => {
    let isMounted = true;
    
    const renderChart = async () => {
      try {
        setError(null);
        // Render returns an object { svg } in v10+
        // We need to ensure the element doesn't exist before rendering if possible, 
        // but mermaid.render creates a temporary element.
        
        const { svg } = await mermaid.render(idRef.current, chart);
        
        if (isMounted) {
          setSvg(svg);
        }
      } catch (err) {
        console.error('Mermaid rendering error:', err);
        if (isMounted) {
          // Fallback or error message
          setError('图表渲染失败');
        }
      }
    };

    renderChart();

    return () => {
      isMounted = false;
    };
  }, [chart]);

  if (error) {
    return (
      <div className={cn("rounded border border-red-200 bg-red-50 p-4 text-red-500 text-sm font-mono", className)}>
        Failed to render chart
      </div>
    );
  }

  return (
    <div 
      className={cn("flex justify-center overflow-x-auto py-4 bg-white/50 dark:bg-zinc-900/50 rounded-lg", className)}
      dangerouslySetInnerHTML={{ __html: svg }} 
    />
  );
}
