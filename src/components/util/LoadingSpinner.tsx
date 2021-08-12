import Backdrop from "./Backdrop";
import styled from "styled-components";

const LoadingSpinnerDiv = styled.div`
  display: inline-block;
  position: relative;
  box-sizing: border-box;
  width: 80px;
  height: 80px;
  left: calc(50% - 40px);
  top: calc(50% - 40px);

  & div {
    box-sizing: border-box;
    position: absolute;
    border: 4px solid currentColor;
    opacity: 1;
    border-radius: 50%;
    animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
  }

  & div:nth-child(2) {
    animation-delay: -0.5s;
  }

  @keyframes lds-ripple {
    0% {
      top: 36px;
      left: 36px;
      width: 8px;
      height: 8px;
      opacity: 1;
    }
    100% {
      top: 0;
      left: 0;
      width: 80px;
      height: 80px;
      opacity: 0;
    }
  }
`;

function LoadingSpinner() {
  return (
    <Backdrop>
      <LoadingSpinnerDiv>
        <div></div>
        <div></div>
      </LoadingSpinnerDiv>
    </Backdrop>
  );
}

export default LoadingSpinner;
