ALTER TABLE appointment ADD COLUMN dentist_id UUID NOT NULL;
ALTER TABLE appointment ADD CONSTRAINT fk_appointment_dentist
FOREIGN KEY (dentist_id) REFERENCES dentist(id);