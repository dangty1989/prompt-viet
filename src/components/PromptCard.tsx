'use client';

import { Copy, Check, MessageSquare, Sparkles, Code, BookOpen, Briefcase, BarChart3, Zap, Globe, Bot, Image as ImageIcon, Film, ArrowUpRight, Hammer, Home, Sofa, HeartPulse } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Prompt, getPromptPlatforms } from '@/data';

interface PromptCardProps {
  prompt: Prompt;
  variant?: 'default' | 'compact';
}

const categoryEmoji: Record<string, string> = {
  'Học tập': '📚',
  'Công việc': '💼',
  'Phân tích dữ liệu': '📊',
  'Content Marketing': '📢',
  'Lập trình': '💻',
  'Ảnh - GPT Image': '🖼️',
  'Ảnh - Nano Banana': '🍌',
  'Video - ASMR': '🎬',
  'Dịch thuật': '🌐',
  'AI Skills': '🤖',
  'Xây dựng': '🏗️',
  'Bất động sản': '🏠',
  'Nội thất': '🛋️',
  'Sức khoẻ': '💚',
};

// One chip style for every category — the icon and label do the work, not fourteen competing hues.
const getCategoryColor = (cat: string) => ({
  bg: 'bg-muted',
  text: 'text-foreground',
  border: 'border-border',
  emoji: categoryEmoji[cat] ?? '📝',
});

function CategoryIcon({ category, className }: { category: string; className?: string }) {
  switch (category) {
    case 'Học tập':
      return <BookOpen className={className} aria-hidden="true" />;
    case 'Công việc':
      return <Briefcase className={className} aria-hidden="true" />;
    case 'Phân tích dữ liệu':
      return <BarChart3 className={className} aria-hidden="true" />;
    case 'Content Marketing':
      return <Zap className={className} aria-hidden="true" />;
    case 'Lập trình':
      return <Code className={className} aria-hidden="true" />;
    case 'Ảnh - GPT Image':
      return <ImageIcon className={className} aria-hidden="true" />;
    case 'Ảnh - Nano Banana':
      return <Sparkles className={className} aria-hidden="true" />;
    case 'Video - ASMR':
      return <Film className={className} aria-hidden="true" />;
    case 'Dịch thuật':
      return <Globe className={className} aria-hidden="true" />;
    case 'AI Skills':
      return <Bot className={className} aria-hidden="true" />;
    case 'Xây dựng':
      return <Hammer className={className} aria-hidden="true" />;
    case 'Bất động sản':
      return <Home className={className} aria-hidden="true" />;
    case 'Nội thất':
      return <Sofa className={className} aria-hidden="true" />;
    case 'Sức khoẻ':
      return <HeartPulse className={className} aria-hidden="true" />;
    default:
      return <BookOpen className={className} aria-hidden="true" />;
  }
}

function PlatformIcon({ platform, className }: { platform: string; className?: string }) {
  switch (platform) {
    case 'ChatGPT':
      return <MessageSquare className={className} aria-hidden="true" />;
    case 'Gemini':
      return <Sparkles className={className} aria-hidden="true" />;
    case 'Google Workspace':
      return <Code className={className} aria-hidden="true" />;
    default:
      return <MessageSquare className={className} aria-hidden="true" />;
  }
}

