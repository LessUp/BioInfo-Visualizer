"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, FileText, GitBranch, Activity, Search, ChevronRight, PlayCircle, AlertCircle } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import MermaidDiagram from '@/components/ui/MermaidDiagram';
import { cn } from '@/lib/utils';

const OVERVIEW_CHART = `
graph LR
    A(Raw Data<br/>FASTQ) --> B{QC & Trimming<br/>FastQC/Trimmomatic}
    B -->|Clean Reads| C[Alignment<br/>BWA-MEM]
    C --> D(BAM File)
    D --> E{Variant Calling<br/>GATK}
    E --> F[VCF File]
    
    style A fill:#f8fafc,stroke:#94a3b8,stroke-width:2px
    style B fill:#eff6ff,stroke:#60a5fa,stroke-width:2px
    style C fill:#f0fdf4,stroke:#4ade80,stroke-width:2px
    style D fill:#f8fafc,stroke:#94a3b8,stroke-width:2px
    style E fill:#fff7ed,stroke:#fb923c,stroke-width:2px
    style F fill:#f1f5f9,stroke:#cbd5e1,stroke-width:2px
`;

const VARIANT_CALLING_CHART = `
graph TD
    subgraph "Active Region Identification"
        A[Input BAM] --> B{Active Region?}
    end
    subgraph "Local Assembly"
        B -->|Yes| C[Build De Bruijn Graph]
        C --> D[Find Candidate Haplotypes]
    end
    subgraph "Genotyping"
        D --> E[PairHMM Likelihoods]
        E --> F[Assign Genotypes]
    end
    F --> G[Output VCF]

    style B fill:#eff6ff,stroke:#60a5fa
    style C fill:#f0fdf4,stroke:#4ade80
    style E fill:#fff7ed,stroke:#fb923c
`;

