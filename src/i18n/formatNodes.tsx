import type { ReactNode } from 'react';

/**
 * Fills a translation template's {placeholders} with values, returning the pieces as
 * separate React children. This keeps the same text-node structure as inline JSX like
 * `محظور ({count})`, so Arabic text shapes exactly as it did before translation.
 */
export const formatNodes = (template: string, vars: Record<string, ReactNode>): ReactNode[] =>
  template
    .split(/(\{\w+\})/)
    .filter((part) => part !== '')
    .map((part) => {
      const match = /^\{(\w+)\}$/.exec(part);
      return match && match[1] in vars ? vars[match[1]] : part;
    });
