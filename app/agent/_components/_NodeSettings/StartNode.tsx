import React from 'react'

const StartNode = () => {
  return (
    <div>
        <h2 className='flex justify-center items-center font-black text-sm uppercase tracking-widest text-[#00f2fe] font-mono py-4'>
           🚀 Start Node Selected
        </h2>
        <p className="text-xs text-gray-400 text-center leading-relaxed">
           This is the active entrypoint of your workflow pipeline. Connect this node to begin agent operations.
        </p>
    </div>
  )
}

export default StartNode