CREATE TABLE appointment (
    id UUID PRIMARY KEY,
    patient_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    status VARCHAR(20) NOT NULL,
    notes TEXT,
    image_url VARCHAR(255),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_appointment_patient FOREIGN KEY (patient_id) REFERENCES patient(id)
);