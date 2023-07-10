const author = "manzanal.near";
if (!context.accountId) {
  return "";
}
const addressForComments = "mpipComment";
const addressForProposals = "mpip";
const item = props.item;

const composeCommentData = () => {
  const data = {
    [addressForProposals]: {
      [addressForComments]: JSON.stringify(
        Object.assign({ item }, state.content)
      ),
    },
    index: {
      mpipComment: JSON.stringify({
        key: item,
        value: {
          type: "md",
        },
      }),
    },
  };

  return data;
};

State.init({
  onChange: ({ content }) => {
    State.update({ content });
  },
});

return (
  <>
    <Widget
      src="mob.near/widget/Common.Compose"
      props={{
        placeholder: "Reply",
        initialText: props.initialText,
        onChange: state.onChange,
        onHelper: ({ extractTagNotifications }) => {
          State.update({ extractTagNotifications });
        },
        composeButton: (onCompose) => (
          <CommitButton
            disabled={!state.content}
            force
            className="btn btn-dark rounded-3"
            data={composeCommentData}
            onCommit={() => {
              onCompose();
              props.onComment && props.onComment(state.content);
            }}
          >
            Comment
          </CommitButton>
        ),
      }}
    />
    {state.content && (
      <div className="mt-3">
        <Widget
          src={`${author}/widget/Governance.Comment.Index`}
          props={{
            item,
            accountId: context.accountId,
            content: state.content,
            blockHeight: "now",
          }}
        />
      </div>
    )}
  </>
);
