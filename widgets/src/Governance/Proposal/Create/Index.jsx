const accountId = props.accountId ?? context.accountId;
const authorId = "manzanal.near";
const onClose = props.onClose;
const edit = props.edit;
const mpip_id = props.mpip_id ?? null;

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

return (
  <Wrapper>
    <div className="d-flex justify-content-between align-items-center">
      <FormHeader>Create Proposal</FormHeader>
    </div>
    <div className="d-flex gap-3 flex-wrap">
      <div className="d-flex flex-column gap-3">
        <h5>Proposer</h5>
        <Widget
          src="mob.near/widget/Profile.ShortInlineBlock"
          props={{ accountId: accountId, tooltip: true }}
        />
      </div>
    </div>
    <div className="d-flex flex-column gap-2">

      <Widget
        src={`${authorId}/widget/Governance.Proposal.Create.Text`}
        props={{edit, mpip_id}}
      />

    </div>
  </Wrapper>
);