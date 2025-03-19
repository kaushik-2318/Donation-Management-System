"use client"

import React from "react"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { FilePlus, X } from "lucide-react"
import { cn } from "@/lib/utils"

export const FileUpload = ({ onUpload, multiple = true, accept }) => {
  const [files, setFiles] = useState([])

  const onDrop = useCallback(
    (acceptedFiles) => {
      setFiles((prevFiles) => (multiple ? [...prevFiles, ...acceptedFiles] : acceptedFiles))
      onUpload(multiple ? [...files, ...acceptedFiles] : acceptedFiles)
    },
    [onUpload, multiple, files],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple,
    accept,
  })

  const handleRemoveFile = (fileToRemove) => {
    setFiles((prevFiles) => {
      const updatedFiles = prevFiles.filter((file) => file !== fileToRemove)
      onUpload(updatedFiles)
      return updatedFiles
    })
  }

  return (
    <div className="border rounded-md p-4">
      <div
        {...getRootProps()}
        className={cn(
          "relative border-2 border-dashed rounded-md p-6 text-center cursor-pointer",
          isDragActive ? "border-primary" : "border-muted-foreground",
        )}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <>
            <FilePlus className="mx-auto h-6 w-6 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              {multiple
                ? "Drag 'n' drop some files here, or click to select files"
                : "Drag 'n' drop a file here, or click to select a file"}
            </p>
            {accept && <p className="text-xs text-muted-foreground mt-1">Accepted formats: {accept}</p>}
          </>
        )}
      </div>

      {files.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Uploaded Files:</h4>
          <ul className="space-y-2">
            {files.map((file) => (
              <li key={file.name} className="flex items-center justify-between border rounded-md p-2">
                <span className="text-sm truncate">{file.name}</span>
                <Button variant="ghost" size="icon" onClick={() => handleRemoveFile(file)}>
                  <X className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

