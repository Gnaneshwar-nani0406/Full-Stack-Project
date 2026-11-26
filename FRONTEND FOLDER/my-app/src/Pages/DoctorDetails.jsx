import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import doc1 from './images/doctor_1.png';
import doc2 from './images/doctor_2.png';
import doc3 from './images/doctor_3.png';
import doc4 from './images/doctor_4.png';
import doc5 from './images/doctor_5.png';
import doc6 from './images/doctor_6.png';
import doc7 from './images/doctor_7.png';
import doc8 from './images/doctor_8.png';
import doc9 from './images/doctor_9.png';
import doc10 from './images/doctor_10.png';
import doc11 from './images/doctor_11 (1).png';
import doc12 from './images/doctor_12.png';
import doc13 from './images/doctor_13.png';
import doc14 from './images/doctor_14.png';
import doc15 from './images/doctor_15.png';

const categories = [
  { key: 'Cardiologist', name: '(Heart Specialist)' },
  { key: 'Dermatologist', name: '(Skin Specialist)' },
  { key: 'Neurologist', name: '(Brain Specialist)' },
  { key: 'Orthopedist', name: '(Bone & Joint Specialist)' },
  { key: 'Nephrologist', name: '(Kidney Specialist)' },
];

const doctorData = {
  Cardiologist: [
    { id: 1, name: 'Dr. Rajesh Kumar', title: 'Cardiologist', image: doc1 },
    { id: 2, name: 'Dr. Arjun Singh', title: 'Cardiologist', image: doc2 },
    { id: 3, name: 'Dr. Priya Sharma', title: 'Cardiologist', image: doc5 },
  ],
  Dermatologist: [
    { id: 4, name: 'Dr. Neha Verma', title: 'Dermatologist', image: doc4 },
    { id: 5, name: 'Dr. Vikram Desai', title: 'Dermatologist', image: doc3 },
    { id: 6, name: 'Dr. Ananya Gupta', title: 'Dermatologist', image: doc6 },
  ],
  Orthopedist: [
    { id: 7, name: 'Dr. Arun Reddy', title: 'Orthopedist', image: doc10 },
    { id: 8, name: 'Dr. Divya Nair', title: 'Orthopedist', image: doc8 },
    { id: 9, name: 'Dr. Aditya Singh', title: 'Orthopedist', image: doc15 },
  ],
  Nephrologist: [
    { id: 10, name: 'Dr. Radhika Patel', title: 'Nephrologist', image: doc7 },
    { id: 11, name: 'Dr. Nikhil Chopra', title: 'Nephrologist', image: doc11 },
    { id: 12, name: 'Dr. Arjun Das', title: 'Nephrologist', image: doc12 },
  ],
  Neurologist: [
    { id: 13, name: 'Dr. Rohit Malhotra', title: 'Neurologist', image: doc13 },
    { id: 14, name: 'Dr. Kavya Iyer', title: 'Neurologist', image: doc14 },
    { id: 15, name: 'Dr. Anjali Sharma', title: 'Neurologist', image: doc9 },
  ],
};

// Reusable Doctor Card Component
const DoctorCard = ({ doctor, specialist }) => (
  <Col md={4} lg={3} className="mb-4">
    <Card className="h-100 text-center doctor-card">
      <Card.Img variant="top" src={doctor.image} alt={doctor.name} className="card-img-top" />
      <Card.Body>
        <Card.Title>{doctor.name}</Card.Title>
        <Card.Text>{doctor.title}</Card.Text>
        <Button as={Link} to="/book-appointment" state={{ doctor: doctor.name, specialist }} variant="primary">
          Book Now
        </Button>
      </Card.Body>
    </Card>
  </Col>
);

const DoctorDetails = () => {
  const { category } = useParams();
  const selectedCategory = categories.find((item) => item.key === category);

  // Get doctors to display
  const getDisplayDoctors = () => {
    if (selectedCategory) {
      return doctorData[selectedCategory.key] || [];
    }
    // Show all doctors if no category selected
    return Object.values(doctorData).flat();
  };

  const doctors = getDisplayDoctors();
  const pageTitle = selectedCategory ? `${selectedCategory.name} Specialists` : 'All Doctors';
  const pageDesc = selectedCategory ? `Choose a doctor from our ${selectedCategory.name} team.` : 'Browse our full list of doctors and book an appointment.';

  return (
    <Container className="py-5 doctor-details-container">
      <h1 className="text-center mb-4">{pageTitle}</h1>
      <p className="text-center mb-5">{pageDesc}</p>
      
      <Row>
        {doctors.map((doctor) => (
          <DoctorCard 
            key={doctor.id} 
            doctor={doctor} 
            specialist={selectedCategory?.name || doctor.category} 
          />
        ))}
      </Row>

      {selectedCategory && (
        <div className="text-center mt-4">
          <Button as={Link} to="/Specialists" variant="secondary">
            Back to Specialist Categories
          </Button>
        </div>
      )}
    </Container>
  );
};

export default DoctorDetails;
