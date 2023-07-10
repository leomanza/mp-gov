const daoId = props.daoId ?? "metapool.sputnik-dao.near";
const authorId = "manzanal.near";
const proposal = JSON.parse(JSON.stringify(props.proposal)) ?? {
  id: 1,
  proposer: "manzanal.near",
  description:
    "Bitcoin ipsum dolor sit amet. Genesis block block reward sats to the moon transaction pizza when lambo? Transaction, hodl, difficulty Bitcoin Improvement Proposal to the moon whitepaper miner? Merkle Tree freefall together inputs UTXO, timestamp server blocksize private key hash. UTXO transaction halvening hash electronic cash wallet miner electronic cash? Freefall together hodl.",
  kind: { Improvement: { member_id: "manzanal.near", role: "Member" } },
  status: "In Progress",
  vote_counts: { community: [3, 0, 2], council: [1, 6, 0] },
  votes: { "metapool-approver.near": "Approve" },
  submission_time: "1682527782646393764",
};

proposal.type =
  typeof proposal.kind === "string"
    ? proposal.kind
    : Object.keys(proposal.kind)[0];
proposal.type = proposal.type.replace(/([A-Z])/g, " $1").trim(); // Add spaces between camelCase

proposal.status = proposal.status.replace(/([A-Z])/g, " $1").trim(); // Add spaces between camelCase

// ==============================
// Styled Components
// ==============================

const Wrapper = styled.div`
  max-width: 900px;
  background-color: #fff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: rgba(0, 0, 0, 0.18) 0px 2px 4px;

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


const FooterButton = styled.a`
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 0.5em 1em;
  gap: 0.5em;
  width: 48%;
  height: 2.5em;
  background: #fafafa;
  border: 1px solid #eceef0;
  border-radius: 50px;
  flex: none;
  order: 0;
  flex-grow: 0;
  font-style: normal;
  font-weight: 600;
  font-size: 0.9em;
  line-height: 1em;
  text-align: center;
  color: ${({ blue, disabled }) =>
    disabled ? "#878a8e" : blue ? "#006adc" : "#101828"};

  &:hover {
    ${({ disabled }) =>
      disabled ? "color: #878a8e; text-decoration: none;" : ""}
  }
`;

const Footer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;


return (
  <Wrapper>
    <div className="d-flex justify-content-between align-items-center">
      <div>
        <Text bold> ID:#{proposal.id}</Text>
      </div>
      <Widget
        src={`${authorId}/widget/Common.Badge`}
        props={{ value: proposal.status }}
      />
    </div>
    <div>
       <Widget
        src="mob.near/widget/Profile.ShortInlineBlock"
        props={{ accountId: proposal.proposer, tooltip: true }}
      />
    </div>
    <div>
        <Text bold>{proposal.description}</Text>
    </div>

    <div>
      <Widget
        src={`${authorId}/widget/Governance.Proposal.VotesInLineBlock`}
        props={{
          daoId: daoId,
          proposal: proposal,
        }}
      />
    </div>
    <Footer>
    <FooterButton
      href={`/${ownerId}/widget/Index?tab=proposal&accountId=${accountId}`}
      onClick={() =>
        props.update({
          tab: "proposal",
          content: "",
          search: "",
          accountId,
        })
      }
    >
      View details
    </FooterButton>
    </Footer>

  </Wrapper>
);
