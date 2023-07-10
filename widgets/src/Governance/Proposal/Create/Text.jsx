const accountId = props.accountId ?? context.accountId;
const authorId = "manzanal.near";
const contractId = "v003.mpip.near";
const edit = props.edit ?? false;
const mpip_id = props.mpip_id ?? null;
if (!accountId) {
    return "Please connect your NEAR wallet :)";
}

State.init({
    title: "",
    titleError: "",
    shortDescription: "",
    shortDescriptionError: "",
    description: null,
    descriptionError: "",
    functionCall: "",
    functionCallError: "",
    proposalIsFetched: false
});


if (edit && !state.proposalIsFetched) {
    Near.asyncView(
        contractId,
        "get_proposal",
        { mpip_id: parseInt(mpip_id) },
        "final",
        false
    ).then((proposal) => State.update({ title: proposal.title, shortDescription: proposal.short_description, description: proposal.body, proposalIsFetched: true })
    );
}
if (edit && !state.proposalIsFetched) return <>Loading...</>


const handleProposal = () => {
    if (!state.description) {
        State.update({
            error: "Please enter a description",
        });
        return;
    }

    const gas = 300000000000000;
    Near.call([
        {
            contractName: contractId,
            methodName: edit ? "update_proposal" : "create_proposal",
            args: {
                mpip_id: mpip_id ? parseInt(mpip_id) : null,
                title: state.title,
                short_description: state.shortDescription,
                body: state.description,
                data: "",
                extra: ""
            },
            gas: gas

        },
    ]);
};

const onChangeDescription = (description) => {
    State.update({
        description,
        error: undefined,
    });
};

const defaultDescription = state.description ? state.description :
    "# [Your Title Here]\n\n## Description\n\n[Detailed description of what the proposal is about.]\n\n## Why This Proposal?\n\n[Explanation of why this proposal is necessary or beneficial.]\n\n## Execution Plan\n\n[Description of how the proposal will be implemented.]\n\n## Timeline\n\n[Proposed timeline for the execution of the proposal.]";

const Label = styled.label`
    font-style: normal;
    font-weight: 600;
    font-size: 0.95em;
    line-height: 1.25em;
    color: #344054;
  `;
return (
    <>
        <Widget
            src={`${authorId}/widget/Common.Inputs.Text`}
            props={{
                label: "Title",
                placeholder: "Write a title for your proposal",
                value: state.title,
                onChange: (title) => State.update({ title }),
                validate: () => {
                    if (state.title.length > 50) {
                        State.update({
                            titleError: "Title must be less than 50 characters",
                        });
                        return;
                    }

                    State.update({ titleError: "" });
                },
                error: state.titleError,
            }}
        />

        <Widget
            src={`${authorId}/widget/Common.Inputs.Text`}
            props={{
                label: "Short Description",
                placeholder: "Write a one liner about your proposal",
                value: state.shortDescription,
                onChange: (shortDescription) => State.update({ shortDescription }),
                validate: () => {
                    if (state.shortDescription.length > 100) {
                        State.update({
                            shortDescriptionError: "Short Description must be less than 100 characters",
                        });
                        return;
                    }

                    State.update({ shortDescriptionError: "" });
                },
                error: state.shortDescriptionError,
            }}
        />

        <Label>Description</Label>
        <Widget
            src="mob.near/widget/MarkdownEditorIframe"
            props={{
                onChange: (description) => State.update({ description }),
                height: "400px",
                initialText: defaultDescription,
            }}
        />
        {state.descriptionError && <div className="text-danger">{state.descriptionError}</div>}
        <Widget
            src={`${authorId}/widget/Common.Inputs.TextArea`}
            props={{
                label: "Function Call Data (optional)",
                placeholder: "Write the function call to be executed after the proposal is approved.",
                value: state.functionCall,
                onChange: (functionCall) => State.update({ functionCall }),
                validate: () => {

                },
                error: state.functionCallError,
            }}
        />
        <div className="ms-auto">
            <Widget
                src={`${authorId}/widget/Common.Button`}
                props={{
                    children: "Cancel",
                    onClick: () => State.update({ tabs: "home", content: "" }),
                    className: "mt-2",
                    variant: "primary",
                    href: `/${authorId}/widget/Governance.Index?tab=home`
                }}
            />
            <Widget
                src={`${authorId}/widget/Common.Button`}
                props={{
                    children: edit ? "Edit Proposal" : "Create Proposal",
                    onClick: handleProposal,
                    className: "mt-2",
                    variant: "success",
                }}
            />
        </div>
    </>
);
