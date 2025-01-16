import { BaseEditor, Descendant } from 'slate';
import { ReactEditor } from 'slate-react';

// Define custom element type
export type CustomElement = {
  type: 'paragraph' | 'heading' | 'list-item'; // Add more types as needed
  align?: 'left' | 'center' | 'right'; // Optional alignment property
  children: Descendant[];
};

// Extend Slate's CustomTypes
declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: { text: string; bold?: boolean; italic?: boolean }; // Adding marks to Text type
  }
}

// Define the initial editor value
export const initialEditorValue: CustomElement[] = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
];
