const proposals = props.proposals;
const authorId = "manzanal.near";
const contractId = "v003.mpip.near";
let metrics = fetch("https://validators.narwallets.com/metrics_json");

State.init({
});
const yoctoToNear = (amountYocto) =>
  new Big(amountYocto).div(new Big(10).pow(24)).toFixed(0);

const formatStatus = (status) => {
  switch(status) {
    case 'VotingProcess': return "In Progress";
    case 'Draft': return "Draft";
    case 'Active': return "Active";
    case "Accepted": return "Succeeded";
    case "Rejected": return "Rejected";
    case "Canceled": return "Canceled"
  }
}

const getProposalState = (mpip_id) => {
  const state = Near.view(contractId, "get_proposal_state", {
    mpip_id, total_voting_power: metrics.body.vote_totalVotingPower.toFixed(0) + "000000000000000000000000"
  });
  return formatStatus(state)
}
const getProposalVotes = (mpip_id) => {
  const proposalVotes = Near.view(contractId, "get_proposal_votes", {
    mpip_id
  });
  if (!proposalVotes.has_voted.length) return "-"
  const voting_power = proposalVotes.has_voted.reduce(
    (accumulator, vote) => accumulator + parseInt(vote.voting_power),
    0
  );
  return yoctoToNear(voting_power);
}

const Link = styled.a`
  font-style: normal;
  font-weight: 600;
  font-size: 0.95em;
  line-height: 1em;
  text-align: center;
  color: #66a0ff;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 0.5em;

  svg {
    transition: transform 0.2s ease-in-out;
  }

  &:hover {
    svg {
      transform: translateX(5px) scale(1.1);
    }
  }
`;

if (!metrics) return <>Loading...</>;

return (
  <div class="table-responsive w-100 mt-2">
    <table class="table table-striped table-bordered">
      <thead>
        <tr>
          <th class="text-center">MPIP</th>
          <th class="text-center">Title</th>
          <th class="text-center">Short Description</th>
          <th class="text-center">Status</th>
          <th class="text-center">Voting Start</th>
          <th class="text-center">Voting End </th>
          <th class="text-center">Voting Power</th>
        </tr>
      </thead>
      <tbody>
        {!proposals || proposals.length == 0 && (<>No proposals created</>)}
        {proposals.length > 0 && proposals.map((proposal) => (
          <tr className="align-middle">
            <td class="text-start">
              <span>
                {proposal.mpip_id}
              </span>
            </td>
            <td class="text-center">

              <a href={`/${authorId}/widget/Governance.Index?tab=proposal&mpip_id=${proposal.mpip_id}`}
                onClick={() =>
                  props.update({
                    tab: "proposal",
                    mpip_id,
                  })
                }>
                {proposal.title}
              </a>
            </td>
            <td class="text-end text-nowrap">
              {proposal.short_description}
            </td>
            <td class="text-end">
              {getProposalState(proposal.mpip_id)}
            </td>
            <td class="text-end">
              {proposal.vote_start_timestamp ? new Date(Number(proposal.vote_start_timestamp)).toLocaleDateString() : "-"}
            </td>

            <td class="text-end text-nowrap">
              {proposal.vote_end_timestamp ? new Date(Number(proposal.vote_end_timestamp)).toLocaleDateString() : "-"}
            </td>
            <td class="text-end text-nowrap">
              {getProposalVotes(proposal.mpip_id)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)