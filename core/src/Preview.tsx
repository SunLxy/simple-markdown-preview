import { useRef, forwardRef, useImperativeHandle } from 'react';
import { Root, Element, RootContent } from 'hast';
import MarkdownPreview from '@uiw/react-markdown-preview';
import { getMetaId, isMeta, getURLParameters } from '@saqu/loader-md-react-preview/lib/utils/utils';
import CodeLayout from 'react-code-preview-layout';
import { useMdData, } from './useMdData';
import BackToUp from '@uiw/react-back-to-top';
import Loading from './Loading';
import { HandleMetaDataReturn, SimplePreviewProps } from "./interface"
import {
  PreviewBase,
  LayoutBase,
  LayoutLeft,
  LayoutRight,
  LayoutContent,
  LayoutFooter,
  LayoutHead,
  LayoutBackToUp
} from "./styles"

const useDefault: SimplePreviewProps["useSimplePreview"] = () => ({
  leftRender: undefined,
  rightRender: undefined,
})

const Preview = CodeLayout.Preview;
const Code = CodeLayout.Code;
const Toolbar = CodeLayout.Toolbar;

export const SimplePreview = forwardRef((props: SimplePreviewProps, ref) => {
  const {
    path, handleMetaData,
    footer,
    backToUpProps,
    backToUpElement = true,
    style,
    header,
    markdownProps,
    useSimplePreview = useDefault
  } = props
  const { components, rehypeRewrite } = markdownProps || {}
  const $dom = useRef<HTMLDivElement>(null);
  const { mdData, loading } = useMdData(path);

  useImperativeHandle(ref, () => $dom.current)

  const { leftRender, rightRender } = useSimplePreview({ mdData, loading, $domRef: $dom })

  return (<PreviewBase style={style} className='simple-preview' >
    {header && <LayoutHead className='simple-preview-layout-head' >{header}</LayoutHead>}
    <LayoutBase className='simple-preview-layout' >
      {leftRender && <LayoutLeft className='simple-preview-layout-left'>{leftRender}</LayoutLeft>}
      <LayoutContent ref={$dom} className='simple-preview-layout-content' >
        <Loading loading={loading} />
        <MarkdownPreview
          {...markdownProps}
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
            rehypeRewrite?.(node, index, parent)
          }}
          components={{
            ...components,
            div: ({ node, ...props }) => {
              const { 'data-meta': meta, 'data-md': metaData, ...rest } = props as any;
              const line = node.position?.start.line;
              const metaId = getMetaId(metaData) || String(line);
              const Child = mdData.components[metaId];
              if (meta !== 'preview' || !metaId || typeof Child !== 'function') {
                return <div {...props} />;
              }
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
      </LayoutContent>
      {rightRender && <LayoutRight className='simple-preview-layout-right' >{rightRender}</LayoutRight>}
    </LayoutBase>
    {footer && <LayoutFooter className='simple-preview-layout-footer' >{footer}</LayoutFooter>}
    <LayoutBackToUp>
      <BackToUp
        style={{ float: 'right' }}
        hideProgress={false}
        {...backToUpProps}
        element={typeof backToUpElement === "boolean" ? backToUpElement && $dom.current || undefined : backToUpElement}
      >Top</BackToUp>
    </LayoutBackToUp>
  </PreviewBase>);
});
