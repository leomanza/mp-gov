let yesVotes = props.yesVotes ?? 0;
let noVotes = props.noVotes ?? 0;
let abstainVotes = props.abstainVotes ?? 0
const quorum = props.quorum;
const onVotingPeriod = props.onVotingPeriod;
const isQuorumReached = props.isQuorumReached;
const isProposalSucceeded= props.isProposalSucceeded;
const hasEnded = new Date().getTime() > Number(endDate);
const yoctoToNear = (amountYocto) =>
  parseInt(new Big(amountYocto).div(new Big(10).pow(24)));

const numberWithCommas = (x) =>
  x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");

yesVotes = yoctoToNear(yesVotes);
noVotes = yoctoToNear(noVotes)
abstainVotes = yoctoToNear(abstainVotes);
const totalVotes = yesVotes + noVotes + abstainVotes;

const getProposalCompletionStatus = () => {
  if (isQuorumReached && hasEnded) {
    return isProposalSucceeded ? "Proposal Succeeded" : "Proposal Rejected"
  } 
}

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

const Values = styled.div`
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

    & > h3 {
      font-family: "Inter";
      font-style: normal;
      font-weight: 600;
      font-size: 17px;
      line-height: 20px;
      color: #11181c;
    }

    & > h4 {
      font-family: "Inter";
      font-style: normal;
      font-weight: 500;
      font-size: 14px;
      line-height: 20px;
      color: #797777;
    }

    & > span {
      font-family: "Inter";
      font-style: normal;
      font-weight: 500;
      font-size: 19px;
      line-height: 23px;
      color: #7e868c;
    }
    & > div {
      display: flex;
      flex-direction: column;
      align-items: start;
      padding: 0px;
      gap: 1px;
      .yes {
        color: #42A174;
      }
      .no {
        color: #FF6369;
      }
      .abstain{
        color: #FFBF00;
      }
    }
  }
  `;

const ProgressContainer = styled.div`
  border-radius: 20px;
  border: none;
  display: flex;
  padding: 0;
  position: relative;
  background: #f3f3f2;
  width: 100%;
  margin-bottom: 14px;

  .bar {
    border-radius: 0px;
    padding: 12px 20px;
    text-align: left;
    font-weight: 600;
    font-size: 15px;
    transition: all 0.4s ease-in-out;
    text-align: center;
    display: flex;
    justify-content: center;
    color: #000;
    min-width: 0;
    @media (max-width: 600px) {
      justify-content: start;
    }
  }
  
  .bar.yes {
      background-color: #42A174;
      min-width: 0;
      width: ${(yesVotes / totalVotes) * 100 || 0}%;
  }
  .bar.no {
    background-color: #FF6369;
    min-width: 0;
      width: ${(noVotes / totalVotes) * 100 || 0}%;
  }
  .bar.abstain {
      background-color: #FFBF00;
      min-width: 0;
      width: ${(abstainVotes / totalVotes) * 100 || 0}%;
  }
`;

return (
  <Container>
    <Heading><div><h2>Voting Results</h2></div></Heading>
    <Values>
      <div>
        <div>
          <h4>For {numberWithCommas(yesVotes)}VP</h4>
          <h3 className="yes">
            {yesVotes ? (yesVotes * 100 / (yesVotes + noVotes + abstainVotes)).toFixed(2) : "0"}%
          </h3>

        </div>
      </div>

      <div>
        <div>
          <h4>Abstain {numberWithCommas(abstainVotes)}VP</h4>
          <h3 className="abstain">
            {abstainVotes ? (abstainVotes * 100 / (yesVotes + noVotes + abstainVotes)).toFixed(2) : "0"}%
          </h3>
        </div>
      </div>
      <div>
        <div >
          <h4>Against {numberWithCommas(noVotes)}VP</h4>
          <h3 className="no">
            {noVotes ? (noVotes * 100 / (yesVotes + noVotes + abstainVotes)).toFixed(2) : "0"}%
          </h3>
        </div>
      </div>
    </Values>
    <ProgressContainer>
      {yesVotes > 0 && <span className="bar yes"></span>}
      {abstainVotes > 0 && <span className="bar abstain d-inline-block text-truncate"></span>}
      {noVotes > 0 && <span className="bar no"></span>}
    </ProgressContainer>
    <h4>Quorum: {quorum ? (numberWithCommas(yoctoToNear(quorum).toFixed(0)) +  "VP / "  + numberWithCommas(totalVotes) + "VP") : "-"}</h4>
    <h4>{getProposalCompletionStatus()}</h4>
  </Container>
);