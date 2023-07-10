const accountId = context.accountId;
const daoId = props.daoId ?? "metapool.sputnik-dao.near";
const vote_counts = props.proposal.vote_counts ?? {
    // yes, no, abstain
    community: [5, 1, 2],
    council: [2, 4, 9],
};


const yesWin = props.proposal.status === "Approved";
const noWin = props.proposal.status === "Rejected";

let totalYesVotes = 0;
let totalNoVotes = 0;
let totalAbstainVotes = 0;
Object.keys(vote_counts).forEach((key) => {
    totalYesVotes += vote_counts[key][0];
    totalNoVotes += vote_counts[key][1];
    totalAbstainVotes += vote_counts[key][2];
});
const totalVotes = totalYesVotes + totalNoVotes + totalAbstainVotes;

// Styled Components

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


  & h4 {
    font-family: "Inter";
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    color: #797777;
  }
`;

const TextSpan = styled.span`
  font-size: 0.95em;
  color: ${({ active }) => (active ? "#027a48" : "#b54708")};
  display: block;
  margin-left: 0.25em;
  white-space: nowrap;
`;

const Text = styled.p`
  margin: 0;
  line-height: 1.5rem;
  color: ${(p) => (p.bold ? "#11181C" : "#687076")} !important;
  font-weight: 400;
  font-size: ${(p) => (p.small ? "12px" : "14px")};
  overflow: ${(p) => (p.ellipsis ? "hidden" : "")};
  text-overflow: ${(p) => (p.ellipsis ? "ellipsis" : "")};
  white-space: ${(p) => (p.ellipsis ? "nowrap" : "")};
  overflow-wrap: anywhere;

  b {
    font-weight: 600;
    color: #11181c;
  }

  &[href] {
    font-weight: 600;
    color: #006adc !important;
    display: inline-flex;
    gap: 0.25rem;

    &:hover,
    &:focus {
      text-decoration: underline;
    }
  }
`;

const Column = styled.div`
  display "inline-block"
`;

const Row = styled.div`
display: flex;
flex-direction: row;
align-items: center;
justify-content: flex-start;
gap: 0.5em;
`;

const Items = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0.5em 0px 0px;
  gap: 1em;
  flex: none;
  order: 4;
  align-self: stretch;
  flex-grow: 0;
`;

const Item = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px;
  gap: 0.4em;
  flex: none;
  order: 1;
  flex-grow: 0;
  font-style: normal;
  font-weight: 500;
  font-size: 0.75em;
  line-height: 1em;
  color: #11181c;
`;

const Tagline = styled.div`
font-style: normal;
font-weight: 400;
font-size: 0.75em;
line-height: 1em;
color: #11181c;
`;

const Icon = styled.i`
  background-color: ${({ votesFor }) => (votesFor == "yes" ? "#12b76a" : votesFor == "no" ? "#f79009" : "#ffda09")};
  border-radius: 100%;
  width: 0.6em;
  height: 0.6em;
`;

return (
    <Container>
        <Items>
        <Item>
            <Icon votesFor="yes" />
            <Text>Yes {totalYesVotes*100/ totalVotes} %</Text>
        </Item>
        <Item>
            <Icon votesFor="no" />
            <Text>No {totalNoVotes*100/totalVotes}%</Text>
        </Item>
        <Item>
            <Icon votesFor="abstain" />
            <Text>Abstain {totalAbstainVotes*100/totalVotes}%</Text>
        </Item>
        </Items>
    </Container>
);
