import styled from "styled-components";

export const Thumbnail = styled.img`
  max-width: ${(props) => props.maxSize};
  max-height: ${(props) => props.maxSize};
`;
