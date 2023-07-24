const authorId = props.authorId || "manzanal.near";
const accountId = props.accountId;
const label = props.label ?? "DAO";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  gap: 1em;
`;

const Label = styled.div`
  font-style: normal;
  font-weight: 600;
  font-size: 0.95em;
  line-height: 1.25em;
  color: #344054;
`;

return (
  <Container>
    <Label>{label}</Label>
  </Container>
);
