import { useStateValue } from "../state";
import { Entry, HealthCheckRating } from "../types";
import { assertNever } from "../utils";

const EntryDetails = ({ entry }: { entry: Entry }) => {
    const [{ diagnosis }] = useStateValue();
    return <>{
      (() => {
        switch (entry.type) {
          case 'HealthCheck':
              return <>
                    <p>{entry.date} <i>{entry.description}</i></p>
                    <p>Rating: {HealthCheckRating[entry.healthCheckRating]}</p>
                    <ul>
                        {Object.keys(diagnosis).length && entry.diagnosisCodes?.map(code => <li key={code}>{code} {diagnosis[code].name}</li>)}
                    </ul>
                </>;
          case 'OccupationalHealthcare':
            return <>
                    <p>{entry.date} <i>{entry.description}</i></p>
                    <p>Employer: {entry.employerName}</p>
                    { entry.sickLeave && <p>Sick leave: {entry.sickLeave.startDate} - {entry.sickLeave.endDate}</p> }
                    <ul>
                        {Object.keys(diagnosis).length && entry.diagnosisCodes?.map(code => <li key={code}>{code} {diagnosis[code].name}</li>)}
                    </ul>
              </>;
          case 'Hospital':
            return <>
                  <p>{entry.date} <i>{entry.description}</i></p>
                  <p>Discharged on {entry.discharge.date}, due to {entry.discharge.criteria}</p>
                  <ul>
                      {Object.keys(diagnosis).length && entry.diagnosisCodes?.map(code => <li key={code}>{code} {diagnosis[code].name}</li>)}
                  </ul>
              </>;
          default:
              assertNever(entry);
  
      }})()
    }</>;
};
  
export default EntryDetails;