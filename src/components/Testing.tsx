import React, { useState } from "react";
import axios from "axios";

// Define types for form data
interface FormData {
  programId: string;
  registrationId: string;
  firstStudentFirstName: string;
  firstStudentLastName: string;
  firstStudentGrade: string;
  firstStudentAge: string;
  secondStudentFirstName: string;
  secondStudentLastName: string;
  secondStudentGrade: string;
  secondStudentAge: string;
  parentFirstName: string;
  parentLastName: string;
  contactNumber: string;
  programBought: string;
  city: string;
  state: string;
  quantity: string;
  firstName: string;
  lastName: string;
  address: string;
  zipCode: string;
  country: string;
  phone: string;
  email: string;
  amount: string;
  cardNumber: string;
  expirationDate: string;
  cvv: string;
}

// Define type for errors
interface Errors {
  [key: string]: string;
}

const Testing: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    programId: "",
    registrationId: "",
    firstStudentFirstName: "",
    firstStudentLastName: "",
    firstStudentGrade: "",
    firstStudentAge: "",
    secondStudentFirstName: "",
    secondStudentLastName: "",
    secondStudentGrade: "",
    secondStudentAge: "",
    parentFirstName: "",
    parentLastName: "",
    contactNumber: "",
    programBought: "",
    city: "",
    state: "",
    quantity: "",
    firstName: "",
    lastName: "",
    address: "",
    zipCode: "",
    country: "",
    phone: "",
    email: "",
    amount: "",
    cardNumber: "",
    expirationDate: "",
    cvv: "",
  });

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [errors, setErrors] = useState<Errors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateStepOne = (): boolean => {
    const requiredFields: (keyof FormData)[] = [
      "programId",
      "registrationId",
      "firstStudentFirstName",
      "firstStudentLastName",
      "firstStudentGrade",
      "firstStudentAge",
      "secondStudentFirstName",
      "secondStudentLastName",
      "secondStudentGrade",
      "secondStudentAge",
      "parentFirstName",
      "parentLastName",
      "contactNumber",
      "programBought",
      "city",
      "state",
      "quantity",
    ];
    const newErrors: Errors = {};
    requiredFields.forEach((field) => {
      if (!formData[field]) newErrors[field] = `${field} is required`;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStepTwo = (): boolean => {
    const requiredFields: (keyof FormData)[] = [
      "firstName",
      "lastName",
      "address",
      "zipCode",
      "country",
      "phone",
      "email",
      "amount",
      "cardNumber",
      "expirationDate",
      "cvv",
    ];
    const newErrors: Errors = {};
    requiredFields.forEach((field) => {
      if (!formData[field]) newErrors[field] = `${field} is required`;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStepOne()) {
      setErrors({});
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setErrors({});
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateStepTwo()) {
      try {
        await axios.post("/your-api-endpoint", formData);
        alert("Form submitted successfully!");
      } catch (error: unknown) {
        console.log(error);
        alert("Error submitting form: ");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {currentStep === 1 && (
        <div>
          <h2>Step 1: Student & Program Details</h2>
          <input
            name="programId"
            placeholder="Program ID"
            value={formData.programId}
            onChange={handleChange}
          />
          {errors.programId && <p>{errors.programId}</p>}
          <input
            name="registrationId"
            placeholder="Registration ID"
            value={formData.registrationId}
            onChange={handleChange}
          />
          {errors.registrationId && <p>{errors.registrationId}</p>}
          {/* Repeat for all Step 1 fields */}
          <button type="button" onClick={handleNext}>
            Next
          </button>
        </div>
      )}
      {currentStep === 2 && (
        <div>
          <h2>Step 2: Payment & Contact Details</h2>
          <input
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
          />
          {errors.firstName && <p>{errors.firstName}</p>}
          <input
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
          />
          {errors.lastName && <p>{errors.lastName}</p>}
          {/* Repeat for all Step 2 fields */}
          <button type="button" onClick={handleBack}>
            Back
          </button>
          <button type="submit">Submit</button>
        </div>
      )}
    </form>
  );
};

export default Testing;
