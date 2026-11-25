import { BookOpen, Lightbulb } from "lucide-react";
import { CardTitle, GlassCard } from "@/components/ui/glass-card";
import { MarkdownContent } from "@/components/ui/markdown-content";

interface StudyContentCardProps {
  moduleTitle: string;
  topicTitle: string;
  summaryContent: string;
  keyTakeaways: string[];
}

export function StudyContentCard({
  moduleTitle,
  topicTitle,
  summaryContent,
  keyTakeaways,
}: StudyContentCardProps) {
  return (
    <GlassCard ariaLabel="O que estudar hoje" className="min-w-0">
      <CardTitle icon={<BookOpen aria-hidden className="size-5 text-violet-300" />}>
        O que estudar hoje
      </CardTitle>
      <p className="mb-1 text-sm font-semibold text-violet-200">{moduleTitle}</p>
      <p className="mb-5 text-xl font-bold text-white">{topicTitle}</p>
      <MarkdownContent content={summaryContent} />
      <div className="mt-6 rounded-2xl border border-violet-400/20 bg-violet-500/10 p-4">
        <h3 className="mb-3 flex items-center gap-2 font-bold text-white">
          <Lightbulb aria-hidden className="size-5 text-amber-300" />
          Pontos-chave
        </h3>
        <ul className="list-disc space-y-1.5 pl-5 text-slate-200">
          {keyTakeaways.map((takeaway) => (
            <li key={takeaway}>{takeaway}</li>
          ))}
        </ul>
      </div>
    </GlassCard>
  );
}
