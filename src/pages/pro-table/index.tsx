import React, { useEffect, useState } from 'react';
import ProTable from '@ant-design/pro-table';

// 验证 protable 进行了防抖

const Context = React.createContext<any>({});

const TableUseContext = () => {
  const { store, setStore } = React.useContext(Context);

  const request = async (params) => {
    console.log('sss', params);
    if (!params.a) {
      return {
        data: [],
        total: 0,
      };
    }

    return new Promise((res) => {
      setTimeout(() => {
        res({
          data: [],
          total: 0,
        });
      }, 2000);
    });
  };

  return (
    <div>
      <ProTable
        search={false}
        toolBarRender={false}
        request={request}
        params={{ ...store }}
      />
    </div>
  );
};

const ContextChangeComponents = () => {
  const { store, setStore } = React.useContext(Context);
  useEffect(() => {
    // setInterval(() => {
    // setStore({
    //   a: Math.random(),
    // });
    // }, 3000);
  }, []);
  return (
    <div
    // onClick={() => {
    //   setStore({
    //     a: Math.random(),
    //   });
    // }}
    >
      <div>store.a:{store.a}</div>
      <div
        onClick={() => {
          setStore({});
        }}
      >
        clearStore
      </div>
      <div
        onClick={() => {
          setStore({
            a: Math.random(),
          });
        }}
      >
        setRandomStore
      </div>
    </div>
  );
};

const ContextComponents = ({ children }) => {
  const [store, setStore] = useState({});

  return (
    <Context.Provider value={{ store, setStore }}>
      <TableUseContext></TableUseContext>
      <ContextChangeComponents></ContextChangeComponents>
    </Context.Provider>
  );
};

export default ContextComponents;
