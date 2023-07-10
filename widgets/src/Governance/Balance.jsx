const accountId = props.accountId ?? context.accountId
const META_VOTE_CONTRACT_ID = "meta-vote.near";
const contractId = "v003.mpip.near";

if (!accountId) return (<></>);

State.init({
  inUseVotingPower: null,
  inUseVotingPowerIsFetched: false,
  allVotingPower: null,
  allVotingPowerIsFetched: false,
  nearBalance: null,
  nearBalanceIsFetched: false
})
const yoctoToNear = (amountYocto) =>
  new Big(amountYocto).div(new Big(10).pow(24)).toFixed(0);

const numberWithCommas = (x) =>
  x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");

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
    State.update({ allVotingPower: yoctoToNear(voting_power), allVotingPowerIsFetched: true })}
  );
}

if (!state.inUseVotingPowerIsFetched) {
  Near.asyncView(
    contractId,
    "get_voter_used_voting_power",
    { voter_id: context.accountId, },
    "final",
    false
  ).then((inUseVotingPower) => 
    State.update({ inUseVotingPower: yoctoToNear(inUseVotingPower), inUseVotingPowerIsFetched: true })
  );
}

if (!state.nearBalanceIsFetched) {
  const account = fetch("https://rpc.mainnet.near.org", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: "dontcare",
      method: "query",
      params: {
        request_type: "view_account",
        finality: "final",
        account_id: accountId,
      },
    }),
  });
  const { amount, storage_usage } = account.body.result;
  const NEAR_DECIMALS = 24;
  const COMMON_MIN_BALANCE = 0.05;
  if (!amount) return "-";
  const availableBalance = Big(amount || 0).minus(
    Big(storage_usage).mul(Big(10).pow(19))
  );
  const balance = availableBalance
    .div(Big(10).pow(NEAR_DECIMALS))
    .minus(COMMON_MIN_BALANCE);
   
   State.update({ nearBalance: balance.lt(0) ? "0" : balance.toFixed(5, BIG_ROUND_DOWN), nearBalanceIsFetched: true })
}


const Balances = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 1em 1em;
  gap: 1em;
  background: #eceef0;
  border-radius: 100px;
  flex: none;
  order: 0;
  flex-grow: 0;
  font-style: normal;
  font-weight: 600;
  font-size: 0.9em;
  line-height: 1em;
  color: #11181c;
`;
const wallet = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-wallet" viewBox="0 0 16 16">
  <path d="M0 3a2 2 0 0 1 2-2h13.5a.5.5 0 0 1 0 1H15v2a1 1 0 0 1 1 1v8.5a1.5 1.5 0 0 1-1.5 1.5h-12A2.5 2.5 0 0 1 0 12.5V3zm1 1.732V12.5A1.5 1.5 0 0 0 2.5 14h12a.5.5 0 0 0 .5-.5V5H2a1.99 1.99 0 0 1-1-.268zM1 3a1 1 0 0 0 1 1h12V2H2a1 1 0 0 0-1 1z" />
</svg>

if (!state.allVotingPowerIsFetched || !state.inUseVotingPowerIsFetched || !state.nearBalanceIsFetched) return (<>Loading...</>);

return (
  <Balances>
    {wallet}
    <span>{numberWithCommas(state.allVotingPower - state.inUseVotingPower)} VP</span>
    <span>{state.nearBalance} Ⓝ</span>
  </Balances>
);