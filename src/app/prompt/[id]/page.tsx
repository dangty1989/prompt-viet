import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExternalLink, ArrowLeft, MessageSquare, Sparkles, Code, Tag, Languages } from "lucide-react";
import { Github } from "@/components/CustomIcons";
import Link from "next/link";
import { prompts, getPromptPlatforms, type Prompt } from "@/data";
import { SurveyEmbed } from "@/components/SurveyEmbed";
import { ContactInfo } from "@/components/ContactInfo";
import { cn } from "@/lib/utils";
import { CopyPromptButton } from "@/components/CopyPromptButton";
import { siteLinks } from "@/config/site";

const platformIcons = {
  ChatGPT: MessageSquare,
  Gemini: Sparkles,
  "Google Workspace": Code,
};

const platformColors = {
  ChatGPT: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Gemini: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  "Google Workspace": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return prompts.map((prompt: Prompt) => ({
    id: prompt.id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const prompt = prompts.find((p: Prompt) => p.id === resolvedParams.id);

  if (!prompt) {
    return { title: "Prompt không tồn tại" };
  }

  return {
    title: prompt.title,
    description: prompt.content.slice(0, 160),
    openGraph: {
      title: prompt.title,
      description: prompt.content.slice(0, 160),
      type: "article",
      tags: prompt.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: prompt.title,
      description: prompt.content.slice(0, 160),
    },
  };
}

export default async function PromptDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const prompt = prompts.find((p: Prompt) => p.id === resolvedParams.id);

  if (!prompt) {
    notFound();
  }

  return (
    <article
      className="prompt-detail min-h-screen flex flex-col"
      style={{ containerType: "inline-size" } as React.CSSProperties}
    >
      <header className="prompt-detail-header sticky top-0 z-50 bg-[rgb(var(--color-background))] dark:bg-[rgb(var(--color-background))] border-b border-[rgb(var(--color-border))]">
        <div className="prompt-detail-container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between h-16" aria-label="Breadcrumb">
                      <Link
                        href="/"
                        className="flex items-center gap-2 text-[rgb(var(--color-muted-foreground))] hover:text-[rgb(var(--color-foreground))] dark:hover:text-[rgb(var(--color-foreground))] text-sm font-medium transition-colors"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Trang chủ
                      </Link>
                      <div className="flex items-center gap-2">
                        <Link
                          href="/support"
                          className="text-sm text-[rgb(var(--color-muted-foreground))] hover:text-[rgb(var(--color-foreground))] dark:hover:text-[rgb(var(--color-foreground))] transition-colors"
                        >
                          Ủng hộ
                        </Link>
                        {siteLinks.githubRepo && (
                          <a
                            href={siteLinks.githubRepo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-sm text-[rgb(var(--color-muted-foreground))] hover:text-[rgb(var(--color-foreground))] dark:hover:text-[rgb(var(--color-foreground))] transition-colors"
                            aria-label="Xem mã nguồn trên GitHub"
                          >
                            <Github className="w-4 h-4" />
                            <span className="hidden sm:inline">Mã nguồn</span>
                          </a>
                        )}
                      </div>
                    </nav>
        </div>
      </header>

      <main className="flex-1 py-8 sm:py-12 lg:py-16">
        <div className="prompt-detail-container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prompt-detail-meta mb-6 sm:mb-8 lg:mb-10">
            <div className="flex flex-wrap items-center gap-2 mb-3 sm:mb-4">
              <Link
                href="/"
                className="flex items-center gap-1 text-sm text-[rgb(var(--color-muted-foreground))] hover:text-[rgb(var(--color-foreground))] dark:hover:text-[rgb(var(--color-foreground))] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Quay lại danh sách
              </Link>
            </div>
            <div className="flex flex-wrap items-center gap-2 mb-4 sm:mb-6">
              {getPromptPlatforms(prompt).map((platform) => {
                const Icon = platformIcons[platform as keyof typeof platformIcons] || MessageSquare;
                const color = platformColors[platform as keyof typeof platformColors] || "bg-muted text-foreground";
                return (
                  <span key={platform} className={cn("px-3 py-1 text-sm font-medium rounded-full", color)}>
                    <Icon className="w-4 h-4 inline mr-1" /> {platform}
                  </span>
                );
              })}
              <span className="px-3 py-1 text-sm font-medium rounded-full bg-[rgb(var(--color-muted))] dark:bg-[rgb(var(--color-muted))] text-[rgb(var(--color-foreground))] dark:text-[rgb(var(--color-foreground))]">
                {prompt.category}
              </span>
            </div>
            <h1 className="prompt-detail-title text-2xl sm:text-3xl lg:text-4xl font-bold text-[rgb(var(--color-foreground))] leading-tight">
              {prompt.title}
            </h1>
            <div className="flex flex-wrap gap-2 mt-3 sm:mt-4">
              {prompt.tags.map((tag: string) => (
                <span key={tag} className="px-3 py-1 text-sm text-[rgb(var(--color-muted-foreground))] bg-[rgb(var(--color-muted))] dark:bg-[rgb(var(--color-muted))] rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <div className="prompt-detail-content bg-[rgb(var(--color-card))] dark:bg-[rgb(var(--color-card))] rounded-xl border border-[rgb(var(--color-border))] p-4 sm:p-6 lg:p-8 mb-8 lg:mb-10">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-base sm:text-lg font-semibold text-[rgb(var(--color-foreground))] flex items-center gap-2">
                <Code className="w-5 h-5" />
                Nội dung prompt
              </h2>
              <CopyPromptButton content={prompt.content} />
            </div>
            <pre className="whitespace-pre-wrap font-mono text-sm sm:text-base text-[rgb(var(--color-foreground))] leading-relaxed max-h-[500px] overflow-y-auto">
              {prompt.content}
            </pre>
          </div>

          <div className="prompt-detail-info-grid grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-8 lg:mb-10">
            <InfoCard icon={Tag} title="Danh mục" value={prompt.category} />
            <InfoCard icon={Sparkles} title="Nền tảng" value={getPromptPlatforms(prompt).join(", ")} />
            <InfoCard icon={Languages} title="Ngôn ngữ" value="Tiếng Việt" />
          </div>

          <section className="mb-10 lg:mb-14">
            <SurveyEmbed promptId={prompt.id} promptTitle={prompt.title} />
          </section>

          <section className="prompt-detail-references bg-[rgb(var(--color-card))] dark:bg-[rgb(var(--color-card))] rounded-xl border border-[rgb(var(--color-border))] p-4 sm:p-6 lg:p-8 mb-8 lg:mb-10">
            <h2 className="text-base sm:text-lg font-semibold text-[rgb(var(--color-foreground))] mb-4 sm:mb-6 flex items-center gap-2">
              <ExternalLink className="w-5 h-5" />
              Nguồn tham khảo
            </h2>
            <ul className="space-y-2 sm:space-y-3 text-[rgb(var(--color-muted-foreground))] text-sm sm:text-base">
              <li><a href="https://github.com/f/prompts.chat" target="_blank" rel="noopener noreferrer" className="hover:text-[rgb(var(--color-primary))] dark:hover:text-[rgb(var(--color-primary))] underline">prompts.chat - Prompt patterns</a></li>
              <li><a href="https://github.com/awesome-chatgpt-prompts" target="_blank" rel="noopener noreferrer" className="hover:text-[rgb(var(--color-primary))] dark:hover:text-[rgb(var(--color-primary))] underline">awesome-chatgpt-prompts</a></li>
              <li><a href="https://github.com/neverbiasu/awesome-gemini-prompts" target="_blank" rel="noopener noreferrer" className="hover:text-[rgb(var(--color-primary))] dark:hover:text-[rgb(var(--color-primary))] underline">awesome-gemini-prompts</a></li>
              <li><a href="https://github.com/zerolu/awesome-gemini-ai" target="_blank" rel="noopener noreferrer" className="hover:text-[rgb(var(--color-primary))] dark:hover:text-[rgb(var(--color-primary))] underline">awesome-gemini-ai</a></li>
              <li><a href="https://workspace.google.com/learning/content/gemini-prompt-guide" target="_blank" rel="noopener noreferrer" className="hover:text-[rgb(var(--color-primary))] dark:hover:text-[rgb(var(--color-primary))] underline">Google Workspace Gemini Prompt Guide</a></li>
              <li><a href="https://ai.google.dev/gemini-api/docs/prompting-strategies" target="_blank" rel="noopener noreferrer" className="hover:text-[rgb(var(--color-primary))] dark:hover:text-[rgb(var(--color-primary))] underline">Gemini API Prompting Strategies</a></li>
            </ul>
          </section>

          <ContactInfo variant="default" className="mb-8 lg:mb-12" />
        </div>
      </main>
    </article>
  );
}

function InfoCard({
  icon: Icon,
  title,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string;
}) {
  return (
    <div className="bg-[rgb(var(--color-card))] dark:bg-[rgb(var(--color-card))] rounded-xl border border-[rgb(var(--color-border))] p-3 sm:p-4">
      <div className="flex items-center gap-2 text-[rgb(var(--color-muted-foreground))] mb-1">
        <Icon className="w-5 h-5" />
        <span className="text-sm font-medium">{title}</span>
      </div>
      <p className="text-[rgb(var(--color-foreground))] font-medium">{value}</p>
    </div>
  );
}