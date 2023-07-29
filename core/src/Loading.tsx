import styled, { css } from 'styled-components';

export const Wrapper = styled.div<{ $loading: boolean }>`
  position: absolute;
  height: 100%;
  width: 100%;
  z-index: 999;
  background: rgba(255,255,255,0.5);
  ${props => !props.$loading && css`
      width: 0px;
      height: 0px;
      z-index: -99;
  `}
`;

export const LoadBox = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translateX(-50%);
`;

const Loading = ({ loading }: { loading?: boolean }) => {
  return (
    <Wrapper $loading={loading} className='simple-loading' >
      {loading && <LoadBox className='simple-loading-content' >Loading...</LoadBox>}
    </Wrapper>
  );
};

export default Loading;
