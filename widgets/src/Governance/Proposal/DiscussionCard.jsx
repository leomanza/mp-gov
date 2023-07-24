const authorId = props.authorId || "manzanal.near";
const commentsOpen = props.commentsOpen;
const blockHeight = props.blockHeight;
const onCommentButtonClick = props.onCommentButtonClick;
const onComment = props.onComment;
const showReply = props.showReply;
const commentItemIndex = props.commentItemIndex;
const highlightComment = props.highlightComment;
const commentsLimit = props.commentsLimit;
const raw = props.raw;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0;
  gap: 1em;
  width: 100%;
`;

const Heading = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0px;
  gap: 16px;
  width: 100%;

  & div {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0px;
    gap: 16px;

    & > h2 {
      font-family: "FK Grotesk";
      font-style: normal;
      font-weight: 700;
      font-size: 25px;
      line-height: 36px;
      color: #11181c;
    }

    & > span {
      font-family: "Inter";
      font-style: normal;
      font-weight: 500;
      font-size: 19px;
      line-height: 23px;
      color: #7e868c;
    }
  }
`;
return (
    <Container>
         <Heading><div><h2>Discussion</h2></div></Heading>
        {commentsOpen && blockHeight !== "now" && (
            <div className="mt-1 d-flex  align-items-center">
                <h5>I believe...</h5>
                <Widget
                    src={`${authorId}/widget/Common.CommentButton`}
                    props={{
                        onClick: onCommentButtonClick,
                    }}
                />
            </div>)}
        <div className="mt-3 ps-5 w-100">
            {showReply && commentsOpen && (
                <div className="mb-2">
                    <Widget
                        src={`${authorId}/widget/Governance.Comment.Compose`}
                        props={{
                            item: commentItemIndex,
                            onComment: onComment,
                        }}
                    />
                </div>
            )}

            <Widget
                src={`${authorId}/widget/Governance.Comment.Feed`}
                props={{
                    item: commentItemIndex,
                    highlightComment: highlightComment,
                    limit: commentsLimit,
                    subscribe: true,
                    raw,
                }}
            />
        </div>
    </Container>
)