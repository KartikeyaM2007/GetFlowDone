import React from 'react'
import { PricingTable } from '@clerk/nextjs'

const Pricing = () => {
  return (
    <>
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1rem' }}>
      <div className='my-10 font-bold text-center text-3xl mt-5 mb-3'>Pricing Plans</div>
      <PricingTable />
    </div>
    </>
  )
}

export default Pricing