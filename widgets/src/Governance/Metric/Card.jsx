const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1em;
  padding: 1.25em 0.85em;
  background-color: #ECEEF0;
  border-radius: 16px;
`;

const Value = styled.span`
  font-style: normal;
  font-weight: 700;
  font-size: 0.975rem;
  line-height: 1em;
  text-align: center;
  color: #000;
`;

const Label = styled.span`
  font-style: normal;
  font-weight: 600;
  font-size: 0.875rem;
  line-height: 1em;
  text-align: center;
  color: #4a5568;
`;

return (
  <Container>
    <Value>{props.value}</Value>
    <Label data-toggle="tooltip" data-placement="bottom" title={props.tooltip} >{props.label}</Label>
  </Container>
);
