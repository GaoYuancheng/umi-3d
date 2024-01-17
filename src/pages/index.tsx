import styles from './index.less';
import React, { useEffect, useState } from 'react';
import { Button, ConfigProvider, Form, Input } from 'antd';
import { Link } from '@umijs/max';
import { getReactInstanceForElement } from '@/utils';

const MyInput: React.FC<{ onChange?: any; value?: any }> = ({
  onChange,
  value,
}) => {
  return (
    <div>
      <Input
        value={value}
        onChange={(e) => {
          console.log('input');
          //  formOnChange + propsOnChange
          onChange(e.target.value, 'myparams');
        }}
      />
    </div>
  );
};

function createConnection() {
  // 真实的实现会将其连接到服务器，此处代码只是示例
  return {
    connect() {
      console.log('✅ 连接中……');
    },
    disconnect() {
      console.log('❌ 连接断开。');
    },
  };
}

const IndexPage = () => {
  const add = async () => {
    const a = { a: 'a' };
    console.log('structuredClone', structuredClone);
  };

  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
  }, []);

  return (
    <div className={styles.pageIndex}>
      <h1 className={styles.title}>Page index</h1>
      <div className={styles.test}>--testColor</div>
      <div className="classname1">classname1</div>
      <ul
        onClick={(e) => {
          let reactInstance = null;
          const { target } = e;
          for (const key in target) {
            // Fiber access to React internals
            if (key.startsWith('__reactFiber')) {
              reactInstance = target[key];
            }
          }

          const { _debugSource } = reactInstance;
          const { columnNumber = 1, fileName, lineNumber = 1 } = _debugSource;
          const filePath = `${fileName}:${lineNumber}:${columnNumber}`;
          const url = `vscode://file/${filePath}`;
          window.location.assign(url);
          console.log('e', reactInstance, _debugSource, filePath);
        }}
      >
        <li ss="ss">1</li>
        <li>2</li>
        <li>3</li>
        <li>4</li>
      </ul>
      <div>
        <Link to="/map">/map</Link>
      </div>
      {/* <div>
        <Button
          onClick={() => {
            setOpen(true);
          }}
        >
          openModal
        </Button>
      </div> */}
      <div id="root"></div>
      <div id="root-salve"></div>
    </div>
  );
};

export default IndexPage;
