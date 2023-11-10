import React, { useState } from 'react';

// interface Store {
//   departmentId?: string;
//   projectId?: string;
// }

// const defaultStore: Store = {
//   departmentId: undefined,
//   projectId: undefined,
// };

const TestContext = React.createContext<{
  // store: Store;
  // setStore: (value: Store, type: 'cover' | 'merge') => void;
}>({
  store: {},
  setStore: () => {},
});

export const TestContextProvider: React.FC = ({ children }) => {
  const [projectInfo, setProjectInfo] = useState({});
  const [asyncList, setAsyncList] = useState({
    list: 'list',
  });
  // const [color, setColor] = useState('ss');

  return (
    <TestContext.Provider
      value={{
        projectInfo,
        setProjectInfo,
        asyncList,
        setAsyncList,
      }}
    >
      {children}
    </TestContext.Provider>
  );
};

export default TestContext;
