import styled from 'styled-components';

export const LoadingContainer = styled.div`
  height: 100%;
  width: 100%;
  position: fixed;
  backdrop-filter: blur(4px);
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  z-index: 999;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
`;
