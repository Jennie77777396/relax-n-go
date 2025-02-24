'use client'
import React from 'react'
import MDEditor from '@uiw/react-md-editor'

export default function SampleSandbox() {
  const [value, setValue] = React.useState<string>('**Hello world!!!**')

  // Create a wrapper function for onChange
  const handleEditorChange = (newValue?: string) => {
    setValue(newValue || '') // Set to empty string if newValue is undefined
  }

  return (
    <div className="container">
      <MDEditor value={value} onChange={handleEditorChange} />
      {/* <MDEditor.Markdown source={value} style={{ whiteSpace: 'pre-wrap' }} /> */}
    </div>
  )
}
