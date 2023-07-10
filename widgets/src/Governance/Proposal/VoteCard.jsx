const accountId = context.accountId;
const authorId = "manzanal.near";
const contractId = "v003.mpip.near";
const META_VOTE_CONTRACT_ID = "meta-vote.near";
const GET_VP_METHOD = "get_all_locking_positions";
const GET_IN_USE_VP_METHOD = "get_used_voting_power";
const proposal = props.proposal;
State.init({
  memo: "",
  memoError: "",
  proposalVotes: null,
  proposalVotesAreFetched: false,
  votingPowerYocto: null,
  votingPower: null,
  votingPowerIsFetched: false,
  votingPowerInUse: null,
  votingPowerInUseIsFetched: false,
  hasVoted: null,
  userVote: null,
  hasVotedIsFetched: false,
  userVoteIsFetched: false
});

const yoctoToNear = (amountYocto) =>
  new Big(amountYocto).div(new Big(10).pow(24)).toFixed(0);

if (!state.proposalVotesAreFetched) {
  Near.asyncView(
    contractId,
    "get_proposal_votes",
    { mpip_id: proposal.mpip_id },
    "final",
    false
  ).then((proposalVotes) => State.update({ proposalVotes, proposalVotesAreFetched: true })
  );
}

if (!state.hasVotedIsFetched) {
  Near.asyncView(
    contractId,
    "has_voted",
    { mpip_id: proposal.mpip_id, voter_id: accountId },
    "final",
    false
  ).then((hasVoted) => State.update({ hasVoted, hasVotedIsFetched: true })
  );
}

if (!state.votingPowerIsFetched) {
  Near.asyncView(META_VOTE_CONTRACT_ID, GET_VP_METHOD, {
    voter_id: context.accountId,
  }, "final", false).then((allLockingPositions) => {
    const votingPower = allLockingPositions.reduce(
      (accumulator, lockingPosition) => accumulator + parseInt(lockingPosition.voting_power),
      0
    );
    const votingPowerYocto = votingPower.toLocaleString('fullwide', { useGrouping: false });
    State.update({ votingPower: yoctoToNear(votingPowerYocto), votingPowerYocto, votingPowerIsFetched: true })
  });
}

if (!state.votingPowerInUseIsFetched) {
  Near.asyncView(contractId, "get_voter_used_voting_power", {
    voter_id: context.accountId,
  }, "final", false).then((votingPowerInUse) =>
    State.update({ votingPowerInUse: yoctoToNear(votingPowerInUse), votingPowerYocto, votingPowerInUseIsFetched: true })
  );
}

if (!state.userVoteIsFetched) {
  Near.asyncView(contractId, "get_my_vote", { mpip_id: proposal.mpip_id, voter_id: accountId }, "final", false).then((userVote) =>
    State.update({ userVote, userVoteIsFetched: true })
  );
}

if (!state.proposalVotesAreFetched || !state.votingPowerIsFetched || !state.hasVotedIsFetched || !state.userVoteIsFetched) return <>Loading...</>

const handleVote = (vote) => {
  // check if user already vote
  if (state.hasVoted) {
    if (state.userVote.vote_type == vote) {
      Near.call([
        {
          contractName: contractId,
          methodName: "remove_vote_proposal",
          args: {
            mpip_id: props.proposal.mpip_id
          },
          gas: 300000000000000,
        },
      ])
    }
  } else {
    Near.call([
      {
        contractName: contractId,
        methodName: "vote_proposal",
        args: {
          mpip_id: props.proposal.mpip_id,
          vote,
          voting_power: state.votingPowerYocto,
          memo: state.memo
        },
        gas: 300000000000000,
      },
    ]);
  }
};

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

const VotesContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  padding: 0;
  gap: 1em;
  width: 100%;
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

const Memo = styled.div`
  display: flex;
  flex-direction: row-reverse;
  justify-content: flex-end;
  padding: 0px;
  width: 75%;
`;
const voted = (type) => {
  // const userVote =
  //   Near.view(
  //     contractId,
  //     "get_my_vote",
  //     { mpip_id: proposal.mpip_id, voter_id: accountId }
  //   )
  return state.userVote.vote_type == type
}

const voteButtonText = state.hasVoted ? "Remove Vote" : "Vote";
const totalVotes = state.proposalVotes.for_votes + state.proposalVotes.againstVotes + state.proposalVotes.abstainVotes;

if (proposal.status != "VotingProcess") {
  return (
    <Container>
      <Heading><div><h2>Vote</h2></div></Heading>
      <h5>Not Open to Voting.</h5>
    </Container>
  )
}

if (!state.hasVoted && (parseInt(state.votingPower) - parseInt(state.votingPowerInUse) <= 0)) {
  return (
    <Container>
      <Heading><div><h2>Vote</h2></div></Heading>
      <h5>Not Enough Voting Power to Vote.</h5>
    </Container>
  )
}

return (
  <Container>
    <Heading><div><h2>Vote</h2></div></Heading>
    <Memo>
      {state.hasVoted ? (<h5>memo: {state.userVote.memo}</h5>) : (<Widget
        src={`${authorId}/widget/Common.Inputs.Text`}
        props={{
          label: "memo",
          placeholder: "Write a memo for your vote (optional)",
          value: state.memo,
          onChange: (memo) => State.update({ memo }),
          validate: () => {
            if (state.memo.length > 40) {
              State.update({
                memoError: "Memo must be less than 40 characters",
              });
              return;
            }
            State.update({ memoError: "" });
          },
          error: state.memoError,
        }}
      />)}
    </Memo>
    <VotesContainer>
      <Widget
        src={`${authorId}/widget/Common.Button`}
        props={{
          disabled: state.hasVoted && !voted("For"),
          children: <><i class="bi bi-envelope-check" />{state.hasVoted && voted("For") ? "Remove Vote For" : "Vote For"}</>,
          onClick: () => handleVote("For"),
          className: "mt-2",
          variant: "primary",
        }}
      />

      <Widget
        src={`${authorId}/widget/Common.Button`}
        props={{
          disabled: state.hasVoted && !voted("Abstain"),
          children: <><i class="bi bi-envelope" />{state.hasVoted && voted("Abstain") ? "Remove Vote Abstain" : "Vote Abstain"}</>,
          onClick: () => handleVote("Abstain"),
          className: "mt-2",
          variant: "primary",
        }}
      />

      <Widget
        src={`${authorId}/widget/Common.Button`}
        props={{
          disabled: state.hasVoted && !voted("Against"),
          children: <><i class="bi bi-envelope-dash" />{state.hasVoted && voted("Against") ? "Remove Vote Against" : "Vote Against"}</>,
          onClick: () => handleVote("Against"),
          className: "mt-2",
          variant: "primary",
        }}
      />
    </VotesContainer>
  </Container>

);