export function PromptCard({ prompt, variant = 'default' }: PromptCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(prompt.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = prompt.content;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (variant === 'compact') {
    return (
      <article className="prompt-card-compact group relative cursor-pointer bg-[rgb(var(--color-card))] dark:bg-[rgb(var(--color-card))] rounded-xl border border-[rgb(var(--color-border))] p-4 transition-all duration-200 hover:shadow-lg hover:border-[rgb(var(--color-primary))] dark:hover:border-[rgb(var(--color-primary))]">
        <Link href={`/prompt/${prompt.id}`} prefetch={false} className="absolute inset-0 z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--color-ring))] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[rgb(var(--color-card))]" aria-label={`Xem chi tiết: ${prompt.title}`}>
          <span className="sr-only">{prompt.title}</span>
        </Link>
        {/* pointer-events-none: để click vào thân card rơi xuống Link phủ toàn card;
            các phần tử tương tác bên trong bật lại pointer-events-auto. */}
        <div className="flex items-start gap-3 relative z-20 pointer-events-none">
          <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-[rgb(var(--color-primary))/0.1] dark:bg-[rgb(var(--color-primary))/0.2] flex items-center justify-center">
            <CategoryIcon category={prompt.category} className="w-6 h-6 text-[rgb(var(--color-primary))] dark:text-[rgb(var(--color-primary))]" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base text-[rgb(var(--color-foreground))] dark:text-[rgb(var(--color-foreground))] group-hover:text-[rgb(var(--color-primary))] dark:group-hover:text-[rgb(var(--color-primary))] transition-colors line-clamp-2">
              {prompt.title}
            </h3>
            <p className="text-sm text-[rgb(var(--color-muted-foreground))] line-clamp-2 mt-1">
              {prompt.content.replace(/\s+/g, ' ').trim().slice(0, 120)}
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {getPromptPlatforms(prompt).map((platform) => (
                <span key={platform} className={cn('badge', 'badge-chatgpt')}>
                  <PlatformIcon platform={platform} className="w-3 h-3 inline mr-1" /> {platform}
                </span>
              ))}
              <span className={cn('badge', 'badge-outline', getCategoryColor(prompt.category).bg, getCategoryColor(prompt.category).text)}>
                {getCategoryColor(prompt.category).emoji} {prompt.category}
              </span>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {prompt.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="badge badge-secondary text-xs">#{tag}</span>
              ))}
              {prompt.tags.length > 3 && (
                <span className="badge badge-outline text-muted-foreground text-xs">+{prompt.tags.length - 3}</span>
              )}
            </div>
          </div>
          <button
            onClick={handleCopy}
            className="flex-shrink-0 p-2 rounded-lg bg-[rgb(var(--color-muted))] dark:bg-[rgb(var(--color-muted))] text-[rgb(var(--color-muted-foreground))] dark:text-[rgb(var(--color-muted-foreground))] hover:bg-[rgb(var(--color-primary))/0.1] dark:hover:bg-[rgb(var(--color-primary))/0.2] hover:text-[rgb(var(--color-primary))] dark:hover:text-[rgb(var(--color-primary))] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--color-ring))] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[rgb(var(--color-card))]"
            aria-label={copied ? 'Đã copy vào clipboard' : 'Copy prompt'}
            data-action="copy"
          >
            {copied ? (
              <Check className="w-5 h-5 text-green-500" aria-hidden="true" />
            ) : (
              <Copy className="w-5 h-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </article>
    );
  }

  return (
    <article
      className={`prompt-card group relative cursor-pointer bg-[rgb(var(--color-card))] rounded-lg border border-border overflow-hidden transition-colors duration-200 hover:border-[rgb(var(--color-foreground)/0.35)] focus-within:ring-2 focus-within:ring-[rgb(var(--color-ring))] focus-within:ring-offset-2 focus-within:ring-offset-[rgb(var(--color-background))]`}
      style={{ containerType: 'inline-size' } as React.CSSProperties}
    >
      <Link
        href={`/prompt/${prompt.id}`}
        prefetch={false}
        className="prompt-card-link absolute inset-0 z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--color-ring))] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[rgb(var(--color-card))]"
        aria-label={`Xem chi tiết: ${prompt.title}`}
      >
        <span className="sr-only">{prompt.title}</span>
      </Link>

      {/* pointer-events-none trên khối nội dung: click vào thân card rơi xuống Link phủ
          toàn card. Nút Sao chép bật lại pointer-events-auto (xem style jsx bên dưới). */}
      <div className="prompt-card-content p-4 relative z-20 pointer-events-none">
        <div className="flex flex-wrap items-center gap-1.5 mb-2">
          <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold', getCategoryColor(prompt.category).bg, getCategoryColor(prompt.category).text)}>
            <span aria-hidden="true">{getCategoryColor(prompt.category).emoji}</span>
            {prompt.category}
          </span>
          {getPromptPlatforms(prompt).map((platform) => (
            <span
              key={platform}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-[rgb(var(--color-muted))] text-[rgb(var(--color-muted-foreground))]"
            >
              <PlatformIcon platform={platform} className="w-3 h-3" />
              {platform}
            </span>
          ))}
          <span className="ml-auto inline-flex items-center gap-0.5 text-[11px] font-medium text-[rgb(var(--color-primary))] opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100">
            Xem chi tiết
            <ArrowUpRight className="w-3 h-3" aria-hidden="true" />
          </span>
        </div>

        <h3 className="font-bold text-base sm:text-lg text-[rgb(var(--color-foreground))] transition-colors duration-200 group-hover:text-[rgb(var(--color-primary))] mb-2 line-clamp-2">
          {prompt.title}
        </h3>

        {/* Excerpt: người dùng biết prompt nói gì mà không cần mở hay copy */}
        <p className="text-sm text-[rgb(var(--color-muted-foreground))] line-clamp-2 mb-3">
          {prompt.content.replace(/\s+/g, ' ').trim().slice(0, 160)}
          {prompt.content.replace(/\s+/g, ' ').trim().length > 160 ? '…' : ''}
        </p>

        <div className="flex items-center justify-between gap-2 pt-3 border-t border-[rgb(var(--color-border))]">
          <div className="flex flex-wrap gap-1 min-w-0 overflow-hidden">
            {prompt.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="badge badge-secondary text-[11px] truncate max-w-[8rem]">#{tag}</span>
            ))}
            {prompt.tags.length > 3 && (
              <span className="badge badge-outline text-[11px] text-[rgb(var(--color-muted-foreground))]">+{prompt.tags.length - 3}</span>
            )}
          </div>
          <button
            onClick={handleCopy}
            className={cn(
              'relative z-20 flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--color-ring))] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[rgb(var(--color-card))]',
              copied
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                : 'bg-[rgb(var(--color-primary))/0.1] dark:bg-[rgb(var(--color-primary))/0.2] text-[rgb(var(--color-primary))] dark:text-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-primary))/0.2] dark:hover:bg-[rgb(var(--color-primary))/0.3]'
            )}
            aria-label={copied ? 'Đã copy vào clipboard' : 'Copy prompt'}
            data-action="copy"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-500" aria-hidden="true" />
                <span>Đã copy</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" aria-hidden="true" />
                <span>Sao chép</span>
              </>
            )}
          </button>
        </div>
      </div>

      <style jsx>{`
        .prompt-card {
          container-type: inline-size;
        }

        .prompt-card-link::after {
          content: '';
          position: absolute;
          inset: 0;
          z-index: 1;
        }

        [data-action="copy"] {
          position: relative;
          z-index: 20;
          /* nằm trên Link phủ toàn card nhưng vẫn nhận click */
          pointer-events: auto;
        }

        .prompt-card:focus-within .prompt-card-link::after {
          box-shadow: 0 0 0 2px rgb(var(--color-ring)), 0 0 0 4px rgb(var(--color-card));
        }
      `}</style>
    </article>
  );
}