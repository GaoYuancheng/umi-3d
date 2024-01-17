import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import html2canvas from 'html2canvas';
import { Button } from 'antd';
import domtoimage from 'dom-to-image';

const iframeUrl = `http://localhost:8001`;

const Html2Canvas = () => {
  const iframeRef = useRef<HTMLIFrameElement>();

  const sendMessageToIframe = () => {
    const iframeWindow = iframeRef.current.contentWindow;
    iframeWindow.postMessage('getImage', iframeUrl);
  };

  useEffect(() => {
    window.addEventListener(
      'message',
      (e) => {
        // 通过origin对消息进行过滤，避免遭到XSS攻击
        // console.log(e.origin); // 父页面所在的域
        // console.log(e.data); // 父页面发送的消息, hello, child!
        html2canvas(document.body, {
          // useCORS: true,
          // allowTaint: true,
          onclone: (document, ele) => {
            // console.log('onclone', iframeDataUrl.current);
            const a = ele.getElementsByTagName('iframe')[0];
            const parentNode = a.parentNode;
            parentNode.removeChild(a);
            // const dom = document.createElement('div');
            // dom.innerHTML = 'dom11';
            const img = document.createElement('img');
            img.src = e.data;
            parentNode.appendChild(img);
          },
        }).then(function (canvas) {
          document.getElementById('canvasdom1').appendChild(canvas);
        });
      },
      false,
    );
  }, []);

  return (
    <div>
      <Button
        onClick={() => {
          // 获取子页面的 图片
          // sendMessageToIframe();
          html2canvas(document.body).then((canvas) => {
            document.getElementById('canvasdom1').appendChild(canvas);
          });
          // iframeRef.current.contentWindow.document.body

          // console.log('iframe', iframeRef.current.contentWindow.document.body);

          // domtoimage
          //   .toPng(iframeRef.current)
          //   .then(function (dataUrl) {
          //     var img = new Image();
          //     img.src = dataUrl;
          //     document.getElementById('canvasdom1').appendChild(img);
          //   })
          //   .catch(function (error) {
          //     console.error('oops, something went wrong!', error);
          //   });
        }}
      >
        html2canvas
      </Button>
      <Button
        onClick={() => {
          sendMessageToIframe();
        }}
      >
        sendMessageToIframe
      </Button>
      <div>
        {/* <iframe src="/map" frameborder="0" width={600} height={400}></iframe> */}
        <iframe
          ref={iframeRef}
          src={iframeUrl}
          style={{
            width: 600,
            height: 400,
          }}
          // width={600}
          // height={400}
        ></iframe>
      </div>
      <div id="canvasdom1" style={{ border: '1px solid red' }}></div>
    </div>
  );
};

export default Html2Canvas;
