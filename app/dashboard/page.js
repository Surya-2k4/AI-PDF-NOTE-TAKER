"use client"
import { useQuery } from 'convex/react';
import React, { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { api } from '@/convex/_generated/api';
import Image from 'next/image'; // Correct import for Image component from 'next/image'
import Link from 'next/link';
import Modal from './_components/Modal';

function Dashboard() {
  const { user } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fileList = useQuery(api.fileStorage.GetUserFiles, {
    userEmail: user?.primaryEmailAddress?.emailAddress,
  });

  const savedNotes = useQuery(api.notes.GetNotes, {
    userEmail: user?.primaryEmailAddress?.emailAddress,
  });

  console.log(fileList);

  return (
    <div>
      <div className='flex justify-between p-5 '>
        <h2 className='font-medium text-3xl'>Workspace</h2>
        <button onClick={() => setIsModalOpen(true)} className='italic font-mono text-sm underline cursor-pointer'>
          View Saved PDF
        </button>
      </div>

      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 mt-10'>
        {fileList?.length > 0 ? (
          fileList.map((file) => (
            <Link key={file.fileId} href={'/workspace/' + file.fileId}> {/* Correct key prop */}
              <div
                className='flex p-5 shadow-md rounded-md flex-col items-center justify-center
                border cursor-pointer hover:scale-110 transition-all'
              >
                <Image src={'/pdf.png'} alt='file' width={50} height={50} />
                <h2 className='mt-3 font-medium text-lg'>{file?.fileName}</h2>
                {/* <h2>{file.createdBy}</h2> */}
              </div>
            </Link>
          ))
        ) : (
          [1, 2, 3, 4, 5, 6, 7].map((item, index) => (
            <div key={index} className='bg-slate-200 rounded-md h-[150px] animate-pulse'></div>
          ))
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className='font-medium text-3xl mb-5'>Saved Notes</h2>
        <div className='bg-white p-5 shadow-md rounded-md'>
          {savedNotes ? (
            <div dangerouslySetInnerHTML={{ __html: savedNotes }} />
          ) : (
            <p>No notes found.</p>
          )}
        </div>
      </Modal>
    </div>
  );
}

export default Dashboard;

