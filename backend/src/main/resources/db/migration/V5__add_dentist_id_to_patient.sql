ALTER TABLE patient ADD COLUMN dentist_id UUID;
ALTER TABLE patient ADD CONSTRAINT fk_patient_dentist FOREIGN KEY (dentist_id) REFERENCES dentist(id);