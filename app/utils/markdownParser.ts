export const parseMarkdown = (text: string): string => {
    if (!text) return '';
    
    let result = text;
  
    // Headers
    result = result.replace(/^### (.*$)/gm, '<h3 class="text-xl font-bold text-gray-800 mb-2">$1</h3>');
    result = result.replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold text-gray-800 mb-3">$1</h2>');
    result = result.replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold text-gray-800 mb-4">$1</h1>');
  
    // Bold and Italic
    result = result.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-black">$1</strong>');
    result = result.replace(/\*([^*]+)\*/g, '<em class="italic text-gray-800">$1</em>');
    result = result.replace(/_([^_]+)_/g, '<em class="italic text-gray-800">$1</em>');
  
    // Links
    result = result.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" class="text-blue-500 underline" target="_blank" rel="noopener noreferrer">$1</a>'
    );
  
    // Task Lists (Checkboxes)
    result = result.replace(/^\s*-\s*\[([ xX])\]\s*(.+?)$/gm, (match, checked, text) => {
      const isChecked = checked.toLowerCase() === 'x';
      return `
        <div class="flex items-center py-1">
          <input type="checkbox" ${isChecked ? 'checked' : ''} 
            class="mr-2 h-4 w-4 rounded border-gray-400 bg-white checked:bg-blue-500 checked:border-blue-500 focus:ring-blue-500 focus:ring-offset-white" 
            readonly />
          <span class="${isChecked ? 'text-gray-500 line-through' : 'text-gray-800'}">${text}</span>
        </div>`;
    });
  
    // Unordered Lists
    const processLists = (text: string): string => {
      // const listRegex = /^(\s*)-\s+([^\n]+)/gm;
      const lines = text.split('\n');
      let inList = false;
      let result = '';
      let currentIndentLevel = 0;
  
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const match = line.match(/^(\s*)-\s+([^\n]+)/);
  
        if (match) {
          if (!inList) {
            result += '<ul class="list-disc list-inside mb-2 text-gray-800">\n';
            inList = true;
          }
          const indentLevel = match[1].length / 2;
          
          // Handle nested lists
          if (indentLevel > currentIndentLevel) {
            result += '<ul class="ml-4 list-disc list-inside">\n';
          } else if (indentLevel < currentIndentLevel) {
            result += '</ul>\n'.repeat(currentIndentLevel - indentLevel);
          }
          
          currentIndentLevel = indentLevel;
          result += `${'  '.repeat(indentLevel)}<li class="mb-1">${match[2]}</li>\n`;
        } else {
          if (inList) {
            result += '</ul>\n'.repeat(currentIndentLevel + 1);
            inList = false;
            currentIndentLevel = 0;
          }
          result += line + '\n';
        }
      }
  
      if (inList) {
        result += '</ul>\n'.repeat(currentIndentLevel + 1);
      }
  
      return result;
    };
  
    result = processLists(result);
  
    // Code blocks with language support
    result = result.replace(/```(\w+)?\n([\s\S]+?)\n```/g, (match, language, code) => {
      return `
        <pre class="bg-gray-100 p-4 rounded-lg overflow-x-auto">
          <code class="language-${language || 'plaintext'}">${code.trim()}</code>
        </pre>
      `;
    });
  
    // Inline code
    result = result.replace(/`([^`]+)`/g, 
      '<code class="bg-gray-100 px-1 rounded text-sm font-mono">$1</code>'
    );
  
    // Horizontal Rule
    result = result.replace(/^---$/gm, '<hr class="my-4 border-t border-gray-300" />');
  
    // Blockquotes
    result = result.replace(/^>\s*(.*$)/gm, 
      '<blockquote class="pl-4 border-l-4 border-gray-300 text-gray-600 italic">$1</blockquote>'
    );
  
    // Tables
    result = result.replace(/^\|(.+)\|$/gm, (match, content) => {
      const cells = content.split('|').map((cell: string) => cell.trim());
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return `<tr>${cells.map((cell: any) => `<td class="border px-4 py-2">${cell}</td>`).join('')}</tr>`;
    });
    
    // Wrap tables
    result = result.replace(/<tr>.*?<\/tr>(\n<tr>.*?<\/tr>)+/g, match => 
      `<table class="min-w-full border-collapse border border-gray-300 mb-4">${match}</table>`
    );
  
    // Paragraphs (skip already processed elements)
    result = result.split('\n\n').map(paragraph => {
      if (!paragraph.trim()) return '';
      if (!/^<[a-z]/.test(paragraph)) {
        return `<p class="text-gray-800 mb-2">${paragraph}</p>`;
      }
      return paragraph;
    }).join('\n');
  
    return result;
  };
  
  export const sanitizeHtml = (html: string): string => {
    // Basic XSS protection
    const div = document.createElement('div');
    div.innerHTML = html;
    
    // Remove potentially dangerous attributes
    const elements = div.getElementsByTagName('*');
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      for (let j = 0; j < element.attributes.length; j++) {
        const attr = element.attributes[j];
        if (attr.name.startsWith('on') || attr.value.includes('javascript:')) {
          element.removeAttribute(attr.name);
        }
      }
    }
    
    return div.innerHTML;
  };