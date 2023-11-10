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
  const { projectInfo, setProjectInfo, asyncList, setAsyncList } =
    useContext(TestContext);
  const { departmentId, projectId } = projectInfo || {};

  console.log('textContest', projectInfo);
  useEffect(() => {
    setProjectInfo({
      departmentId: '11',
    });
    wait(() => {
      setProjectInfo({
        projectId: 's',
      });
      setAsyncList({
        list: '',
      });
    }, 2000);
  }, []);

  return (
    <div>
      <div>departmentId: {departmentId}</div>
      <div>projectId: {projectId}</div>
      <div> asyncList: {asyncList.list} </div>
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
