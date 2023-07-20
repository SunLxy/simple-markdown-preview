import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import { Root, Element, RootContent } from 'hast';
import styled from 'styled-components';
import MarkdownPreview, {
  MarkdownPreviewProps, MarkdownPreviewRef,
} from '@uiw/react-markdown-preview';
import type { Options } from "react-markdown"
import { getMetaId, isMeta, getURLParameters } from '@saqu/loader-md-react-preview/lib/utils/utils';
import CodeLayout from 'react-code-preview-layout';
import { useMdData, MdDataHandle } from './useMdData';
import BackToUp, { BackToUpProps } from '@uiw/react-back-to-top';
import Loading from './Loading';

const Preview = CodeLayout.Preview;
const Code = CodeLayout.Code;
const Toolbar = CodeLayout.Toolbar;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const BaseContent = styled.div`
  width: 1024px;
  margin: 0 auto;
`

const Markdown = styled<
  React.ForwardRefExoticComponent<
    MarkdownPreviewProps & {
      loading?: string;
    } & React.RefAttributes<MarkdownPreviewRef>
  >
>(MarkdownPreview)`
  padding: 20px 30px 120px 30px;
  max-width: 1336px;
  &::after,
  &::before {
    content: none;
  }
`;

export interface HandleMetaDataReturn {
  /**react-code-preview-layout 组件属性*/
  layout?: Record<string, string>
  /**react-code-preview-layout Preview 组件属性*/
  preview?: Record<string, string>
  /**react-code-preview-layout Code 组件属性*/
  code?: Record<string, string>
  /**react-code-preview-layout Toolbar 组件属性*/
  toolbar?: Record<string, string>
}

export interface SimplePreviewProps {
  /**加载文档地址*/
  path: MdDataHandle,
  /**处理数值*/
  handleMetaData?: (value: Record<string, string>) => HandleMetaDataReturn
  /**底部内容区域*/
  footer?: React.ReactNode
  /**回到顶部操作按钮*/
  backToUpProps?: Omit<BackToUpProps, "element">
  /**
   * 回到顶部操作按钮监听滚动节点
  */
  backToUpElement?: boolean | HTMLElement
  components?: Options['components']
}

export const SimplePreview = forwardRef((props: SimplePreviewProps, ref) => {
  const { path, handleMetaData, footer, backToUpProps, backToUpElement, components } = props
  const $dom = useRef<HTMLDivElement>(null);
  const { mdData, loading } = useMdData(path);

  useImperativeHandle(ref, () => $dom.current)

  return (
    <Wrapper ref={$dom} className='simple-preview' >
      <Loading loading={loading}>
        <BaseContent className='simple-preview-content' >
          <Markdown
            className='simple-preview-markdown'
            disableCopy={true}
            source={mdData.source}
            rehypeRewrite={(
              node: Root | RootContent,
              index: number,
              parent: Root | Element,
            ) => {
              if (node.type === 'element' && parent && parent.type === 'root') {
                const menu = parent.children[1] as Element | undefined;
                let childLength = [...parent.children].filter(
                  (item) => item.type !== 'raw',
                ).length;
                const lastChild = parent.children[parent.children.length - 1];
                if (lastChild?.type === 'raw') {
                  childLength = parent.children.length - 2;
                }
                if (
                  (index + 1 === childLength ||
                    index - 1 === childLength ||
                    index === childLength) &&
                  menu?.properties?.class !== 'menu-toc'
                ) {
                  const child = [...parent.children].map((item) => {
                    if (item.type === 'element' && item.tagName === 'pre') {
                      const meta = item.children[0]?.data?.meta as string;
                      if (isMeta(meta)) {
                        item.tagName = 'div';
                        item.properties = {
                          ...item.properties,
                          'data-md': meta,
                          'data-meta': 'preview',
                        };
                        return { ...item };
                      }
                    }
                    return item;
                  });
                  parent.children = [
                    {
                      type: 'element',
                      tagName: 'div',
                      children: child as Element[],
                    },
                  ];
                }
              }
            }}
            components={{
              ...components,
              div: ({ node, ...props }) => {
                const { 'data-meta': meta, 'data-md': metaData, ...rest } = props as any;
                const line = node.position?.start.line;
                const metaId = getMetaId(metaData) || String(line);
                const Child = mdData.components[metaId];
                if (meta !== 'preview' || !metaId || typeof Child !== 'function')
                  return <div {...props} />;
                const code = mdData.data[metaId].value || '';
                const param = getURLParameters(metaData);
                let newParams: HandleMetaDataReturn = {}
                if (typeof handleMetaData === "function") {
                  const result = handleMetaData(param);
                  if (result) {
                    newParams = result;
                  }
                }
                return (
                  <CodeLayout {...newParams?.layout}>
                    <Preview {...newParams?.preview}><Child /></Preview>
                    <Toolbar {...newParams?.toolbar} text={code}>{param.title || '示例'}</Toolbar>
                    <Code {...newParams?.code}><pre {...rest} /></Code>
                  </CodeLayout>
                );
              },
            }}
          />
        </BaseContent>
      </Loading>
      <BackToUp style={{ float: 'right' }} {...backToUpProps} element={typeof backToUpElement === "boolean" ? backToUpElement && $dom.current || undefined : backToUpElement} >Top</BackToUp>
      {footer}
    </Wrapper>
  );
});
