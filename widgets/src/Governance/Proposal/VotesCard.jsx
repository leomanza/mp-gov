const accountId = context.accountId;
const authorId = props.authorId || "manzanal.near";
const contractId = props.contractId;
const accountVotes = props.accountVotes;
console.log('votes', accountVotes)
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0;
  gap: 1em;
  width: 100%;
  padding: 1.25em 0.85em;
  box-shadow: rgba(0, 0, 0, 0.18) 0px 2px 4px;
  border-radius: 16px;
  background: #ffffff;

  & h4 {
    font-family: "Inter";
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    color: #797777;
  }
`;
const Heading = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0px;
  gap: 16px;
  width: 100%;

  & div {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0px;
    gap: 16px;

    & > h2 {
      font-family: "FK Grotesk";
      font-style: normal;
      font-weight: 700;
      font-size: 25px;
      line-height: 36px;
      color: #11181c;
    }

    & > span {
      font-family: "Inter";
      font-style: normal;
      font-weight: 500;
      font-size: 19px;
      line-height: 23px;
      color: #7e868c;
    }
  }
`;

const List = styled.div`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: space-between;
  padding: 0px;
  flex-wrap: wrap;
  width: 100%;
  gap: 1em;
`;
const Item = styled.div`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5em;
  row-gap: 1.25em;
  width: 100%;
  
`;

const AccountVote = styled.div`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5em;
  row-gap: 1.25em;
`;

const VoteMemo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  flex-wrap: wrap;
  row-gap: 0.5em;
`;

const yoctoToNear = (amountYocto) =>
  new Big(amountYocto).div(new Big(10).pow(24)).toFixed(0);
const numberWithCommas = (x) =>
  x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");

if (accountVotes.length == 0) {
  return (
    <Container>
      <Heading><div><h2>Votes</h2></div></Heading>
      <h5>No Votes Casted.</h5>
    </Container>
  )
}

return (
  <Container>
    <Heading><div><h2>Votes</h2></div></Heading>
    <List>{accountVotes.map((item) => (
      <Item>
        <VoteMemo>
          <AccountVote>
            <Widget
              src="mob.near/widget/Profile.ShortInlineBlock"
              props={{ accountId: item.voter_id, tooltip: true }}
            />
            <h5> voted  {item.vote_type}</h5>
          </AccountVote>
          {item.memo != "" && (<h5>memo: {item.memo}</h5>)}
        </VoteMemo>
        <div>  <h5>{numberWithCommas(yoctoToNear(item.voting_power))} VP</h5></div>

      </Item>
    ))}
    </List>
  </Container>
);
