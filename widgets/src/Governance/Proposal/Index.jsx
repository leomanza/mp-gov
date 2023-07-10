const contractId = "v003.mpip.near";
const accountId = props.accountId ?? context.accountId;
const authorId = "manzanal.near";
const META_VOTE_CONTRACT_ID = "meta-vote.near";
const mpip_id = props.mpip_id ? parseInt(props.mpip_id) : null;
if (mpip_id == null)
  return "Proposal Id not defined"

const commentItemIndex = { contractId, mpip: `MPIP-${mpip_id}` };

State.init({
  proposal: {},
  proposalIsFetched: false,
  status: null,
  statusIsFetched: false,
  proposalVotes: {},
  proposalVotesAreFetched: false,
  proposalIsEditable: false,
  proposalIsEditableIsFetched: false,
  isQuorumReached: false,
  isQuorumReachedIsFetched: false,
  isProposalSucceeded: false,
  isProposalSucceededIsFetched: false,
  isProposalActiveOrDraft: false,
  isProposalActiveOrDraftIsFetched: false,
  showReply: false,
  totalVotingPower: null,
  totalVotingPowerIsFetched: false
});

if (!state.proposalIsFetched) {
  Near.asyncView(
    contractId,
    "get_proposal",
    { mpip_id },
    "final",
    false
  ).then((proposal) => State.update({ proposal, proposalIsFetched: true })
  );
}

if (!state.statusIsFetched) {
  Near.asyncView(
    contractId,
    "get_proposal_state",
    { mpip_id },
    "final",
    false
  ).then((status) => State.update({ status, statusIsFetched: true })
  );
}

if (!state.proposalVotesAreFetched) {
  Near.asyncView(
    contractId,
    "get_proposal_votes",
    { mpip_id },
    "final",
    false
  ).then((proposalVotes) => State.update({ proposalVotes, proposalVotesAreFetched: true })
  );
}

if (!state.proposalIsEditableIsFetched) {
  Near.asyncView(
    contractId,
    "get_proposal_is_active_or_draft",
    { mpip_id },
    "final",
    false
  ).then((proposalIsEditable) => State.update({ proposalIsEditable, proposalIsEditableIsFetched: true })
  );

}

if (!state.isQuorumReachedIsFetched) {
  Near.asyncView(
    contractId,
    "get_quorum_reached",
    { mpip_id },
    "final",
    false
  ).then((isQuorumReached) => State.update({ isQuorumReached, isQuorumReachedIsFetched: true })
  );
}

if (!state.isProposalSucceededIsFetched) {
  Near.asyncView(
    contractId,
    "get_proposal_vote_succeeded",
    { mpip_id },
    "final",
    false
  ).then((isProposalSucceeded) => State.update({ isProposalSucceeded, isProposalSucceededIsFetched: true })
  );
}

if (!state.totalVotingPowerIsFetched) {
  Near.asyncView(
    META_VOTE_CONTRACT_ID,
    "get_total_voting_power",
    {},
    "final",
    false
  ).then((totalVotingPower) => State.update({ totalVotingPower, totalVotingPowerIsFetched: true })
  );
}

if (!state.isProposalActiveOrDraftIsFetched) {
  Near.asyncView(
    contractId,
    "get_proposal_is_active_or_draft",
    { mpip_id },
    "final",
    false
  ).then((isProposalActiveOrDraft) => State.update({ isProposalActiveOrDraft, isProposalActiveOrDraftIsFetched: true })
  );
}

const onVotingPeriod = () => state.status == "VotingProcess";

const formatStatus = (status) => {
  switch (status) {
    case 'VotingProcess': return "IN PROGRESS";
    case 'Draft': return "DRAFT";
    case 'Active': return "ACTIVE";
    case "Accepted": return "SUCCEEDED";
    case "Rejected": return "REJECTED";
    case "Canceled": return "CANCELED"
  }
}

// ==============================
// Styled Components
// ==============================

const statusColor =
  state.status === "Accepted" || state.status == "Executed"
    ? "#28a930"
    : state.status === "VotingProcess"
      ? "#58a1ff"
      : state.status === "Rejected" || state.status == "Canceled"
        ? "#dc3545"
        : "#6c757d";

const Container = styled.div`
  width:100%;
  display: flex;
  flex-direction: row;
  gap: 24px;
  min-height: 500px;

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
    font-size: 14px;
    font-weight: 500;
    line-height: 1.2;
    color: #6c757d;
  }

  .status {
    font-size: 14px;
    font-weight: 600;
    line-height: 1.2;
    color: ${statusColor};
  }
`;
const WrapperLeft = styled.div`
  margin: 16px auto;
  width:100%;
  background-color: #fff;
  padding: 24px;
  box-shadow: rgba(0, 0, 0, 0.18) 0px 2px 4px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-height: 500px;

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
    font-size: 14px;
    font-weight: 500;
    line-height: 1.2;
    color: #6c757d;
  }

  .status {
    font-size: 14px;
    font-weight: 600;
    line-height: 1.2;
    color: ${statusColor};
  }
`;

const WrapperRight = styled.div`
  margin: 16px auto;
  width:100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-height: 500px;

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
    font-size: 14px;
    font-weight: 500;
    line-height: 1.2;
    color: #6c757d;
  }

  .status {
    font-size: 14px;
    font-weight: 600;
    line-height: 1.2;
    color: ${statusColor};
  }
`;

