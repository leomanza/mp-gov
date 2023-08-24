const accountId = props.accountId ?? context.accountId;
const authorId = "manzanal.near";
const onClose = props.onClose;
const edit = props.edit;
const mpip_id = props.mpip_id ?? null;
const update = props.update;
const transactionHashes = props.transactionHashes;
const title = props.edit ? "Edit proposal" : "Create Proposal";
const META_VOTE_CONTRACT_ID = "meta-vote.near";
const contractId = props.contractId || "v006.mpip.near";
State.init({
  openModal: false,
  allVotingPower: null,
  allVotingPowerIsFetched: false,
  proposalThresholdReached: false,
  proposalThresholdReachedIsFetched: false,
});
const yoctoToNear = (amountYocto) =>
  new Big(amountYocto).div(new Big(10).pow(24)).toFixed(0);

if (!state.allVotingPowerIsFetched) {
  Near.asyncView(
    META_VOTE_CONTRACT_ID,
    "get_all_locking_positions",
    { voter_id: context.accountId },
    "final",
    false
  ).then((allLockingPositions) => {
    const voting_power = allLockingPositions.reduce(
      (accumulator, lockingPosition) =>
        lockingPosition.is_locked
          ? accumulator + parseInt(lockingPosition.voting_power)
          : accumulator,
      0
    );
    const votingPowerYocto = voting_power.toLocaleString("fullwide", {
      useGrouping: false,
    });
    State.update({
      allVotingPower: yoctoToNear(voting_power),
      allVotingPowerIsFetched: true,
      allVotingPowerYocto:    yoctoToNear(votingPowerYocto) + "000000000000000000000000",
    });
  });
}

if (state.allVotingPowerIsFetched && !state.proposalThresholdReachedIsFetched) {
  Near.asyncView(
    contractId,
    "check_proposal_threshold",
    { voting_power:  state.allVotingPowerYocto },
    "final",
    false
  ).then((passed) => {
    State.update({
      proposalThresholdReached: passed,
      proposalThresholdReachedIsFetched: true,
    });
  });
}

const Wrapper = styled.div`
  margin: 16px auto;
  width: 100%;
  max-width: 900px;
  max-height: 100%;
  background-color: #fff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: rgba(0, 0, 0, 0.18) 0px 2px 4px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  overflow-y: auto;

  @media (max-width: 600px) {
    border-radius: 0;
  }

  p {
    line-height: 1.4;
    font-weight: 400;
    font-size: 15px;
    color: #868682;
    margin: 0;
  }

  h3 {
    font-weight: 600;
    font-size: 24px;
    color: #1b1b18;
  }

  h5 {
    font-size: 12px;
    font-weight: 400;
    line-height: 1.2;
    color: #6c757d;
  }
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgb(27, 27, 24);
  border-radius: 100px;
  height: 40px;
  width: 40px;
  border: none;
  margin: 0;
  font-size: 26px;
  background-color: rgb(246, 246, 245);

  &:hover {
    background-color: rgb(243, 243, 242);
    color: rgb(0, 0, 0);
  }
`;

const FormHeader = styled.h3`
box-sizing: border-box;
display: flex;
flex-direction: row;
align-items: flex-start;
padding: 0px 0px 0.5em;
border-bottom: 1px solid #eceef0;
font-style: normal;
font-weight: 700;
font-size: 1.125em;
line-height: 1.25em;
color: #000000;
width: 100%;
`;

if (transactionHashes) {
  const statusResult = fetch("https://rpc.mainnet.near.org", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: "dontcare",
      method: "tx",
      params: [transactionHashes, accountId],
    }),
  });
  //check status and open modal

  if (
    statusResult.body.result.status &&
    Object.keys(statusResult.body.result.status)[0] == "SuccessValue"
  ) {
    State.update({ openModal: true });
    update({ transactionHashesIsHandled: true });
  }
}

if (!state.allVotingPowerIsFetched || !state.proposalThresholdReachedIsFetched) return <>Loading</>;

if (!state.proposalThresholdReached) return <>Proposal threshold is not reached. You are not able to create proposals</>

return (
  <Wrapper>
    <Widget
      src={`${authorId}/widget/Common.Modal.RedirectModal`}
      props={{
        open: state.openModal,
        accept: () =>
          update({
            tab: "home",
          }),
      }}
    />
    <div className="d-flex justify-content-between align-items-center">
      <FormHeader>{title}</FormHeader>
    </div>
    <div className="d-flex flex-column gap-2">
      <Widget
        src={`${authorId}/widget/Governance.Proposal.Create.Text`}
        props={{ edit, mpip_id, update }}
      />
    </div>
  </Wrapper>
);
