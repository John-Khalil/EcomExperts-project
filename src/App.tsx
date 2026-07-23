// import { useState } from 'react'
import BundleLayout from './BundleLayout'
import Stepper from './components/Stepper'
// import * as productsData from './data/products.json'
import { useBundle } from './context/BundleContext';
import useProducts from './hooks/LoadProducts';

function App() {
  const { state, setStep } = useBundle();
  const { data, loading, error } = useProducts();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!data) return <div>No data.</div>;

  return (
    <BundleLayout>
      <Stepper
        steps={data.steps}
        activeStep={state.activeStep}
        onStepChange={setStep}
      />
    </BundleLayout>
  );
}

export default App
