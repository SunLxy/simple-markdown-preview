import React from 'react';
import { MarkdownPreviewProps } from '@uiw/react-markdown-preview';
import { MdDataHandle } from './useMdData';
import { BackToUpProps } from '@uiw/react-back-to-top';
import type { CodeBlockData } from '@saqu/loader-md-react-preview/lib/interface';

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
  header?: React.ReactNode
  /**回到顶部操作按钮*/
  backToUpProps?: Omit<BackToUpProps, "element">
  /**
   * 回到顶部操作按钮监听滚动节点
  */
  backToUpElement?: boolean | HTMLElement
  /**样式*/
  style?: React.CSSProperties
  /**markdown组件参数*/
  markdownProps?: Omit<MarkdownPreviewProps, "disableCopy" | "source">
  /**处理*/
  useSimplePreview?: (value: {
    mdData: CodeBlockData,
    loading: boolean,
    $domRef: React.MutableRefObject<HTMLDivElement>
  }) => ({
    leftRender?: React.ReactNode,
    rightRender?: React.ReactNode,
  })
}
