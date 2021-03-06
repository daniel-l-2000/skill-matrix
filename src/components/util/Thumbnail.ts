import styled, { StyledComponent } from "styled-components";

const Thumbnail: StyledComponent<
  "img",
  any,
  { maxSize: string },
  never
> = styled.img`
  max-width: ${(props) => (props as any).maxSize};
  max-height: ${(props) => props.maxSize};
`;

export default Thumbnail;
