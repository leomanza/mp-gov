const accountId = props.accountId;
const authorId = "manzanal.near";

return (<Widget
    src={`${authorId}/widget/Common.SideWindow`}
    props={{
        title: "Create proposal",
        description: (
            <Widget
                src={`${authorId}/widget/Common.Label`}
                props={{ accountId: daoId, label: "Proposal Idea" }}
            />
        ),
        trigger: <>
            <i className="bi bi-16 bi-plus-lg"></i>
            Create Proposal
        </>,
        children: (
            <Widget
                src={`${authorId}/widget/Governance.Proposal.Create.Index`}
                props={{
                    daoId: state.daoId,
                    onClose: () =>
                        State.update({ ...state, showCreateProposal: false }),
                }}
            />
        ),
        minWidth: "500px"
    }}
/>)
