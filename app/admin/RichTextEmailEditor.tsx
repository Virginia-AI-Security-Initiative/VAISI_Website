'use client';

import { useEffect, useRef } from 'react';
import {
  Bold,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Redo2,
  RemoveFormatting,
  Underline,
  Undo2,
  Unlink,
} from 'lucide-react';

const RICH_TEXT_MARKER = '<!--vaisi-rich-text-v1-->';
const ALLOWED_TAGS = new Set([
  'a',
  'b',
  'blockquote',
  'br',
  'div',
  'em',
  'i',
  'li',
  'ol',
  'p',
  'strong',
  'u',
  'ul',
]);

type RichTextEmailEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function escapeAttribute(value: string) {
  return escapeHtml(value).replace(/`/g, '&#096;');
}

function inlineMarkdownHtml(value: string) {
  return escapeHtml(value)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(
      /\[([^\]]+)]\((https?:\/\/[^)]+)\)/g,
      '<a href="$2">$1</a>'
    );
}

function markdownEmailHtml(value: string) {
  const blocks: string[] = [];
  let orderedListOpen = false;

  for (const line of value.split('\n')) {
    const listItem = line.match(/^\d+\.\s+(.+)$/);

    if (listItem) {
      if (!orderedListOpen) {
        blocks.push('<ol>');
        orderedListOpen = true;
      }
      blocks.push(`<li>${inlineMarkdownHtml(listItem[1])}</li>`);
      continue;
    }

    if (orderedListOpen) {
      blocks.push('</ol>');
      orderedListOpen = false;
    }

    blocks.push(line ? `<div>${inlineMarkdownHtml(line)}</div>` : '<div><br></div>');
  }

  if (orderedListOpen) {
    blocks.push('</ol>');
  }

  return blocks.join('');
}

function sanitizeRichHtml(value: string) {
  return value
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1\s*>/gi, '')
    .replace(/<\/?([a-z0-9]+)(?:\s[^>]*)?>/gi, (source, rawTag: string) => {
      const tag = rawTag.toLowerCase();
      if (!ALLOWED_TAGS.has(tag)) {
        return '';
      }

      const closing = /^<\//.test(source);
      if (closing) {
        return tag === 'br' ? '' : `</${tag}>`;
      }

      if (tag === 'a') {
        const hrefMatch = source.match(/\shref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
        const href = hrefMatch?.[1] ?? hrefMatch?.[2] ?? hrefMatch?.[3] ?? '';
        if (!/^(https?:\/\/|mailto:)/i.test(href)) {
          return '';
        }
        return `<a href="${escapeAttribute(href)}">`;
      }

      return tag === 'br' ? '<br>' : `<${tag}>`;
    });
}

export function emailBodyToHtml(value: string) {
  if (value.startsWith(RICH_TEXT_MARKER)) {
    return sanitizeRichHtml(value.slice(RICH_TEXT_MARKER.length));
  }

  return markdownEmailHtml(value);
}

export function richHtmlToStoredBody(value: string) {
  return `${RICH_TEXT_MARKER}${sanitizeRichHtml(value)}`;
}

function decodeHtmlEntities(value: string) {
  return value
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#0?39;/gi, "'")
    .replace(/&#0?96;/gi, '`');
}

export function emailBodyToPlainText(value: string) {
  return decodeHtmlEntities(
    emailBodyToHtml(value)
      .replace(
        /<a\s+href="([^"]+)">([\s\S]*?)<\/a>/gi,
        (_match, url: string, label: string) => {
          const cleanLabel = label.replace(/<[^>]+>/g, '');
          return cleanLabel === url ? url : `${cleanLabel} (${url})`;
        }
      )
      .replace(/<br\s*\/?\s*>/gi, '\n')
      .replace(/<li>/gi, '• ')
      .replace(/<\/(div|p|li|blockquote)>/gi, '\n')
      .replace(/<\/(ol|ul)>/gi, '\n')
      .replace(/<[^>]+>/g, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim()
  );
}

