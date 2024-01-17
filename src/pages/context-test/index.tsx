import React, { useContext, useEffect, useState } from 'react';
import TestContext, { TestContextProvider } from '@/components/TestContext';

const wait = (cb, time) => {
  return new Promise((res, rej) => {
    setTimeout(() => {
      cb();
      res(undefined);
    }, time);
  });
};

const ViewForCompanyContent: React.FC = () => {
  const { store, setStore } = useContext(TestContext);

  const {
    organizationInfo: { projectId, projectName, departmentId },
    bimGisInfo,
  } = store;

  useEffect(() => {
    setStore(
      'organizationInfo',
      {
        departmentId: 's',
      },
      'merge',
    );
    wait(() => {
      setStore(
        'organizationInfo',
        {
          projectId: '4',
        },
        'merge',
      );
      setStore(
        'bimGisInfo',
        {
          list: [1, 2, 5],
        },
        'merge',
      );
    }, 2000);
  }, []);

  return (
    <div>
      <div>departmentId: {departmentId}</div>
      <div>projectId: {projectId}</div>
      <div> bimGisInfoList: {bimGisInfo.list} </div>
    </div>
  );
};

// 外部包裹

const ViewForCompany = () => (
  <TestContextProvider>
    <ViewForCompanyContent />
  </TestContextProvider>
);

export default ViewForCompany;
