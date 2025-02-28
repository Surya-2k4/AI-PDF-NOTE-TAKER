"use client"
import { useParams } from 'next/navigation'
import React, { useEffect } from 'react'
import WorkspaceHeader from '../_components/WorkspaceHeader';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api'
import PdfViewer from '../_components/pdfViewer'; // Correct import
import TextEditor from '../_components/TextEditor';

function Workspace() {
    const {fileId} = useParams(); //it will return the fileId 
    const fileInfo=useQuery(api.fileStorage.GetFileRecord,{
        fileId:fileId
    })

    useEffect(()=>{
        console.log(fileInfo)
    },[fileInfo])
    
  
  return (
    <div>
        <WorkspaceHeader/>
        <div className='grid grid-cols-2 gap-5'>
            <div>
                {/* Text Editor */}
                <TextEditor/>
            </div>
            <div>
                {/* Pdf Viewer */}
               <PdfViewer fileUrl={fileInfo?.fileUrl}/> {/* Correct usage */}
            </div>
        </div>
    </div>
  )
}

export default Workspace