// src/components/ui/MarkdownEditor.tsx
import React, { useState, useRef } from 'react';
import { Button } from './Button';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  placeholder = "Escribe usando Markdown...",
  rows = 12
}) => {
  const [preview, setPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertMarkdownSyntax = (syntax: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    
    let newText = '';
    let cursorOffset = 0;
    
    switch (syntax) {
      case 'bold':
        newText = `**${selectedText || 'texto en negrita'}**`;
        cursorOffset = selectedText ? 0 : -2;
        break;
      case 'italic':
        newText = `*${selectedText || 'texto en cursiva'}*`;
        cursorOffset = selectedText ? 0 : -1;
        break;
      case 'code':
        newText = `\`${selectedText || 'código'}\``;
        cursorOffset = selectedText ? 0 : -1;
        break;
      case 'codeblock':
        newText = `\n\`\`\`\n${selectedText || 'bloque de código'}\n\`\`\`\n`;
        cursorOffset = selectedText ? 0 : -5;
        break;
      case 'link':
        newText = `[${selectedText || 'texto del enlace'}](URL)`;
        cursorOffset = selectedText ? -4 : -4;
        break;
      case 'list':
        newText = `\n- ${selectedText || 'elemento de lista'}\n- elemento 2\n- elemento 3\n`;
        cursorOffset = selectedText ? 0 : -26;
        break;
      case 'numberedList':
        newText = `\n1. ${selectedText || 'primer elemento'}\n2. segundo elemento\n3. tercer elemento\n`;
        cursorOffset = selectedText ? 0 : -41;
        break;
      case 'quote':
        newText = `\n> ${selectedText || 'cita'}\n`;
        cursorOffset = selectedText ? 0 : -1;
        break;
      case 'table':
        newText = `\n| Columna 1 | Columna 2 | Columna 3 |\n|-----------|-----------|----------|\n| Fila 1    | Dato 1    | Dato 2   |\n| Fila 2    | Dato 3    | Dato 4   |\n`;
        cursorOffset = 0;
        break;
      case 'heading':
        newText = `## ${selectedText || 'Título'}`;
        cursorOffset = selectedText ? 0 : 0;
        break;
    }

    const newValue = textarea.value.substring(0, start) + newText + textarea.value.substring(end);
    onChange(newValue);
    
    // Mantener foco y posicionar cursor
    setTimeout(() => {
      textarea.focus();
      const newPosition = start + newText.length + cursorOffset;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Atajos de teclado
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          insertMarkdownSyntax('bold');
          break;
        case 'i':
          e.preventDefault();
          insertMarkdownSyntax('italic');
          break;
        case 'k':
          e.preventDefault();
          insertMarkdownSyntax('link');
          break;
      }
    }

    // Tab para indentación
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current!;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      
      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      onChange(newValue);
      
      setTimeout(() => {
        textarea.setSelectionRange(start + 2, start + 2);
      }, 0);
    }
  };

  const renderPreview = (markdown: string) => {
    // Función simple para renderizar markdown básico
    let html = markdown
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 rounded">$1</code>')
      .replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-100 p-4 rounded overflow-x-auto"><code>$1</code></pre>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:underline" target="_blank" rel="noopener">$1</a>')
      .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-gray-300 pl-4 italic text-gray-600">$1</blockquote>')
      .replace(/^- (.+)$/gm, '<li class="ml-4">$1</li>')
      .replace(/^(\d+)\. (.+)$/gm, '<li class="ml-4">$2</li>')
      .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold mb-2 mt-4">$1</h2>')
      .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mb-2 mt-4">$1</h1>')
      .replace(/!\[([^\]]*)\]\(imagen:([^)]+)\)/g, '<div class="my-4 p-4 bg-blue-50 border border-blue-200 rounded"><span class="text-blue-600">📷 Imagen: $2</span><br><small class="text-gray-500">La imagen se mostrará cuando publiques el post</small></div>')
      .replace(/\n/g, '<br>');

    return { __html: html };
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button
            type="button"
            variant={preview ? "outline" : "primary"}
            size="sm"
            onClick={() => setPreview(false)}
          >
            ✏️ Editar
          </Button>
          <Button
            type="button"
            variant={preview ? "primary" : "outline"}
            size="sm"
            onClick={() => setPreview(true)}
          >
            👁️ Vista Previa
          </Button>
        </div>
        <div className="text-xs text-gray-500">
          Ctrl+B: Negrita | Ctrl+I: Cursiva | Ctrl+K: Enlace | Tab: Indentar
        </div>
      </div>

      {!preview ? (
        <>
          {/* Barra de herramientas */}
          <div className="flex flex-wrap gap-1 p-3 bg-gray-50 rounded-md border">
            <Button type="button" variant="ghost" size="sm" onClick={() => insertMarkdownSyntax('heading')} title="Título">
              H
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => insertMarkdownSyntax('bold')} title="Negrita (Ctrl+B)">
              <strong>B</strong>
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => insertMarkdownSyntax('italic')} title="Cursiva (Ctrl+I)">
              <em>I</em>
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => insertMarkdownSyntax('code')} title="Código">
              {'</>'}
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => insertMarkdownSyntax('codeblock')} title="Bloque de código">
              {'{ }'}
            </Button>
            <span className="border-l mx-1"></span>
            <Button type="button" variant="ghost" size="sm" onClick={() => insertMarkdownSyntax('link')} title="Enlace (Ctrl+K)">
              🔗
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => insertMarkdownSyntax('list')} title="Lista">
              • Lista
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => insertMarkdownSyntax('numberedList')} title="Lista numerada">
              1. Lista
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => insertMarkdownSyntax('quote')} title="Cita">
              💬
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => insertMarkdownSyntax('table')} title="Tabla">
              📊
            </Button>
          </div>

          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            rows={rows}
            placeholder={placeholder}
          />
        </>
      ) : (
        <div className="min-h-[200px] p-4 border rounded-md bg-white">
          <div className="prose max-w-none">
            {value ? (
              <div dangerouslySetInnerHTML={renderPreview(value)} />
            ) : (
              <div className="text-gray-500 italic">Escribe contenido para ver la vista previa...</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
