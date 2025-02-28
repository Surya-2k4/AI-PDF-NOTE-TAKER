"use client"
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogFooter,
    DialogClose,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { CloudFog, Loader2Icon } from 'lucide-react'
import uuid4 from 'uuid4'
import { useUser } from '@clerk/nextjs'
import axios from 'axios'
import { useAction } from 'convex/react'
import { toast } from 'sonner'

function UploadPdfDialog({ children, isMaxFile }) {
    const generateUploadUrl = useMutation(api.fileStorage.generateUploadUrl);
    const addFileEntry = useMutation(api.fileStorage.AddFileEntryToDb);
    const getFileUrl = useMutation(api.fileStorage.getFileUrl);
    const embeddDocument = useAction(api.myAction.ingest);

    const { user } = useUser(); // for getting user name
    const [file, setFile] = useState();
    const [loading, setLoading] = useState(false);
    const [fileName, setFileName] = useState(); // for getting email id
    const [open, setOpen] = useState(false);
    const [error, setError] = useState('');

    const OnFileSelect = (event) => {
        setFile(event.target.files[0]);
    }

    const OnUpload = async () => {
        if (!file) {
            setError('Please select a file to upload.');
            return;
        }

        if (!fileName) {
            setError('Please enter a file name.');
            return;
        }

        setLoading(true);
        setError('');

        // Step 1: Get a short-lived upload URL
        const postUrl = await generateUploadUrl();

        // Step 2: POST the file to the URL
        const result = await fetch(postUrl, {
            method: "POST",
            headers: { "Content-Type": file?.type },
            body: file,
        });
        const { storageId } = await result.json();

        console.log('StorageId', storageId);
        const fileId = uuid4();
        // generate file url
        const fileUrl = await getFileUrl({ storageId: storageId });

        const resp = await addFileEntry({
            fileId: fileId,
            storageId: storageId,
            fileName: fileName ?? 'Untitled file',
            fileUrl: fileUrl,
            createdBy: user?.primaryEmailAddress?.emailAddress
        });

        // API Call to Fetch PDF Process Data
        const ApiResp = await axios.get('/api/pdf-loader?pdfUrl=' + fileUrl);
        console.log(ApiResp.data.result);
        await embeddDocument({
            splitText: ApiResp.data.result,
            fileId: fileId
        });
        setLoading(false); // after successfully file uploaded
        setOpen(false);

        toast('File is ready..!')
    }

    return (
        <Dialog open={open}>
            <DialogTrigger asChild>
                <Button onClick={() => setOpen(true)} disabled={isMaxFile} className="w-full">+ Upload PDF File</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Upload Pdf File</DialogTitle>
                    <DialogDescription asChild>
                        <div className=''>
                            <h2 className='mt-5'>Select a File to Upload</h2>
                            <div className='gap-2 p-3 rounded-md border'>
                                <input type='file' accept='application/pdf' onChange={(event) => OnFileSelect(event)} />
                            </div>
                            <div className='mt-2'>
                                <label>File Name *</label>
                                <Input placeholder="Enter File Name" onChange={(e) => setFileName(e.target.value)} />
                            </div>
                            {error && <p className="text-red-500 mt-2">{error}</p>}
                        </div>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="sm:justify-end">
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Close
                        </Button>
                    </DialogClose>
                    <Button onClick={OnUpload} disabled={loading}>
                        {loading ? <Loader2Icon className='animate-spin' /> : 'Upload'}
                        Upload
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default UploadPdfDialog;