const proposals = props.proposals;
const authorId = "manzanal.near";
const contractId = "v003.mpip.near";
State.init({
});
const yoctoToNear = (amountYocto) =>
  new Big(amountYocto).div(new Big(10).pow(24)).toFixed(0);

const calculateTimeDifference = (date1, date2) => {
  const millisecondsInDay = 24 * 60 * 60 * 1000;
  const millisecondsInMinute = 60 * 1000;
  const millisecondsInHour = 60 * 60 * 1000;

  const diffMilliseconds = Math.abs(date1 - date2);

  if (diffMilliseconds >= millisecondsInDay) {
    const diffDays = Math.floor(diffMilliseconds / millisecondsInDay);
    return diffDays + ' day(s)';
  } else {
    if (diffMilliseconds >= millisecondsInHour) {
      const diffHours = Math.floor(diffMilliseconds / millisecondsInHour);
      return diffHours + ' hour(s)';

    }
    const diffMinutes = Math.floor(diffMilliseconds / millisecondsInMinute);
    return diffMinutes + ' minute(s)';
  }
}

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

const statusColor = (status) => {
  return status === "Accepted" || status == "Executed"
    ? "#28a930"
    : status === "VotingProcess"
      ? "#58a1ff"
      : status === "Rejected" || status == "Canceled"
        ? "#dc3545"
        : "#6c757d";
}

const getProposalState = (mpip_id) => {
  const state = Near.view(contractId, "get_proposal_state", {
    mpip_id
  });
  return formatStatus(state);
}

const getProposalStateColor = (mpip_id) => {
  const state = Near.view(contractId, "get_proposal_state", {
    mpip_id
  });
  const color = statusColor(state);
  console.log("COLOR", color)
  return color;
}

const getProposalVotes = (mpip_id) => {
  const proposalVotes = Near.view(contractId, "get_proposal_votes", {
    mpip_id
  });
  if (!proposalVotes.has_voted.length) return "0VP"
  const voting_power = proposalVotes.has_voted.reduce(
    (accumulator, vote) => accumulator + parseInt(vote.voting_power),
    0
  );
  return yoctoToNear(voting_power);
}

const getVotingTimeRemaining = (proposal) => {
  if (proposal.vote_start_timestamp && proposal.vote_end_timestamp) {
    const now = new Date().getTime();
    if (now > Number(proposal.vote_end_timestamp)) {
      return "Voting has ended";
    }

    const timeRemaining = calculateTimeDifference(now, Number(proposal.vote_end_timestamp))
    return `Voting ends in ${timeRemaining}`
  }
  return "Voting has not started yet";
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

const Label = styled.span`
  font-style: normal;
  font-weight: 600;
  font-size: 0.875rem;
  line-height: 1em;
  text-align: center;
  color: #4a5568;
`;
const Value = styled.span`
  font-style: normal;
  font-weight: 600;
  font-size: 1rem;
  line-height: 1em;
  text-align: center;
  color: ${(p) => (p.color ? p.color : "#000")};
`;

const Cell = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: ${(p) => (p.end ? "end" : "start")} ;
  align-items: ${(p) => (p.end ? "end" : "start")} ;
  padding: 0.75em;
  gap: 0.75em;
`;

const Container = styled.div`
  width: 100%;
  margin-bottom: 2em;
`;

return (
  <Container class="table-responsive">
    <table class="table table-striped">
      <tbody>
        {!proposals || proposals.length == 0 && (<>No proposals created</>)}
        {proposals.length > 0 && proposals.map((proposal) => (
          <tr className="align-middle">
            <td class="text-start">

              <a href={`/${authorId}/widget/Governance.Index?tab=proposal&mpip_id=${proposal.mpip_id}`}
                onClick={() =>
                  props.update({
                    tab: "proposal",
                    mpip_id,
                  })
                }>
                <Cell>
                  <Label> Prop {proposal.mpip_id} - {proposal.title}</Label>
                  <Value>{proposal.short_description}</Value>
                </Cell>

              </a>
            </td>
            <td class="text-end">
              <Cell end>
                <Label>Status</Label>
                <Value color={getProposalStateColor(proposal.mpip_id)}>{getProposalState(proposal.mpip_id)}</Value>
              </Cell>
            </td>
            <td class="text-end">

              <Cell end>
                <Label>{getVotingTimeRemaining(proposal)}</Label>
                <Value> {getProposalVotes(proposal.mpip_id)}</Value>
              </Cell>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </Container>
)