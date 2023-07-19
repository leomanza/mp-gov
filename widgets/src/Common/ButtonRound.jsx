const children = props.children ?? "Button";
const onClick = props.onClick ?? (() => { });
const href = props.href;
const variant = props.variant ?? "primary"; // primary, success, danger
const disabled = props.disabled
const tag = href ? "a" : "button";

const Wrapper = styled[tag]`
  border-radius: 50% !important;
  color: white;
  border: none !important;
  padding: 12px 12px;
  border: 1px solid #d7dbdf;
  -webkit-transition: background-color 1s, color 1s, -webkit-transform 0.5s;
     transition: background-color 1s, transform 0.5s;
  font-weight: 600;
  font-size: 14px;
  line-height: 15px;
  cursor: pointer;
  white-space: nowrap;

  color: ${(p) => {
    switch (p.variant) {
      case "primary":
        return "#11181c";
      case "success":
        return "#000";
      case "danger":
        return "#fff";
    }
  }} !important;
  background: ${(p) => {
    switch (p.variant) {
      case "primary":
        return "#FBFCFD";
      case "success":
        return "#59e692";
      case "danger":
        return "#e5484d";
    }
  }};

  &:hover,
  &:focus {
    border: 1px solid #262829;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.3;
    
`;
return (
  <Wrapper onClick={() => onClick} href={href} variant={variant} {...props} disabled={disabled}>
    {children}
  </Wrapper>
);
