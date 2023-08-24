const accountId = props.accountId ?? context.accountId;
const contractId = props.contractId || "v006.mpip.near";
const META_VOTE_CONTRACT_ID = "meta-vote.near";
const authorId = props.authorId || "manzanal.near";
const proposalsPerPage = props.proposalsPerPage ?? 100; // Number of proposals to fetch at a time

State.init({
  contractId,
  proposals: [],
  proposalsAreFetched: false,
  lastProposalId: null, // To keep track of the last loaded proposal
  lastProposalIdIsFetched: false,
  hasMore: true, // Boolean to know if there are more proposals to load
  showCreateProposal: false,
  quorum: null,
  quorumIsFetched: false,
  threshold: null,
  thresholdIsFetched: false,
  voters: null,
  votersAreFetched: false,
  totalHolders: null,
  totalHoldersIsFetched: false,
  totalVotingPower: null,
  totalVotingPowerIsFetched: false,
});

const yoctoToNear = (amountYocto) =>
  new Big(amountYocto).div(new Big(10).pow(24)).toFixed(0);

const numberWithCommas = (x) =>
  x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");

const loadProposals = () => {
  // Prevents multiple calls to loadProposals() before the first call is finished
  if (state.proposals.length > 0 && state.proposals[0].id === lastProposalId)
    return;

  const fromIndex = Math.max(0, lastProposalId - proposalsPerPage + 1); // Ensures fromIndex is never less than 0
  const limit = fromIndex === 0 ? lastProposalId + 1 : proposalsPerPage; // Ensure we don't fetch the same proposals twice if fromIndex is 0

  const newProposals = Near.view(contractId, "get_proposals", {
    from_index: fromIndex,
    limit: limit,
  });
  if (newProposals === null) return;

  State.update({
    ...state,
    hasMore: fromIndex > 0,
    proposals: [...state.proposals, ...newProposals.reverse()],
    filteredData: [...state.proposals, ...newProposals.reverse()],
    lastProposalId: fromIndex - 1,
    isLoading: false,
  });
};

const onChangeData = (_data) => {
  State.update({ filteredData: _data.result });
};

if (!state.totalVotingPowerIsFetched) {
  Near.asyncView(
    META_VOTE_CONTRACT_ID,
    "get_total_voting_power",
    {},
    "final",
    false
  ).then((totalVotingPower) =>
    State.update({ totalVotingPower, totalVotingPowerIsFetched: true })
  );
}

if (!state.lastProposalIdIsFetched) {
  Near.asyncView(contractId, "get_last_proposal_id", {}, "final", false).then(
    (lastProposalId) =>
      State.update({ lastProposalId, lastProposalIdIsFetched: true })
  );
}

if (!state.proposalsAreFetched) {
  Near.asyncView(
    contractId,
    "get_proposals",
    { from_index: 0, limit: proposalsPerPage },
    "final",
    false
  ).then((proposals) => {
    console.log("proposals", proposals);
    State.update({ proposals, proposalsAreFetched: true });
  });
}

if (!state.quorumIsFetched) {
  Near.asyncView(contractId, "get_quorum_floor", {}, "final", false).then(
    (quorum) =>
      State.update({ quorum: parseInt(quorum), quorumIsFetched: true })
  );
}

if (!state.thresholdIsFetched) {
  Near.asyncView(contractId, "get_proposal_threshold", {}, "final", false).then(
    (threshold) =>
      State.update({
        threshold: yoctoToNear(threshold),
        thresholdIsFetched: true,
      })
  );
}

if (!state.votersAreFetched) {
  Near.asyncView(contractId, "get_total_voters", {}, "final", false).then(
    (voters) =>
      State.update({ voters: parseInt(voters), votersAreFetched: true })
  );
}

if (!state.totalHoldersIsFetched) {
  Near.asyncView(
    META_VOTE_CONTRACT_ID,
    "get_voters_count",
    {},
    "final",
    false
  ).then((totalHolders) => {
    console.log("total holders", totalHolders);
    State.update({
      totalHolders: parseInt(totalHolders),
      totalHoldersIsFetched: true,
    });
  });
}

const ListContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5em;
  row-gap: 1.25em;
  width: 100%;

  & > div {
    display: flex;
    flex-direction: row;
    align-items: stretch;
    justify-content: center;
    flex-shrink: 0;
    width: 100%;

    @media (min-width: 768px) {
      width: ${({ full }) => (full ? "100%" : "49%")};
    }

    @media (min-width: 2560px) {
      width: ${({ full }) => (full ? "100%" : "32%")};
    }
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
`;

const Filters = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  font-size: 0.9em;
`;

const Filter = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 1em;
`;
const Metrics = styled.div`
  display: flex;
  flex-direction: row;

  width: 100%;
  gap: 0.5em;
  div {
    width: 25%;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    div {
        width: 100%;
      }
  
  }
`;

const Section = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  padding-bottom: 1.5em;
  gap: 1.5em;
  h3 {
    font-style: normal;
    font-weight: 700;
    font-size: 1.5em;
    line-height: 36px;
    color: #000000;
  }
  @media (max-width: 600px) {
    flex-direction: column;
   }
`;

if (
  !state.proposalsAreFetched ||
  !state.quorumIsFetched ||
  !state.thresholdIsFetched ||
  !state.votersAreFetched ||
  !state.totalHoldersIsFetched ||
  !state.totalVotingPowerIsFetched
) {
  return <>Loading...</>;
}
const quorumToReach =
  (parseInt(yoctoToNear(state.totalVotingPower)) * state.quorum) / 100 / 100;
const quorumToReachPercentage = state.quorum / 100;
return (
  <Container>
    <Section>
      <h3>Proposals metrics</h3>
      <Metrics>
        <Widget
          src={`${authorId}/widget/Governance.Metric.Card`}
          props={{
            value: (
              <>{numberWithCommas(parseInt(quorumToReach.toFixed(0)))} VP </>
            ),
            label: (
              <>
                Quorum ({quorumToReachPercentage}% of total VP){" "}
                <i class="bi bi-info-circle" />
              </>
            ),
            tooltip:
              "A quorum is the minimum number of voting power required for a governing body to approve a proposal. ",
          }}
        />
        <Widget
          src={`${authorId}/widget/Governance.Metric.Card`}
          props={{
            value: <>{numberWithCommas(state.threshold)} VP</>,
            label: (
              <>
                Proposal threshold {q} <i class="bi bi-info-circle" />
              </>
            ),
            tooltip:
              "Proposal thresholds are the criteria someone needs to meet in order to introduce a proposal that will be voted on.",
          }}
        />
        <Widget
          src={`${authorId}/widget/Governance.Metric.Card`}
          props={{
            value: (
              <>
                {numberWithCommas(state.voters)} /{" "}
                {numberWithCommas(state.totalHolders)}
              </>
            ),
            label: (
              <>
                Voters / VP Holders <i class="bi bi-info-circle" />
              </>
            ),
            tooltip:
              "Numbers of active voters / Number of accounts with voting power",
          }}
        />
      </Metrics>
    </Section>
    <Section>
      <h3>All Proposals</h3>
      <Widget
        src={`${authorId}/widget/Common.Button`}
        props={{
          children: (
            <>
              <i className="bi bi-16 bi-plus-lg"></i>
              Create Proposal
            </>
          ),
          onClick: () => State.update({ tab: "createproposal", content: "" }),
          variant: "success",
          href: `/${authorId}/widget/Governance.Index?tab=createproposal`,
        }}
      />
    </Section>
    {/* FILTERS NOT IMPLEMENTED YET
        <Filters>
            <Widget
                src={`${authorId}/widget/Common.SearchInput`}
                props={{ search: state.search, update: (s) => State.update(s) }}
            />

       
            <Filter>
                <Widget
                    src={`${authorId}/widget/Common.Filter`}
                    props={{
                        name: "Status",
                        options: [
                            { id: "all", text: "All", href: "#" },
                            { id: "idea", text: "Idea", href: "#" },
                            { id: "draft", text: "Draft", href: "#" },
                            { id: "review", text: "Review", href: "#" },
                            { id: "voting", text: "Voting", href: "#" },
                            { id: "inactive", text: "Inactive", href: "#" },
                            { id: "finalized", text: "Finalized", href: "#" },
                        ],
                        selected: "all",
                        update: (id) => alert(id),
                    }}
                />
                <Widget
                    src={`${authorId}/widget/Common.Filter`}
                    props={{
                        name: "Sort by",
                        options: [
                            { id: "proposalId", text: "Proposal Id", href: "#" },
                            { id: "title", text: "Proposal Title", href: "#" },
                        ],
                        selected: "proposalId",
                        update: (id) => alert(id),
                    }}
                />
            </Filter>
        </Filters>
         */}
    <div class="table-responsive w-100 mt-2">
      <Widget
        src={`${authorId}/widget/Governance.ProposalsTable`}
        props={{
          proposals: state.proposals,
          update: props.update,
          authorId,
          contractId,
        }}
      />
    </div>
  </Container>
);
