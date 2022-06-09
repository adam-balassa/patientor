import React from "react";
import { Grid, Button } from "@material-ui/core";
import { Field, Formik, Form } from "formik";

import { TextField, SelectField, Option, DiagnosisSelection } from '../components/FormField';
import { HealthCheckRating, Entry, UnionOmit } from "../types";
import { useStateValue } from "../state";

/*
 * use type Patient, but omit id and entries,
 * because those are irrelevant for new patient object.
 */
export type EntryFormValues = UnionOmit<Entry, "id">;

interface Props {
  onSubmit: (values: EntryFormValues) => void;
  onCancel: () => void;
}

const healthCheckRatingOptions: Option<HealthCheckRating>[] = [
  { value: HealthCheckRating.Healthy, label: "Healthy" },
  { value: HealthCheckRating.LowRisk, label: "Low risk" },
  { value: HealthCheckRating.HighRisk, label: "Hish risk" },
  { value: HealthCheckRating.CriticalRisk, label: "Critical" },
];

const typeOptions: Option<Entry['type']>[] = [
  { value: 'HealthCheck', label: 'Health-check' },
  { value: 'Hospital', label: 'Hospital' },
  { value: 'OccupationalHealthcare', label: 'Occupational healthcare' }
];


export const AddEntryForm = ({ onSubmit, onCancel }: Props) => {
  const [{ diagnosis }] = useStateValue();
  return (
    <Formik
      initialValues={{
        description: "",
        date: "",
        specialist: "",
        diagnosisCodes: [],
        healthCheckRating: HealthCheckRating.Healthy,
        type: 'HealthCheck'
      }}
      onSubmit={onSubmit}
      validate={(values) => {
        console.log(values);
        
        const requiredError = "Field is required";
        const errors: { [field: string]: string } = {};
        if (!values.description) {
          errors.description = requiredError;
        }
        if (!values.date) {
          errors.date = requiredError;
        }
        if (!values.specialist) {
          errors.specialist = requiredError;
        }
        switch (values.type) {
          case 'HealthCheck':
            if (!values.healthCheckRating) errors.healthCheckRating = requiredError;
            break;
          case 'Hospital':
            if (!values.discharge || !values.discharge.date) errors['discharge.date'] = requiredError;
            if (!values.discharge || !values.discharge.criteria) errors['discharge.criteria'] = requiredError;
            break;
          case 'OccupationalHealthcare':
            if (!values.employerName) errors.employerName = requiredError;
            break;
        }
        return errors;
      }}
    >
      {({ isValid, dirty, setFieldValue, setFieldTouched, values: { type } }) => {
        return (
          <Form className="form ui">
            <SelectField label="Select type" name="type" options={typeOptions} />
            <Field
              label="Description"
              placeholder="Description..."
              name="description"
              component={TextField}
            />
            <Field
              label="Date"
              placeholder="YYYY-MM-DD"
              name="date"
              component={TextField}
            />
            <Field
              label="Specialist"
              placeholder="Specialist..."
              name="specialist"
              component={TextField}
            />
            <DiagnosisSelection 
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              diagnoses={Object.values(diagnosis)}
            />
            {
              (() => {
                switch (type) {
                  case 'HealthCheck':
                    return <SelectField label="Health-check rating" name="healthCheckRating" options={healthCheckRatingOptions} />;
                  case 'Hospital':
                    return <Grid container spacing={3}>
                      <Grid item md={6}>
                        <Field
                          label="Discharge date"
                          placeholder="YYYY-MM-DD"
                          name="discharge.date"
                          component={TextField}
                        />
                      </Grid>
                      <Grid item md={6}>
                        <Field
                          label="Discharge criteria"
                          placeholder="Reason for discharge..."
                          name="discharge.criteria"
                          component={TextField}
                        />
                      </Grid>
                    </Grid>;
                  case 'OccupationalHealthcare':
                    return <>
                      <Field
                        label="Employer name"
                        placeholder="Emplyer..."
                        name="employerName"
                        component={TextField}
                      />
                      <Grid container spacing={3}>
                        <Grid item md={6}>
                          <Field
                            label="Start of sick leave"
                            placeholder="YYYY-MM-DD"
                            name="sickLeave.startDate"
                            component={TextField}
                          />
                        </Grid>
                        <Grid item md={6}>
                          <Field
                            label="End of sick leave"
                            placeholder="YYYY-MM-DD"
                            name="sickLeave.endDate"
                            component={TextField}
                          />
                        </Grid>
                      </Grid> 
                    </>;
                }
              })()
            }
            <Grid>
              <Grid item>
                <Button
                  color="secondary"
                  variant="contained"
                  style={{ float: "left" }}
                  type="button"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
              </Grid>
              <Grid item>
                <Button
                  style={{ float: "right" }}
                  type="submit"
                  variant="contained"
                  disabled={!dirty || !isValid}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
};

export default AddEntryForm;
