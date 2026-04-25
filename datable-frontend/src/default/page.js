import React from 'react';
import DataTable from '../Component/data-table/datatable';
// Change this line:
import toolData from './data.json'; 

const Page = () => {
  return (
    <main>
      <DataTable initialData={toolData} />
    </main>
  );
};

export default Page;