import React from 'react';
import styled from 'styled-components';

export const Wrapper = styled.div`
  position: relative;
`;

export const LoadBox = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 200px;
`;

const Loading = ({
  children,
  loading,
}: {
  children: React.ReactNode;
  loading?: boolean;
}) => {
  return (
    <Wrapper className='simple-loading' >
      {children}
      {loading && <LoadBox className='simple-loading-content' >Loading...</LoadBox>}
    </Wrapper>
  );
};

export default Loading;
