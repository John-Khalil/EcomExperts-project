import { useState } from 'react'
import BundleLayout from './BundleLayout'
import Stepper from './components/Stepper'
import * as productsData from './data/products.json'

function App() {

  return (
    <>
      <BundleLayout>
        <Stepper 
          steps={productsData.steps}
          activeStep={productsData.steps[0].id}
          onStepChange={(stepId) => console.log('Step changed to:', stepId)}
        />
      </BundleLayout>
    </>
  )
}

export default App