function normalizeLink(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  if (/^(https?:\/\/|mailto:)/i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

const toolbarButtonClass =
  'tap-scale inline-flex size-10 items-center justify-center rounded-lg text-slate-600 transition-[background-color,color,scale] duration-150 hover:bg-white hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300';

export default function RichTextEmailEditor({ value, onChange }: RichTextEmailEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const lastEmittedValue = useRef<string | null>(null);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor || value === lastEmittedValue.current) {
      return;
    }

    const nextHtml = emailBodyToHtml(value);
    if (editor.innerHTML !== nextHtml) {
      editor.innerHTML = nextHtml;
    }
  }, [value]);

  function emitChange() {
    const editor = editorRef.current;
    if (!editor) {
      return;
    }

    const nextValue = richHtmlToStoredBody(editor.innerHTML);
    lastEmittedValue.current = nextValue;
    onChange(nextValue);
  }

  function runCommand(command: string, commandValue?: string) {
    editorRef.current?.focus();
    document.execCommand(command, false, commandValue);
    emitChange();
  }

  function addLink() {
    const rawUrl = window.prompt('Paste the link URL:');
    const url = rawUrl ? normalizeLink(rawUrl) : null;
    if (!url) {
      return;
    }

    editorRef.current?.focus();
    const selection = window.getSelection();
    if (selection?.isCollapsed) {
      document.execCommand(
        'insertHTML',
        false,
        `<a href="${escapeAttribute(url)}">${escapeHtml(url)}</a>`
      );
    } else {
      document.execCommand('createLink', false, url);
    }
    emitChange();
  }

  const controls = [
    { label: 'Bold', icon: Bold, command: 'bold' },
    { label: 'Italic', icon: Italic, command: 'italic' },
    { label: 'Underline', icon: Underline, command: 'underline' },
    { label: 'Bulleted list', icon: List, command: 'insertUnorderedList' },
    { label: 'Numbered list', icon: ListOrdered, command: 'insertOrderedList' },
  ];

  return (
    <div className="mt-2 overflow-hidden rounded-xl border border-slate-300 bg-white shadow-sm transition-[border-color,box-shadow] duration-150 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-200">
      <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-slate-50 p-1.5">
        {controls.map(({ label, icon: Icon, command }) => (
          <button
            key={command}
            type="button"
            aria-label={label}
            title={label}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => runCommand(command)}
            className={toolbarButtonClass}
          >
            <Icon size={17} aria-hidden="true" />
          </button>
        ))}
        <span className="mx-1 h-6 w-px bg-slate-200" aria-hidden="true" />
        <button
          type="button"
          aria-label="Add link"
          title="Add link"
          onMouseDown={(event) => event.preventDefault()}
          onClick={addLink}
          className={toolbarButtonClass}
        >
          <LinkIcon size={17} aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label="Remove link"
          title="Remove link"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => runCommand('unlink')}
          className={toolbarButtonClass}
        >
          <Unlink size={17} aria-hidden="true" />
        </button>
        <span className="mx-1 h-6 w-px bg-slate-200" aria-hidden="true" />
        <button
          type="button"
          aria-label="Undo"
          title="Undo"
          onClick={() => runCommand('undo')}
          className={toolbarButtonClass}
        >
          <Undo2 size={17} aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label="Redo"
          title="Redo"
          onClick={() => runCommand('redo')}
          className={toolbarButtonClass}
        >
          <Redo2 size={17} aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label="Clear formatting"
          title="Clear formatting"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => runCommand('removeFormat')}
          className={toolbarButtonClass}
        >
          <RemoveFormatting size={17} aria-hidden="true" />
        </button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-label="Email body"
        aria-multiline="true"
        data-placeholder="Write the email here…"
        onInput={emitChange}
        onBlur={emitChange}
        onPaste={(event) => {
          event.preventDefault();
          document.execCommand('insertText', false, event.clipboardData.getData('text/plain'));
          emitChange();
        }}
        className="min-h-[34rem] resize-y overflow-auto px-4 py-3 text-sm leading-6 text-slate-900 outline-none empty:before:pointer-events-none empty:before:text-slate-400 empty:before:content-[attr(data-placeholder)] [&_a]:text-[#0563c1] [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-slate-200 [&_blockquote]:pl-4 [&_li]:my-1 [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-7 [&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-7"
      />
    </div>
  );
}
