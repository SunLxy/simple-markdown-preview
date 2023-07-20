# `simple-markdown-preview`

简化`markdown`文档预览代码

## 使用

```tsx
import { SimplePreview } from "simple-markdown-preview"
```

## 案例

```tsx
import React from "react"
import { SimplePreview } from "simple-markdown-preview"

const Demo = ()=>{

  return (<SimplePreview path={() => import("simple-markdown-preview/README.md")} />)

}

export default Demo;

```

## 参数

```ts

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
}

```
