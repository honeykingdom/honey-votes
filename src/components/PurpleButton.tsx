import styled from '@emotion/styled';
import { Button, darken } from '@mui/material';

const PurpleButton = styled(Button)`
  background-color: #6441a5;

  &:hover {
    background-color: ${darken('#6441a5', 0.1)};
  }

  &:active {
    background-color: ${darken('#6441a5', 0.2)};
  }
`;

export default PurpleButton;
