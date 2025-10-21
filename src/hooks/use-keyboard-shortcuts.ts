"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useKeyboardShortcuts() {
  const router = useRouter();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Only trigger if not typing in an input/textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      // Ctrl/Cmd + K - Quick command (focus search)
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        searchInput?.focus();
      }

      // Ctrl/Cmd + N - New comic
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        router.push('/create');
      }

      // Ctrl/Cmd + T - Templates
      if ((e.ctrlKey || e.metaKey) && e.key === 't') {
        e.preventDefault();
        router.push('/templates');
      }

      // Ctrl/Cmd + H - Home
      if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
        e.preventDefault();
        router.push('/');
      }

      // Ctrl/Cmd + M - My Novels
      if ((e.ctrlKey || e.metaKey) && e.key === 'm') {
        e.preventDefault();
        router.push('/novels');
      }

      // Ctrl/Cmd + A - Analytics
      if ((e.ctrlKey || e.metaKey) && e.key === 'a' && !e.shiftKey) {
        e.preventDefault();
        router.push('/analytics');
      }

      // ? - Show keyboard shortcuts help
      if (e.key === '?' && !e.shiftKey) {
        e.preventDefault();
        showKeyboardShortcutsHelp();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [router]);
}

function showKeyboardShortcutsHelp() {
  const shortcuts = [
    { keys: ['Ctrl/Cmd', 'N'], description: 'New Comic' },
    { keys: ['Ctrl/Cmd', 'T'], description: 'Templates' },
    { keys: ['Ctrl/Cmd', 'H'], description: 'Home' },
    { keys: ['Ctrl/Cmd', 'M'], description: 'My Novels' },
    { keys: ['Ctrl/Cmd', 'A'], description: 'Analytics' },
    { keys: ['Ctrl/Cmd', 'K'], description: 'Focus Search' },
    { keys: ['?'], description: 'Show This Help' },
  ];

  const helpText = shortcuts
    .map(s => `${s.keys.join(' + ')}: ${s.description}`)
    .join('\n');

  alert(`Keyboard Shortcuts:\n\n${helpText}`);
}




