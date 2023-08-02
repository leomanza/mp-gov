const authorId = props.authorId || "manzanal.near";
const contractId = props.contractId;

const availableContent = ["proposals", "voters", "votes"]

const getContent = (content) => {
  if (!content || !availableContent.includes(content)) {
    return availableContent[0];
  }

  return content;
};

const contentSelector = (
  <Widget
    src={`${authorId}/widget/Governance.TabSelector`}
    props={{
      authorId,
      tab: props.tab ?? "home",
      content: getContent(props.content),
      search: props.search,
      update: props.update,
      buttons: [
        {
          id: "proposals",
          text: "Proposals",
        },
        // {
        //   id: "voters",
        //   text: "Voters",
        // },
        // {
        //   id: "votes",
        //   text: "Votes",
        // }
      ],
    }}
  />
);

const content = {
  proposals: (
    <Widget
      src={`${authorId}/widget/Governance.Proposals`}
      props={{ search: state.search, update: props.update, authorId, contractId }}
    />
  ),
  voters: (
    <Widget
      src={`${authorId}/widget/Governance.Voters`}
      props={{ search: state.search, update: props.update, authorId, contractId }}
    />
  ),
  votes: (
    <Widget
      src={`${authorId}/widget/Governance.Votes`}
      props={{ search: state.search, update: props.update, authorId, contractId }}
    />
  ),
}[getContent(props.content)];

const Heading = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  gap: 1.5em;
  margin: 1em 0;
`;

const Title = styled.p`
  font-style: normal;
  font-weight: 700;
  font-size: 1.75em;
  color: #101828;

  @media screen and (max-width: 768px) {
   
      font-size: 1.25em;
  }
    `

const Subtitle = styled.p`
  font-style: normal;
  font-weight: 400;
  font-size: 1.3em;
  line-height: 1.5em;
  color: #475467;

  @media screen and (max-width: 768px) {
      font-size: 1em;
    }
    `
State.init({
  search: "",
});

return (
  <Container>
    <Heading>
      <Title>On-chain voting for Meta Pool Improvement Proposals [MPIPs]</Title>
      <Subtitle>Participate in voting on protocol-wide changes</Subtitle>
    </Heading>

    <div>{contentSelector}</div>
    <div>{content}</div>
  </Container>
);
