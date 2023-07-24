const addressForComments = "mpipComment";
const addressForProposals = "mpipComment";
const authorId = props.authorId || "manzanal.near";

const index = {
  action: addressForComments,
  key: props.item,
  options: {
    limit: props.limit ?? 3,
    order: "desc",
    accountId: props.accounts,
    subscribe: props.subscribe,
  },
};

const raw = !!props.raw;

const renderItem = (a) =>
  a.value.type === "md" && (
    <div key={JSON.stringify(a)}>
      <Widget
        src={`${authorId}/widget/Governance.Comment.Index`}
        props={{
          accountId: a.accountId,
          blockHeight: a.blockHeight,
          highlight:
            a.accountId === props.highlightComment?.accountId &&
            a.blockHeight === props.highlightComment?.blockHeight,
          raw,
          authorId
        }}
      />
    </div>
  );

return (
  <div>
    <Widget
      src={`${authorId}/widget/Governance.Comment.ManualIndexFeed`}
      props={{
        authorId,
        index,
        reverse: true,
        renderItem,
        nextLimit: 10,
        loadMoreText: "Show earlier comments...",
      }}
    />
  </div>
);