import styles from './index.less';
import React from 'react';
import { ConfigProvider, Form, Input } from 'antd';
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

const IndexPage = () => {
  const add = async () => {
    const a = { a: 'a' };
    console.log('structuredClone', structuredClone);
  };

  const [form] = Form.useForm();

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
      <div>
        <ConfigProvider prefixCls="ss">
          <Form
            form={form}
            onValuesChange={(changedValues: any, values: any) => {
              console.log('changedValues', values);
            }}
          >
            <Form.Item name="myInput" label="myInput">
              <MyInput
                onChange={(value: any, myParams: any) => {
                  console.log('myOnchange', value, myParams);
                  form.setFieldsValue({
                    myInput1: value,
                  });
                }}
              />
            </Form.Item>
            <Form.Item name="myInput1" label="myInput1">
              <Input />
            </Form.Item>
          </Form>
        </ConfigProvider>
      </div>
    </div>
  );
};

export default IndexPage;