const TOC = [
  { id: 'intro', title: '1. NGS 流程概览' },
  { id: 'qc', title: '2. 质量控制 (QC)' },
  { id: 'align', title: '3. 序列比对 (Alignment)' },
  { id: 'variant', title: '4. 变异检测 (Variant Calling)' },
  { id: 'annotation', title: '5. 结果注释 (Annotation)' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

export default function NgsAnalysisGuidePage() {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      {/* Sidebar / TOC for Desktop */}
      <aside className="fixed left-0 top-16 hidden h-[calc(100vh-4rem)] w-64 overflow-y-auto border-r border-zinc-200 bg-white px-6 py-8 dark:border-zinc-800 dark:bg-zinc-900/50 lg:block">
        <div className="mb-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-medium text-zinc-500 transition-colors hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400"
          >
            <ArrowLeft className="h-4 w-4" />
            返回首页
          </Link>
        </div>
        <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          目录内容
        </h3>
        <nav className="space-y-1">
          {TOC.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="block w-full rounded-md px-2 py-1.5 text-left text-sm text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
            >
              {item.title}
            </button>
          ))}
        </nav>
      </aside>

      <main className="mx-auto max-w-4xl px-6 py-12 lg:pl-72">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-12"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="border-b border-zinc-200 pb-8 dark:border-zinc-800">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <BookOpen className="h-5 w-5" />
              <span className="text-sm font-semibold uppercase tracking-wide">教学讲义</span>
            </div>
            <h1 className="mt-4 text-3xl font-bold text-zinc-900 dark:text-zinc-50 sm:text-4xl">
              NGS 分析流程详解
            </h1>
            <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
              从原始测序数据 (FASTQ) 到变异检测结果 (VCF) 的完整链路解析。本指南旨在帮助初学者理解每个步骤的生物学意义与算法原理。
            </p>
          </motion.div>

          {/* Section 1: Intro */}
          <motion.section variants={itemVariants} id="intro" className="scroll-mt-24 space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                <Activity className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">1. NGS 流程概览</h2>
            </div>
            <Card className="prose prose-zinc max-w-none dark:prose-invert">
              <p>
                下一代测序 (Next-Generation Sequencing, NGS) 技术产生了海量的短序列片段。
                生物信息学分析的核心目标是将这些碎片拼接、比对回参考基因组，并找出样本与参考基因组之间的差异（即变异）。
              </p>
              <div className="not-prose my-6">
                <MermaidDiagram chart={OVERVIEW_CHART} className="bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800" />
              </div>
            </Card>
          </motion.section>

          {/* Section 2: QC */}
          <motion.section variants={itemVariants} id="qc" className="scroll-mt-24 space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                <AlertCircle className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">2. 质量控制 (QC)</h2>
            </div>
            <Card className="space-y-4">
              <p className="text-zinc-600 dark:text-zinc-300">
                测序仪输出的原始数据可能包含接头序列 (Adapters) 或低质量碱基。我们需要使用 FastQC 等工具进行评估，并使用 Trimmomatic 或 fastp 进行清洗。
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
                  <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">FastQC 指标重点</h4>
                  <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-zinc-600 dark:text-zinc-400">
                    <li>Per base sequence quality (Q30 比例)</li>
                    <li>Per sequence GC content (是否存在污染)</li>
                    <li>Adapter Content (接头残留)</li>
                  </ul>
                </div>
                <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100">思考题</h4>
                  <p className="mt-2 text-sm text-blue-800 dark:text-blue-300">
                    如果 GC 含量分布出现双峰 (Bimodal)，可能意味着什么？是样本污染还是特定的生物学现象？
                  </p>
                </div>
              </div>
            </Card>
          </motion.section>

          {/* Section 3: Alignment */}
          <motion.section variants={itemVariants} id="align" className="scroll-mt-24 space-y-6">
             <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                <GitBranch className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">3. 序列比对 (Alignment)</h2>
            </div>
            <Card className="space-y-4">
              <p className="text-zinc-600 dark:text-zinc-300">
                比对是将短序列定位到基因组具体位置的过程。常用的工具有 BWA (针对 DNA) 和 STAR/HISAT2 (针对 RNA)。
              </p>
               <div className="flex flex-col gap-4 sm:flex-row">
                  <div className="flex-1 rounded-lg bg-zinc-50 p-4 dark:bg-zinc-900/50">
                    <h4 className="font-bold text-zinc-900 dark:text-zinc-100">BWA-MEM 算法</h4>
                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                      采用 Burrows-Wheeler 变换 (BWT) 建立索引，快速定位 Seed，然后进行扩展比对 (Smith-Waterman)。
                    </p>
                  </div>
                  <Link 
                    href="/apps/bwa-algorithm-viz"
                    className="group flex flex-1 flex-col justify-between rounded-lg border border-blue-100 bg-blue-50 p-4 transition-colors hover:border-blue-300 hover:bg-blue-100 dark:border-blue-900/30 dark:bg-blue-900/10 dark:hover:bg-blue-900/20"
                  >
                    <div>
                      <div className="flex items-center gap-2 font-bold text-blue-700 dark:text-blue-300">
                        <PlayCircle className="h-4 w-4" />
                        互动演示
                      </div>
                      <p className="mt-1 text-sm text-blue-600 dark:text-blue-400">
                        在 BWA 算法可视化应用中观察 Seed Extension 过程。
                      </p>
                    </div>
                    <div className="mt-2 flex justify-end">
                      <ArrowRight className="h-4 w-4 text-blue-500 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
                    </div>
                  </Link>
               </div>
            </Card>
          </motion.section>

           {/* Section 4: Variant Calling */}
           <motion.section variants={itemVariants} id="variant" className="scroll-mt-24 space-y-6">
             <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                <Search className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">4. 变异检测 (Variant Calling)</h2>
            </div>
             <Card className="space-y-4">
              <p className="text-zinc-600 dark:text-zinc-300">
                通过统计学模型判断某个位点的碱基与参考基因组不同是由于测序误差还是真实的生物学变异。
                GATK HaplotypeCaller 是目前的行业金标准。
              </p>
              <div className="mt-2">
                <MermaidDiagram chart={VARIANT_CALLING_CHART} className="bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800" />
              </div>
              <div className="rounded-lg border border-zinc-200 p-5 dark:border-zinc-800">
                 <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">局部组装 (Local Assembly)</h4>
                 <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                   HaplotypeCaller 会在变异活跃区域构建 De Bruijn 图，重新组装单倍型。这种方法能有效解决 Indel（插入缺失）附近的假阳性问题。
                 </p>
                 <div className="mt-4">
                    <Link href="/apps/debruijn-viz" className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600 hover:underline dark:text-emerald-400">
                       <PlayCircle className="h-4 w-4" />
                       体验 De Bruijn 图构建演示
                    </Link>
                 </div>
              </div>
            </Card>
           </motion.section>

           {/* Section 5: Annotation */}
           <motion.section variants={itemVariants} id="annotation" className="scroll-mt-24 space-y-6">
             <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                <FileText className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">5. 结果注释 (Annotation)</h2>
            </div>
            <Card>
              <p className="text-zinc-600 dark:text-zinc-300">
                得到的 VCF 文件只包含染色体坐标和碱基变化。需要使用 ANNOVAR 或 SnpEff 赋予其生物学意义：
              </p>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {[
                  { label: 'Gene-based', desc: '变异位于哪个基因？造成什么氨基酸改变？' },
                  { label: 'Region-based', desc: '位于外显子、内含子还是启动子区域？' },
                  { label: 'Filter-based', desc: '在千人基因组或 gnomAD 数据库中的频率是多少？' },
                  { label: 'Pathogenicity', desc: 'ClinVar 数据库中是否记录为致病位点？' }
                ].map((item) => (
                  <li key={item.label} className="flex gap-3 rounded-md bg-zinc-50 p-3 dark:bg-zinc-900/50">
                     <Badge tone="neutral" className="h-fit">{item.label}</Badge>
                     <span className="text-sm text-zinc-600 dark:text-zinc-400">{item.desc}</span>
                  </li>
                ))}
              </ul>
            </Card>
           </motion.section>

           {/* Footer Actions */}
           <div className="mt-12 border-t border-zinc-200 pt-8 dark:border-zinc-800">
             <Link
                href="/pipelines/wes-germline"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-4 text-lg font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 hover:shadow-blue-600/30 sm:w-auto"
              >
                进入 WES 流程实战演示
                <ArrowRight className="h-5 w-5" />
              </Link>
           </div>

        </motion.div>
      </main>
    </div>
  );
}

// Helper Icon
function ArrowRight({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  )
}
