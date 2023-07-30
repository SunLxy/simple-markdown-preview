import styled from "styled-components"


export const PreviewBase = styled.div`
  width:100% ;
  height:100% ;
  position: relative;
  display: flex;
  flex-direction: column;
`

export const LayoutBase = styled.div`
  height: 100%; 
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: flex-start;
  flex: 1;

`
export const LayoutLeft = styled.div`
  position: sticky;
  top: 0px;
  left: 0px;
  z-index: 999;
`

export const LayoutContent = styled.div`
  flex: 1;
  height: 100%;
  overflow: auto;
  &::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 5px;
    background: #00000038;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: #595959;
  }
`

export const LayoutRight = styled.div`
  position: sticky;
  top: 0px;
  right: 0px;
  z-index: 999;
`

export const LayoutHead = styled.div`
  position: sticky;
  top: 0px;
  z-index: 9999;
`

export const LayoutFooter = styled.div``
export const LayoutBackToUp = styled.div`
  width: 100%;
  position: absolute;
  bottom: 20px;

`