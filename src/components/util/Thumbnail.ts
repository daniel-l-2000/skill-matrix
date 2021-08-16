import styled from "styled-components";

const Thumbnail = styled.img`
  max-width: ${(props) => props.maxSize};
  max-height: ${(props) => props.maxSize};
`;

export default Thumbnail;
