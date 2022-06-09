import axios from "axios";
import React from "react";
import { useParams } from "react-router-dom";
import { apiBaseUrl } from "../constants";
import { addPatient, useStateValue } from "../state";
import { Patient } from "../types";
import EntryDetails from "./EntryDetails";
import { Button } from "@material-ui/core";
import AddEntryModal from "../AddEntryModal";
import { EntryFormValues } from "../AddEntryModal/AddEntryForm";


const PatientPage = () => {
    const [{ patients }, dispatch] = useStateValue();
    const [modalOpen, setModalOpen] = React.useState<boolean>(false);
    const [error, setError] = React.useState<string>();
    const { id } = useParams<{ id: string }>();
    const patient: Patient | undefined = patients[id as string];
    
    React.useEffect(() => {
        if (!patient || !patient.ssn)
            axios.get<Patient>(`${apiBaseUrl}/patients/${id as string}`)
                .then(({data: patient}) => dispatch(addPatient(patient)))
                .catch(e => console.error(e));
    }, [dispatch, patient]);

    const openModal = (): void => setModalOpen(true);
    const submitNewEntry = (values: EntryFormValues): void => {
        axios.post<Patient>(`${apiBaseUrl}/patients/${id as string}/entries`, values)
            .then(({data: patient}) => {
                dispatch(addPatient(patient));
                closeModal();
            })
            .catch(e => console.error(e));
    };
    const closeModal = (): void => {
      setModalOpen(false);
      setError(undefined);
    };
  
    return patient ? <>
        <h2>{patient.name} ({patient.gender})</h2>
        <span>ssn: {patient.ssn}</span><br/>
        <span>occupation: {patient.occupation}</span>
        {patient?.entries?.length ? 
        <>
            <h3>Entries</h3>
            {patient?.entries?.map(entry => 
                <div key={entry.id}>
                    <EntryDetails {...{entry}}/>
                </div>
            )}
        </> : <h3>No entries</h3>}
        <AddEntryModal
            modalOpen={modalOpen}
            onSubmit={submitNewEntry}
            error={error}
            onClose={closeModal}
        />
        <Button variant="contained" onClick={() => openModal()}>
            Add New Entry
        </Button>
    </> : <></>;
};

export default PatientPage;
  