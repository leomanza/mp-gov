const accountId = props.accountId ?? context.accountId;
const authorId = props.authorId || "manzanal.near";
const contractId = props.contractId;
const META_VOTE_CONTRACT_ID = "meta-vote.near";
const edit = props.edit ?? false;
const mpip_id = props.mpip_id ?? null;
const update = props.update;
if (!accountId) {
    return "Please connect your NEAR wallet :)";
}

State.init({
    title: null,
    titleError: null,
    shortDescription: null,
    shortDescriptionError: null,
    description: null,
    descriptionError: null,
    functionCall: "",
    functionCallError: "",
    proposalIsFetched: false,
    isValid: false,
    proposalThresholdIsFetched: false,
    thresholdPassed: false,
    allVotingPower: null,
    allVotingPowerIsFetched: false,
    storageRequired: null,
    storageRequiredIsFetched: false
});

const yoctoToNear = (amountYocto) =>
    new Big(amountYocto).div(new Big(10).pow(24)).toFixed(0);

const nearToYocto = (n) => {
    let by1e6 = Math.round(n * 1e6).toString(); // near * 1e6 - round
    let yoctosText = by1e6 + "0".repeat(18); //  mul by 1e18 => yoctos = near * 1e(6+18)
    return yoctosText;
}

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

if (!state.allVotingPowerIsFetched) {
    Near.asyncView(
        META_VOTE_CONTRACT_ID,
        "get_all_locking_positions",
        { voter_id: context.accountId, },
        "final",
        false
    ).then((allLockingPositions) => {
        const voting_power = allLockingPositions.reduce(
            (accumulator, lockingPosition) => accumulator + parseInt(lockingPosition.voting_power),
            0
        );
        const votingPowerYocto = voting_power.toLocaleString('fullwide', { useGrouping: false });
        State.update({ allVotingPower: votingPowerYocto, allVotingPowerIsFetched: true })
    }
    );
}

if (!state.proposalThresholdIsFetched && state.allVotingPowerIsFetched) {
    Near.asyncView(
        contractId,
        "check_proposal_threshold",
        { voting_power: state.allVotingPower },
        "final",
        false
    ).then((thresholdPassed) => State.update({ thresholdPassed, proposalThresholdIsFetched: true })
    );
}

if (!state.storageRequiredIsFetched) {
    Near.asyncView(
        contractId,
        "get_mpip_storage_near",
        {},
        "final",
        false
    ).then((storageRequired) => State.update({ storageRequired, storageRequiredIsFetched: true })
    );

}
if (edit && !state.proposalIsFetched && !state.proposalThresholdIsFetched && !state.storageRequiredIsFetched) return <>Loading...</>

const isEmpty = (string) => string == undefined || string == null || string == '';
const handleProposal = () => {
    if (!state.description.description) {
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
                body: state.description.description,
                data: "",
                extra: ""
            },
            gas: gas

        },
    ]);
};

const handleFormValid = () => {
    console.log("description", state.description)
    console.log("proposal threshold check", state.thresholdPassed)
    const isValid = !isEmpty(state.title) && !isEmpty(state.shortDescription) &&
        !isEmpty(state.description.description) && isEmpty(state.titleError) && isEmpty(state.descriptionError)
        && isEmpty(state.shortDescriptionError) && state.thresholdPassed;
    State.update({ isValid })
}

const onChangeDescription = (description) => {
    State.update({
        description
    });
    handleFormValid();
};

const onChangeShortDescription = (shortDescription) => {
    State.update({
        shortDescription
    });
    handleFormValid();
};

const onChangeTitle = (title) => {
    State.update({ title });
    handleFormValid();
}


const defaultDescription = state.description ? state.description :
    "# [Your Title Here]\n\n## Description\n\n[Detailed description of what the proposal is about.]\n\n## Why This Proposal?\n\n[Explanation of why this proposal is necessary or beneficial.]\n\n## Execution Plan\n\n[Description of how the proposal will be implemented.]\n\n## Timeline\n\n[Proposed timeline for the execution of the proposal.]";

const Label = styled.label`
    font-style: normal;
    font-weight: 600;
    font-size: 0.95em;
    line-height: 1.25em;
    color: #344054;
  `;
const ButtonsContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;

return (
    <>
        <div className="d-flex gap-3 flex-wrap">
            <div className="d-flex flex-column gap-3">
                <h5>Proposer</h5>
                <Widget
                    src="mob.near/widget/Profile.ShortInlineBlock"
                    props={{ accountId: accountId, tooltip: true }}
                />
            </div>
        </div>
        <Widget
            src={`${authorId}/widget/Common.Inputs.Text`}
            props={{
                label: "Title",
                placeholder: "Write a title for your proposal",
                value: state.title,
                onChange: (title) => onChangeTitle(title),
                validate: () => {
                    if (state.title.length > 50) {
                        State.update({
                            titleError: "Title must be less than 50 characters",
                        });
                        return;
                    }

                    State.update({ titleError: null });
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
                onChange: (shortDescription) => onChangeShortDescription(shortDescription),
                validate: () => {
                    if (state.shortDescription.length > 100) {
                        State.update({
                            shortDescriptionError: "Short Description must be less than 100 characters",
                        });
                        return;
                    }

                    State.update({ shortDescriptionError: null });
                },
                error: state.shortDescriptionError,
            }}
        />

        <Label>Description</Label>
        <Widget
            src="mob.near/widget/MarkdownEditorIframe"
            props={{
                onChange: (description) => onChangeDescription({ description }),
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
        <ButtonsContainer>
            <Widget
                src={`${authorId}/widget/Common.Button`}
                props={{
                    children: <><i class="bi bi-arrow-left" />Back</>,
                    onClick: () => State.update({ tabs: "home", content: "" }),
                    className: "mt-2",
                    variant: "primary",
                    href: `/${authorId}/widget/Governance.Index?tab=home`,

                }}
            />
            <Widget
                src={`${authorId}/widget/Common.Button`}
                props={{
                    children: edit ? "Edit Proposal" : "Create Proposal",
                    onClick: handleProposal,
                    className: "mt-2",
                    variant: "success",
                    disabled: !state.isValid
                }}
            />

        </ButtonsContainer>
        {!state.isValid && !state.thresholdPassed && <div className="text-danger d-flex justify-content-end text-right">Not enough voting power to create a proposal.</div>}
        {state.isValid && (<div className="text-info d-flex justify-content-end text-right">A deposit of {state.storageRequired} NEAR will be required for storage</div>)}
    </>
);