const MarkdownContainer = styled.div`
  position: relative;
  width: 100%;
  padding: 24px;
  background-color: #f8f9fa;
  color: #1b1b18;
  border-radius: 16px;
  max-height: 700px;
  overflow-y: auto;
  color: #333;
  line-height: 1.6;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px;

  h1 {
    font-size: 2em;
    color: #111;
    border-bottom: 1px solid #ccc;
    padding-bottom: 0.3em;
    margin-bottom: 1em;
  }

  h2 {
    font-size: 1.5em;
    color: #222;
    margin-bottom: 0.75em;
  }

  h3 {
    font-size: 1.3em;
    color: #333;
    margin-bottom: 0.6em;
  }

  h4 {
    font-size: 1.2em;
    color: #444;
    margin-bottom: 0.5em;
  }

  h5 {
    font-size: 1.1em;
    color: #555;
    margin-bottom: 0.4em;
  }

  p {
    font-size: 1em;
    margin-bottom: 1em;
  }

  a {
    color: #0645ad;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }
`;


const BackButton = styled.button`
  border: none;
  background: none;
  color: #7e868c;
  transform: translate(1em, -1em);
`;

const onStartVotingButtonClick = () => {
  Near.call([
    {
      contractName: contractId,
      methodName: "start_voting_period",
      args: {
        mpip_id
      },
      gas: 300000000000000,
    },
  ]);
}

const onCancelButtonClick = () => {
  Near.call([
    {
      contractName: contractId,
      methodName: "cancel_proposal",
      args: {
        mpip_id
      },
      gas: 300000000000000,
    },
  ]);
}

const isProposalCreator = () => {
  return state.proposal.creator_id == accountId;
}

if (!state.proposalIsFetched || !state.statusIsFetched || !state.proposalVotesAreFetched || !state.proposalIsEditableIsFetched) return <>Loading...</>;

return (
  <Container>
    <WrapperLeft>
      {state.proposalIsEditable && isProposalCreator() && (<div className="ms-auto">
        <Widget
          src={`${authorId}/widget/Common.Button`}
          props={{
            children: <><i class="bi bi-pencil-square" />Edit</>,
            onClick: () => State.update({ mpip_id }),
            className: "mt-2",
            variant: "primary",
            href: `/${authorId}/widget/Governance.Proposal.Create.Index?edit=true&mpip_id=${mpip_id}`
          }}
        />
        <Widget
          src={`${authorId}/widget/Common.Button`}
          props={{
            children: <><i class="bi bi-trash" />Cancel</>,
            onClick: () => () => onCancelButtonClick(),
            className: "mt-2",
            variant: "primary",
          }}
        />
        <Widget
          src={`${authorId}/widget/Common.Button`}
          props={{
            children: <><i class="bi bi-envelope-open" />Start Voting</>,
            onClick: () => onStartVotingButtonClick(),
            className: "mt-2",
            variant: "primary",
          }}
        />
      </div>)}

      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h5>Proposal ID: {state.proposal.mpip_id}</h5>
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <span className="status">{formatStatus(state.status)}</span>
        </div>
      </div>

      <div className="d-flex flex-row gap-1 justify-content-between">
        <h3>{state.proposal.title}</h3>
      </div>
      <div>
        <h4>{state.proposal.short_description}</h4>
      </div>
      <div className="d-flex flex-row gap-1 align-items-center">
        <h5>by </h5>
        <Widget
          src="mob.near/widget/Profile.ShortInlineBlock"
          props={{ accountId: state.proposal.creator_id, tooltip: true }}
        />
      </div>
      <div>
        <h5>Description</h5>
        <p>{state.proposal.body}</p>

      </div>
      <div
        className="d-flex flex-wrap align-items-start"
        style={{
          rowGap: "16px",
          columnGap: "48px",
        }}
      >
      </div>
      <Widget
        src={`${authorId}/widget/Governance.Proposal.DiscussionCard`}
        props={{
          commentsOpen: state.isProposalActiveOrDraft,
          blockHeight: blockHeight,
          onCommentButtonClick: () => State.update({ showReply: !state.showReply }),
          onComment: () => State.update({ showReply: false }),
          showReply: state.showReply,
          commentItemIndex: commentItemIndex,
          highlightComment: props.highlightComment,
          commentsLimit: props.commentsLimit,

        }}
      />
    </WrapperLeft>
    <WrapperRight>
      {accountId && (<div className="w-100">
        <Widget
          src={`${authorId}/widget/Governance.Proposal.VoteCard`}
          props={{
            proposal: { ...state.proposal, status: state.status }
          }}
        />
      </div>)}

      <div className="w-100">
        <Widget
          src={`${authorId}/widget/Governance.Proposal.VotingPeriodCard`}
          props={{
            startDate: state.proposal.vote_start_timestamp, endDate: state.proposal.vote_end_timestamp
          }}
        />
      </div>
      <div className="w-100">
        <Widget
          src={`${authorId}/widget/Governance.Proposal.VotingResultsCard`}
          props={{
            yesVotes: state.proposalVotes.for_votes,
            noVotes: state.proposalVotes.against_votes,
            abstainVotes: state.proposalVotes.abstain_votes,
            quorum: state.proposal.v_power_quorum_to_reach,
            isQuorumReached: state.isQuorumReached,
            isProposalSucceeded: state.isProposalSucceeded,
            onVotingPeriod
          }}
        />
      </div>
      <div className="w-100">
        <Widget
          src={`${authorId}/widget/Governance.Proposal.VotesCard`}
          props={{
            accountVotes: state.proposalVotes.has_voted
          }}
        />
      </div>
    </WrapperRight>
  </Container>
);
