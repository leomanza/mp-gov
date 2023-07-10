const ownerId = "manzanal.near";
const handleAccept = props.handleAccept;

const Footer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const CloseButton = styled.a`
  padding: 0.75em 1em;
  gap: 0.5em;
  background: #fafafa;
  border: 1px solid #eceef0;
  border-radius: 50px;
  font-style: normal;
  font-weight: 600;
  font-size: 0.95em;
  line-height: 1em;
  text-align: center;
  color: #101828;
`;

return (
    <>
        <Dialog.Description>
            Do you want to remove your vote cast?
        </Dialog.Description>
        <Footer>
            <Dialog.Close asChild>
                <CloseButton href="/">Close</CloseButton>
            </Dialog.Close>
            <Widget
                src={`${ownerId}/widget/Common.Button`}
                props={{
                    children: <>Accept</>,
                    onClick: () => {
                        if (!state.agree) return;
                        handleAccept();
                    },
                }}
            />
        </Footer>
    </>
);
