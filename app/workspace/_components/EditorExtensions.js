import React from 'react'
import { AlignCenter, AlignLeft, AlignRight, Bold, Code, Heading1, Heading2, Highlighter, Italic, Sparkles, StrikethroughIcon, Subscript, Superscript, Underline } from 'lucide-react'
import { useAction, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api'
import { chatSession } from '@/configs/AiModel' // Adjust the import path as necessary
import { useParams } from 'next/navigation';

import { toast } from 'sonner';
import { useUser } from '@clerk/nextjs';

function EditorExtensions({ editor }) {

  if (!editor) {
    return null; // or handle the error accordingly
  }
  const { fileId } = useParams();
  const SearchAI = useAction(api.myAction.search)
  const saveNotes = useMutation(api.notes.AddNotes)
  const { user } = useUser();

  const onAiClick = async () => {
    // Get the selected text from the editor
    toast("Ai is getting your ...")

    const selectedText = editor.state.doc.textBetween(
      editor.state.selection.from,
      editor.state.selection.to,
      ''
    );

    // Query the AI model with the selected text and file ID
    const result = await SearchAI({
      query: selectedText,
      fileId: fileId
    });

    // Parse the result and concatenate the content
    const UnformattedAns = JSON.parse(result);
    let AllUnformattedAns = '';

    UnformattedAns && UnformattedAns.forEach(item => {
      AllUnformattedAns += item.pageContent;
    });

    // Create a prompt with more context and the concatenated content
    const PROMPT = `For the question: "${selectedText}", please provide an appropriate answer in HTML format. The content to be used for the answer is as follows: ${AllUnformattedAns}`;

    // Send the prompt to the AI model
    const AimodelResult = await chatSession.sendMessage(PROMPT);
    const responseText = AimodelResult.response.text();

    // Log the response from the AI model
    console.log(responseText);

    // Format the response and update the editor content
    const FinalAns = responseText.replace(/```/g, '').replace(/html/g, '').replace('< lang="en">', '');
    const Alltext = editor.getHTML();
    editor.commands.setContent(Alltext + '<p><strong><br>Answer:</strong> ' + FinalAns + '</p>');

    saveNotes({
      notes: editor.getHTML(),
      fileId: fileId,
      createdBy: user?.primaryEmailAddress?.emailAddress
    })

  };


  return (
    <div className='p-5'>
      <div className="control-group">
        <div className="button-group flex gap-3">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive('bold') ? 'text-blue-500' : ''}>
            <Bold />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive('italic') ? 'text-blue-500' : ''}>
            <Italic />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={editor.isActive('underline') ? 'text-blue-500' : ''}>
            <Underline />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={editor.isActive('code') ? 'text-blue-500' : ''}>
            <Code />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHighlight({ color: 'yellow' }).run()}
            className={editor.isActive('highlight', { color: 'yellow' }) ? 'text-blue-500' : ''}>
            <Highlighter />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleSubscript().run()}
            className={editor.isActive('subscript') ? 'text-blue-500' : ''}>
            <Subscript />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleSuperscript().run()}
            className={editor.isActive('superscript') ? 'text-blue-500' : ''}>
            <Superscript />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={editor.isActive('strike') ? 'text-blue-500' : ''}>
            <StrikethroughIcon />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={editor.isActive({ textAlign: 'left' }) ? 'text-blue-500' : ''}>
            <AlignLeft />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={editor.isActive({ textAlign: 'center' }) ? 'text-blue-500' : ''}>
            <AlignCenter />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={editor.isActive({ textAlign: 'right' }) ? 'text-blue-500' : ''}>
            <AlignRight />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={editor.isActive({ level: 1 }) ? 'text-blue-500' : ''}>
            <Heading1 />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={editor.isActive({ level: 2 }) ? 'text-blue-500' : ''}>
            <Heading2 />
          </button>
          <button
            onClick={() => onAiClick()}
            className={'hover:text-blue-500'}>
            <Sparkles />
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditorExtensions
