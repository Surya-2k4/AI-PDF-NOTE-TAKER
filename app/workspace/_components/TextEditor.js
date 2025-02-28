import React, { useEffect } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import EditorExtensions from './EditorExtensions';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';

function TextEditor({ fileId }) {
  const { user } = useUser(); // Get user info
  const userEmail = user?.primaryEmailAddress?.emailAddress || '';

  // Fetch Notes (Ensure `userEmail` is passed)
  const notes = useQuery(api.notes.GetNotes, {
    fileId: fileId,
    userEmail: userEmail, // Added userEmail
  });

  console.log(notes);

  // Editor Initialization
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({
        placeholder: 'Start Taking Your Notes Here...',
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Highlight.configure({
        multicolor: true,
      }),
      Subscript,
      Superscript,
    ],
    editorProps: {
      attributes: {
        class: 'focus:outline-none h-screen p-5',
      },
    },
  });

  // Save Notes Mutation
  const saveNotes = useMutation(api.notes.AddNotes);

  const onSave = () => {
    if (!editor || !fileId) {
      console.log("Editor or fileId is missing!");
      return;
    }
  
    saveNotes({
      fileId: fileId,  // Ensure fileId is included
      notes: editor.getHTML(),
      createdBy: userEmail,
    });
  };
  // Update Editor Content When Notes Change
  useEffect(() => {
    if (editor && notes) {
      editor.commands.setContent(notes);
    }
  }, [notes, editor]); // Fixed dependency array

  return (
    <div>
      <div className="text-end">
        <Button onClick={onSave}>Save Notes</Button>
      </div>

      <EditorExtensions editor={editor} />

      <div className="overflow-scroll h-[88vh]">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

export default TextEditor;
