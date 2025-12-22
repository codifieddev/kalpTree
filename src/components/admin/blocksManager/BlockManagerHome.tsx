"use client"
import React from 'react'
import BlockManagerTable from './blockManagerlist/BlockManagerTable'
import GetAllBlocks from './blockManagerlist/GetAllBlocks'

const BlockManagerHome = () => {
  return (
    <>
    <GetAllBlocks/>
   < BlockManagerTable/>
    </>
  )
}

export default BlockManagerHome