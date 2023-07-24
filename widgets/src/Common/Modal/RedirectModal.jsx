const authorId = "manzanal.near";
const title = props.title || "Success!"
const description = props.description || "Proposal created successfully. Going back Home"
const href = props.href || `/${authorId}/widget/Governance.Index?tab=home`;
const showClose = props.showClose || false;
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  animation: ${fadeIn} 200ms ease-out;
  z-index: 10;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  position: fixed;
  inset: 50% auto auto 50%;
  transform: translate(-50%, -50%);
  border: none;
  padding: 1.5em 2em 2em;
  gap: 0.625em;
  isolation: isolate;
  animation: ${slideIn} 200ms ease-out;
  overflow-y: auto;
  background: #fff;
  z-index: 10;
  min-width: ${minWidth};
  max-width: 800px;

  &.focus-visible {
    outline: none !important;
  }
`;

const Container = styled.div`
  &.focus-visible {
    outline: none !important;
  }
`;

const Footer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: ${showClose ? "space-between" : "flex-end"};
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
    <Container>
        <Dialog.Root open={props.open}>
            <Dialog.Trigger asChild>
                <div style={{ display: "none" }} />
            </Dialog.Trigger>
            <Dialog.Overlay asChild>
                <Overlay />
            </Dialog.Overlay>
            <Dialog.Content asChild>
                <Content>
                    <Dialog.Title>{title}</Dialog.Title>
                    <Dialog.Description>
                        {description}
                    </Dialog.Description>
                    <Footer>
                        {showClose && (<Dialog.Close asChild>
                            <CloseButton href="/">Close</CloseButton>
                        </Dialog.Close>)}

                        <Widget
                            src={`${authorId}/widget/Common.Button`}
                            props={{
                                children: <>Ok</>,
                                href: href,
                                variant: "success",
                                onClick: () => {
                                    props.accept();
                                },
                            }}
                        />
                    </Footer>
                </Content>
            </Dialog.Content>
        </Dialog.Root>
    </Container>
);
