const startDate = props.startDate ?? undefined;
const endDate = props.endDate ?? undefined;
const hasStarted = startDate !== undefined;
const now = new Date().getTime();
const hasEnded = hasStarted && now > Number(endDate);
const inProgress = hasStarted && now < Number(endDate);
const diff1 = hasStarted ? (Number(endDate) - Number(startDate)) : null;
const diff2 = hasStarted ? (now - Number(startDate)) : null
const oneDay = 24 * 60 * 60 * 1000;
const progress = diff1 && diff2 ? diff2 / diff1 * 100 : 0;

const calculateTimeDifference = (date1, date2) => {
  const millisecondsInDay = 24 * 60 * 60 * 1000;
  const millisecondsInMinute = 60 * 1000;
  const millisecondsInHour = 60 * 60 * 1000;

  const diffMilliseconds = Math.abs(date1 - date2);

  if (diffMilliseconds >= millisecondsInDay) {
    const diffDays = Math.floor(diffMilliseconds / millisecondsInDay);
    return diffDays + ' day(s)';
  } else {
    if (diffMilliseconds >= millisecondsInHour) {
      const diffHours = Math.floor(diffMilliseconds / millisecondsInHour);
      return diffHours + ' hour(s)';

    }
    const diffMinutes = Math.floor(diffMilliseconds / millisecondsInMinute);
    return diffMinutes + ' minute(s)';
  }
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1em;
  width: 100%;
  padding: 1.25em 0.85em;
  box-shadow: rgba(0, 0, 0, 0.18) 0px 2px 4px;
  border-radius: 16px;
  background: #ffffff;
  
  & h4 {
    font-family: "Inter";
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    color: #797777;
  }
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

const Values = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0px;
  gap: 1px;
  width: 100%;

  & div {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0px;
    gap: 8px;

    & > h3 {
      font-family: "Inter";
      font-style: normal;
      font-weight: 600;
      font-size: 17px;
      line-height: 20px;
      color: #11181c;
    }

    & > h4 {
      font-family: "Inter";
      font-style: normal;
      font-weight: 500;
      font-size: 14px;
      line-height: 20px;
      color: #797777;
    }

    & > span {
      font-family: "Inter";
      font-style: normal;
      font-weight: 500;
      font-size: 19px;
      line-height: 23px;
      color: #7e868c;
    }
    & > div {
      display: flex;
      flex-direction: column;
      align-items: start;
      padding: 0px;
      gap: 1px;
    }
  }
  `;

const ProgressContainer = styled.div`
  border-radius: 0px;
  border: none;
  display: flex;
  padding: 0;
  position: relative;
  background: #f3f3f2;
  width: 100%;
  margin-bottom: 14px;

  .bar {
    min-width:0;
    border-radius: 0px;
    padding: 12px 20px;
    text-align: left;
    font-weight: 600;
    font-size: 15px;
    transition: all 0.4s ease-in-out;
    text-align: center;
    display: flex;
    justify-content: center;
    width: ${progress}%;
    background-color: #59e692;
    @media (max-width: 600px) {
      justify-content: start;
    }
  }
`;

return (
  <Container>
    <Heading><div><h2>Voting Period</h2></div></Heading>
    <Values>
      <div>
        <div>
          <h4>Start Date</h4>
          <h3>{hasStarted ? new Date(Number(startDate)).toLocaleDateString() : "-"}</h3>
        </div>
      </div>
      <div>
        <div>
          <h4>End Date</h4>
          <h3>{hasStarted ? new Date(Number(endDate)).toLocaleDateString() : "-"}</h3>
        </div>
      </div>
    </Values>
    <ProgressContainer>
      <span className="bar" />
    </ProgressContainer>
    {hasEnded && (<h4>The Voting Period has ended</h4>)}
    {!hasStarted && (<h4>Voting period has not started yet</h4>)}
    {inProgress && (<h4>Remaining time: {calculateTimeDifference(now, Number(endDate))}</h4>)}
  </Container>
);