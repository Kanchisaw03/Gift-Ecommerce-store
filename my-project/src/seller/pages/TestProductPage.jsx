import React from 'react';
import TestProductForm from '../components/TestProductForm';
import SimpleProductForm from '../components/SimpleProductForm';
import SellerLayout from '../layouts/SellerLayout';

const TestProductPage = () => {
  return (
    <SellerLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-white">Test Product Creation</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-bold mb-4 text-white">Method 1: Direct API Call</h2>
            <TestProductForm />
          </div>
          
          <div>
            <h2 className="text-xl font-bold mb-4 text-white">Method 2: FormData Upload</h2>
            <SimpleProductForm />
          </div>
        </div>
      </div>
    </SellerLayout>
  );
};

export default TestProductPage;
