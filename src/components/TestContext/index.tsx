import { message } from 'antd';
import React, { useState } from 'react';

interface BimGisInfo {
  modelApp?: any;
  gisViewer?: any;
  elementInfoData?: any;
  list?: any[];
}

interface OrganizationInfo {
  departmentId?: string;
  projectId?: string;
  projectName?: string;
}

interface Store {
  bimGisInfo: BimGisInfo;
  organizationInfo: OrganizationInfo;
}

const TestContext = React.createContext<{
  store?: Store;
  setStore?: (
    key: keyof Store,
    value: Record<string, any>,
    type: 'cover' | 'merge',
  ) => void;
}>({});

const formatObj = (
  obj,
  value: Record<string, any>,
  type: 'cover' | 'merge',
) => {
  if (type === 'cover') {
    return obj;
  } else if (type === 'merge') {
    return {
      ...obj,
      ...value,
    };
  }
};

export const TestContextProvider: React.FC = ({ children }) => {
  const [bimGisInfo, setBimGisInfo] = useState<BimGisInfo>({
    modelApp: undefined,
    gisViewer: undefined,
    // 选中的构件信息
    elementInfoData: undefined,
    list: [],
  });
  const [organizationInfo, setOrganizationInfo] = useState<OrganizationInfo>({
    departmentId: undefined,
    projectId: undefined,
    projectName: undefined,
  });

  // const [color, setColor] = useState('ss');

  const store = {
    organizationInfo,
    bimGisInfo,
  };

  return (
    <TestContext.Provider
      value={{
        store,
        setStore: (key, value, type = 'cover') => {
          console.log('setStore', key, value, type);
          if (!key || !store[key]) {
            return;
          }
          const resValue = formatObj(store[key], value, type);

          if (key === 'organizationInfo') {
            console.log('resValue', key, resValue);
            setOrganizationInfo(resValue);
          }
          if (key === 'bimGisInfo') {
            setBimGisInfo(resValue);
          }
        },
      }}
    >
      {children}
    </TestContext.Provider>
  );
};

export default TestContext;

// const TestContext = () => {
//   return (
//     <div>TestContext</div>
//   )
// }

// export default TestContext
