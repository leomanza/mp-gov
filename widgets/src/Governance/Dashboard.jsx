const authorId = "manzanal.near";

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
      props={{ search: state.search, update: props.update }}
    />
  ),
  voters: (
    <Widget
      src={`${authorId}/widget/Governance.Voters`}
      props={{ search: state.search, update: props.update }}
    />
  ),
  votes: (
    <Widget
      src={`${authorId}/widget/Governance.Votes`}
      props={{ search: state.search, update: props.update }}
    />
  ),
}[getContent(props.content)];

const Heading = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;

  h1 {
    font-style: normal;
    font-weight: 700;
    font-size: 2em;
    color: #101828;
  }

  h2 {
    font-style: normal;
    font-weight: 400;
    font-size: 1em;
    line-height: 1.5em;
    color: #475467;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  gap: 1.5em;

  h2 {
    font-style: normal;
    font-weight: 400;
    font-size: 1.3em;
    line-height: 1.5em;
    color: #475467;
  }
`;

const Stats = styled.div`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: flex-start;
  flex-wrap: wrap;
  gap: 0.5em;
  margin: 1em 0;

  div {
    width: 18%;
  }

  @media (max-width: 768px) {
    div {
      width: 100%;
    }
  }

  @media (max-width: 1024px) {
    div {
      width: 49%;
    }
  }
`;

State.init({
  search: "",
});

return (
  <Container>
    <Heading>
      <h1>On-chain voting for Meta Pool Improvement Proposals [MPIPs]</h1>
      <h2>Participate in voting on protocol-wide changes</h2>
    </Heading>

    <div>{contentSelector}</div>
    <div>{content}</div>
  </Container>
);
